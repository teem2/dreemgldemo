// Copyright 2015 this2 LLC, MIT License (see LICENSE)
// teem class

define.class('$base/composition_base', function(require, exports, self, baseclass){

	var Node = require('$base/node')
	var RpcProxy = require('$rpc/rpcproxy')
	var RpcHub = require('$rpc/rpchub')

	var renderer = require('$renderer/renderer')

	// ok now what. well we need to build our RPC interface
	this.postAPI = function(msg, response){
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
	
	this.handleRpcMethod = function(msg){
		// lets make a promise
		return new Promise(function(resolve, reject){
			var parts = msg.rpcid.split('.')
			if(parts[0] === 'screens'){
				var scr = this.connected_screens[parts[1]]

				var res = []
				var uid = msg.uid
				if(scr) for(var i = 0; i < scr.length; i ++){
					var screensock = scr[i]
					// socket open
					if(screensock.readyState === 1){
						// lets send our message
						var prom = this.rpc.allocPromise()
						res.push(prom)
						prom.origuid = msg.uid
						msg.uid = prom.uid
						screensock.send(msg)
					}
				}
				// lets wait for all screens of this name
				Promise.all(res).then(function(results){
					// walk over promises and results
					var rmsg = {type:'return', uid:uid, value:results.length?results[0].value:null, other:[]}
					for(var i = 1; i < results.length; i++) rmsg.other.push(results[i].value)
					// lets return the result
					resolve(rmsg)
				})
			}
			else{ // its a local thing, call it directly on our composition
				var obj = this.names
				for(var i = 0; i < parts.length; i ++){
					obj = obj[parts[i]]
					if(!obj) return console.log("Error parsing rpc name "+msg.rpcid)
				}
				var ret = obj[msg.method].apply(obj, msg.args)
				var rmsg = {type:'return', uid:msg.uid, value:ret}

				if(ret && typeof ret === 'object' && ret.then){ // its a promise.
					ret.then(function(result){
						rmsg.value = result.value
						resolve(rmsg)
					})
				}
				else{
					if(!define.isSafeJSON(ret)){
						rmsg.error = 'Result not json safe'
						rmsg.ret = undefined
						console.log("Rpc result is not json safe "+msg.rpcid+"."+msg.method)
					}
					resolve(rmsg)
					socket.send(rmsg)
				}
			}
		}.bind(this))
	}

	this.callRpcMethod = function(msg){
		return new Promise(function(resolve, reject){
			this.handleRpcMethod(msg).then(function(result){
				resolve(result)
			}).catch(reject)
		}.bind(this))
	}

	this.setRpcAttribute = function(msg, socket){
		var parts = msg.rpcid.split('.')

		if(parts[0] !== 'screens'){ // set an attribute on a server local thing
			var obj = this.names[parts[0]]
			var value = RpcProxy.json
			obj[msg.attribute] = msg.value
		}
		// lets send this attribute to everyone except socket
		for(var scrkey in this.connected_screens){
			var array = this.connected_screens[scrkey]
			for(var i = 0; i < array.length; i++){
				var sock = array[i]
				if(sock === socket) continue
				if(sock.readyState === 1){
					sock.send(msg)
				}
			}
		}
	}

	this.atConstructor = function(bus){
		
		baseclass.prototype.atConstructor.call(this)

		this.bus = bus
		this.session = Math.random() * 100000
		this.rpc = new RpcHub(this)
		this.connected_screens = {}

		bus.broadcast({type:'sessionCheck', session:this.session})

		bus.atConnect = function(socket){
			socket.send({type:'sessionCheck', session:this.session})
		}.bind(this)

		bus.atMessage = function(msg, socket){
			// we will get messages from the clients
			if(msg.type == 'connectScreen'){
				// lets add a screen connection
				var arr = this.connected_screens[msg.name] || (this.connected_screens[msg.name] = [])
				var index = arr.push(socket) - 1

				// lets let everyone know a new screen joined, for what its worth
				this.bus.broadcast({type:'connectScreen', name:msg.name, index:index}, socket)

				// and send the OK back to the screen
				socket.send({type:'connectScreenOK', index:index})
			}
			else if(msg.type == 'attribute'){
				this.setRpcAttribute(msg, socket)
			}
			else if(msg.type == 'method'){
				this.handleRpcMethod(msg).then(function(result){
					socket.send(result)
				})
			}
			else if(msg.type == 'return'){
				// lets resolve this return 
				this.rpc.resolveReturn(msg)
			}
			else if(msg.type == 'webrtcOffer'){ bus.broadcast(msg) }
			else if(msg.type == 'webrtcAnswer'){ bus.broadcast(msg) }
			else if(msg.type == 'webrtcOfferCandidate'){ bus.broadcast(msg) }
			else if(msg.type == 'webrtcAnswerCandidate'){ bus.broadcast(msg) }
			else if(msg.type == 'log'){
				console.log.apply(console, msg.args)
			}
		}.bind(this)

		this.renderComposition()

		// call init on the classes which are in our environment
		for(var i = 0; i < this.children.length; i++){
			// create child name shortcut
			var child = this.children[i]
			child.rpc = this.rpc
			if(!child.environment || child.environment === define.$environment){
				child.emitRecursive('init')
			}
		}		
	}
})