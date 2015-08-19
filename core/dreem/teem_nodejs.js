// Copyright 2015 this2 LLC, MIT License (see LICENSE)
// teem class

define.class('$dreem/teem_base', function(require, exports, self, baseclass){

	var Node = require('$base/node')
	var RpcProxy = require('$rpc/rpcproxy')
	var RpcMulti = require('$rpc/rpcmulti')
	var RpcPromise = require('$rpc/rpcpromise')
	var renderer = require('$renderer/renderer')

	// ok now what. well we need to build our RPC interface
	self.postAPI = function(msg, response){
		if(msg.type == 'attribute'){
			var obj = RpcProxy.decodeRpcID(this, msg.rpcid)
			if(obj) obj[msg.attribute] = msg.value
			response.send({type:'return',value:'OK'})
		}
		else if(msg.type == 'method'){
			var obj = RpcProxy.decodeRpcID(this, msg.rpcid)
			if(obj) RpcProxy.handleCall(obj, msg, response)
		}
		else response.send({type:'error', value:'please set type to rpcAttribute or rpcCall'})
	}

	self.atConstructor = function(bus){

		this.bus = bus
		this.session = '' + Math.random() * 10000000
		this.connected_screens = {}

		define.$rendermode = 'headless'

		bus.broadcast({type:'sessionCheck', session:this.session})

		bus.atConnect = function(socket){
			socket.send({type:'sessionCheck', session:this.session})
		}.bind(this)

		bus.atMessage = function(msg, socket){
			// we will get messages from the clients
			if(msg.type == 'connectScreen'){
				// lets add ourselves
				var arr = this.connected_screens[msg.name] || (this.connected_screens[msg.name] = [])
				var index = arr.push(socket) - 1
				
				// now lets send all the connected screens to the new one			
				for(var scr in this.connected_screens){
					var arr = this.connected_screens[scr]
					for(var i = 0; i < arr.length; i++){
						socket.send({type:'connectScreen', name:scr, index:i})
					}
				}
				// lets let everyone know a new screen joined
				this.bus.broadcast({type:'connectScreen', name:msg.name, index:index}, socket)

				// and send the OK back to the screen
				socket.send({type:'connectScreenOK', index:index})
			}
			else if(msg.type == 'attribute'){
				// ok so if we get a setattribute, what we need is to forward it to all clients, not us
				bus.broadcast(msg, socket)
				var obj = RpcProxy.decodeRpcID(this, msg.rpcid)
				if(obj) obj[msg.attribute] = msg.value
			}
			else if(msg.type == 'method'){
				var obj = RpcProxy.decodeRpcID(this, msg.rpcid)
				if(obj) RpcProxy.handleCall(obj, msg, socket)
			}
			else if(msg.type == 'return'){
				// we got an rpc return
				socket.rpcpromise.resolveResult(msg)
			}
			else if(msg.type == 'webrtcOffer'){ bus.broadcast(msg) }
			else if(msg.type == 'webrtcAnswer'){ bus.broadcast(msg) }
			else if(msg.type == 'webrtcOfferCandidate'){ bus.broadcast(msg) }
			else if(msg.type == 'webrtcAnswerCandidate'){ bus.broadcast(msg) }
			else if(msg.type == 'log'){
				console.log.apply(console, msg.args)
			}
		}.bind(this)

		// we have to render the RPC bus
		var composition = this.render()
		
		// lets see which objects need to be RPC-proxified
		for(var i = 0; i < composition.length; i++){
			// ok so as soon as we are stubbed, we need to proxify the object
			var obj = composition[i]
			if(obj.constructor.stubbed){ // we are a stubbed out class
				var rpcid = obj.name || obj.constructor.name
				//composition[i] = RpcProxy.createFromStub(obj, Node.prototype, rpcid, this.rpcpromise)
			}
			else{
				renderer.defineGlobals(obj, {teem:this})
			}
		}

		// splat our children into the teem object
		renderer.mergeChildren(this, composition)

		// lets call init
		var wireinits = []
		renderer.connectWires(this, wireinits)

		renderer.fireInit(this)

	}
})