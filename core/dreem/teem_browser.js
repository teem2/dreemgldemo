// Copyright 2015 this2 LLC, MIT License (see LICENSE)
// this class

define.class('$dreem/teem_base', function(require, exports, self, baseclass){

	var Node = require('$base/node')
	var RpcProxy = require('$rpc/rpcproxy')
	var RpcMulti = require('$rpc/rpcmulti')
	var RpcPromise = require('$rpc/rpcpromise')
	var WebRTC = require('$rpc/webrtc')
	var renderer = require('$renderer/renderer')
	var BusClient = require('$rpc/busclient')
	var Mouse = require('$renderer/mouse_$rendermode')

	self.doDiff = function(prev, next, name){
		if(!prev) return next
		if(define.classHash(prev.constructor) !== define.classHash(next.constructor)){ // lets replace it with the new one
			return next
		}
		else{ // lets diff the children
			// lets iterate the new, checking if the old has a different hash.
			var next_children = next.children
			var prev_children = prev.children
			if(next_children) for(var i = 0; i < next_children.length; i++){
				// lets check define.classHash
				next_children[i] = this.doDiff(prev_children[i], next_children[i], name+'child['+i+']')
			}
			prev.children = next_children
		}
		console.log(name)
		return prev
	}

	self.doRender = function(previous){

		// alright so, what we need to do is 
		renderer.render(this.screen, null, {teem:this, screen:this.screen}, function rerender(what){
			
		}.bind(this))
		
		// lets go and render the screen
		this.screen.mouse = new Mouse()

		// okay! lets call diff on a childnode

		if(previous){
			this.screen = this.screen.diff(previous.screen)
			//this.screen = this.doDiff(previous.screen, this.screen, 'screen')
			//console.log(this.screen === previous.screen)
		}


		var wireinits = []
		renderer.connectWires(this.screen, wireinits)

		renderer.fireInit(this.screen)

		for(var i = 0; i < wireinits.length; i++){
			wireinits[i]()
		}

		// lets redraw screen
		if(previous) this.screen.device.redraw()
	}

	self.createBus = function(){
		
		this.bus = new BusClient(location.pathname)
		
		var rpcpromise = new RpcPromise(this.bus)
		
		this.bus.atMessage = function(msg){
			if(msg.type == 'sessionCheck'){
				if(this.session) location.href = location.href
				if(this.session != msg.session){
					this.bus.send({type:'connectScreen'})
				}
			}  
			else if(msg.type == 'webrtcOffer'){
				if(msg.index != this.index){ // we got a webrtcOffer
					this.webrtc_answer = WebRTC.acceptOffer(msg.offer)
					this.webrtc_answer.onIceCandidate = function(candidate){
						//console.log('sending answer candidate')
						this.bus.send({type:'webrtcAnswerCandidate', candidate:candidate, index: this.index})
					}
					this.webrtc_answer.onAnswer = function(answer){
						//console.log('sending answer')
						this.bus.send({type:'webrtcAnswer', answer:answer, index: this.index})
					}
					this.webrtc_answer.atMessage = this.webrtc_offer.atMessage
				}
			}
			else if(msg.type == 'webrtcAnswer'){
				if(this.webrtc_offer && msg.index != this.index){
					//console.log('accepting answer')
					this.webrtc_offer.acceptAnswer(msg.answer)
				}
			}
			else if(msg.type == 'webrtcAnswerCandidate'){
				if(this.webrtc_offer && msg.index != this.index){
					//console.log('adding answer candidate')
					this.webrtc_offer.addCandidate(msg.candidate)
				}
			}
			else if(msg.type == 'webrtcOfferCandidate'){
				if(this.webrtc_answer && msg.index != this.index){
					//console.log('adding offer candidate')
					this.webrtc_answer.addCandidate(msg.candidate)
				}
			}
			else if(msg.type == 'connectScreenOK'){
				//RpcProxy.createFromDefs(msg.rpcdef, this, rpcpromise)

				this.webrtc_offer = WebRTC.createOffer()
				this.index = msg.index

				this.webrtc_offer.atIceCandidate = function(candidate){
					this.bus.send({type:'webrtcCandidate', candidate:candidate, index: this.index})
				}.bind(this)

				this.webrtc_offer.atOffer = function(offer){
					this.bus.send({type:'webrtcOffer', offer:offer, index: this.index})
				}.bind(this)

				this.doRender()
			}
			else if(msg.type == 'connectScreen'){
				//var obj = RpcProxy.decodeRpcID(this, msg.rpcid)
				//if(!obj) console.log('Cannot find '+msg.rpcid+' on join')
				//else obj.createIndex(msg.index, msg.rpcid, rpcpromise)
			}
			else if(msg.type == 'attribute'){
				var obj = RpcProxy.decodeRpcID(this, msg.rpcid)
				if(obj) obj[msg.attribute] = msg.value
			}
			else if(msg.type == 'method'){
				// lets call our method on root.
				if(!this.root[msg.method]){
					return console.log('Rpc call received on nonexisting method ' + msg.method)
				}
				RpcProxy.handleCall(this.root, msg, this.bus)
			}
			else if (msg.type == 'return'){
				rpcpromise.resolveResult(msg)
			}
		}.bind(this)
	}

	self.atConstructor = function(){
		var previous = define.teemClient
		define.teemClient = this

		if(previous){
			this.reload = (previous.reload||0)+1
		}

		// how come this one doesnt get patched up?
		baseclass.prototype.atConstructor.call(this)

		// web environment
		if(previous) this.bus = previous.bus
		else this.createBus()

		window.teem = this

		//ooookay. so. lets 'render' ourselves to spawn up the first level 
		var composition = this.render()

		// lets see which objects need to be RPC-proxified
		for(var i = 0; i < composition.length; i++){
			// ok so as soon as we are stubbed, we need to proxify the object
			var obj = composition[i]
			if(obj.constructor.stubbed){ // we are a stubbed out class
				composition[i] = RpcProxy.createFromStub(obj)
			}
			else{
				renderer.defineGlobals(obj, {teem:this})
			}
		}

		// splat our children into the teem object
		renderer.mergeChildren(this, composition)
		// alright now we find the screen we wanna render somehow
		this.screen = this.screens.browser

		if(previous) this.doRender(previous)
	}
})