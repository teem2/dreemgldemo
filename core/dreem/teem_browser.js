// Copyright 2015 this2 LLC, MIT License (see LICENSE)
// this class

define.class('$dreem/teem_base', function(require, exports, self, baseclass){

	var Node = require('$base/node')
	var RpcProxy = require('$rpc/rpcproxy')
	var RpcMulti = require('$rpc/rpcmulti')
	var RpcPromise = require('$rpc/rpcpromise')
	var WebRTC = require('$rpc/webrtc')
	var BusClient = require('$rpc/busclient')
	var Mouse = require('$renderer/mouse_web')
	var Keyboard = require('$renderer/keyboard_web')
	var Touch = require('$renderer/touch_web')
	var renderer = require('$renderer/renderer')

	this.doRender = function(previous, parent){
		
		var globals = {
			teem:this, 
			screen:this.screen
		}
		globals.globals = globals

		// copy keyboard and mouse objects from previous
		if(!previous){
			if(!parent){
				this.touch = globals.touch = new Touch()
				this.mouse = globals.mouse = new Mouse()
				this.keyboard = globals.keyboard = new Keyboard()
				renderer.defineGlobals(this.touch, globals)
				renderer.defineGlobals(this.mouse, globals)
				renderer.defineGlobals(this.keyboard, globals)
			}
		}
		else{
			this.touch = globals.touch = previous.touch
			this.mouse = globals.mouse = previous.mouse
			this.keyboard = globals.keyboard = previous.keyboard
			// this isnt exactly right.
			globals.keyboard.removeAllListeners()
			globals.mouse.removeAllListeners()

			this.screen.copyProps(previous.screen)
		}

		if(parent){
			this.screen.device = parent.screen.device
		}

		renderer.renderDiff(this.screen, parent, previous && previous.screen, globals)

		if(this.screen.title !== undefined) document.title = this.screen.title 
				
		if(previous) this.screen.setDirty(true)

		this.rendered = true
	}

	this.createBus = function(){
		
		this.bus = new BusClient(location.pathname)
		
		this.rpcpromise = new RpcPromise(this.bus)
		
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

				if(!this.rendered) this.doRender()
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
				this.rpcpromise.resolveResult(msg)
			}
		}.bind(this)
	}

	this.log = function(){
		var args = Array.prototype.slice.apply(arguments)
		RpcProxy.isJsonSafe(args)
		this.bus.send({
			type:'log',
			args:args
		})
		console.log.apply(console, args)
	}

	this.atConstructor = function(previous, parent){

		this.parent = parent
		
		if(previous){
			this.reload = (previous.reload||0)+1
			console.log("Reload " + this.reload)
		}

		// how come this one doesnt get patched up?
		baseclass.prototype.atConstructor.call(this)

		// web environment
		if(previous){
			this.bus = previous.bus
			this.rendered = true
			this.rpcpromise = previous.rpcpromise
		}
		else this.createBus()

		if(!parent) window.teem = this

		//ooookay. so. lets 'render' ourselves to spawn up the first level 
		var composition = this.render()
		
		// lets see which objects need to be RPC-proxified
		for(var i = 0; i < composition.length; i++){
			// ok so as soon as we are stubbed, we need to proxify the object
			var obj = composition[i]
			if(obj.constructor.stubbed){ // we are a stubbed out class
				var rpcid = obj.name || obj.constructor.name
				composition[i] = RpcProxy.createFromStub(obj, Node.prototype, rpcid, this.rpcpromise)
			}
			else{
				renderer.defineGlobals(obj, {teem:this})
			}
		}

		// splat our children into the teem object
		renderer.mergeChildren(this, composition)
		// alright now we find the screen we wanna render somehow
		this.screen = this.screens.browser

		if(previous || parent) this.doRender(previous, parent)
	}
})