// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Rpc single proxy

define.class('$base/node', function(require, exports, self){
	var Node = require('$base/node')
	var RpcMulti = require('$rpc/rpcmulti')
	var RpcProxy = exports
	
	// json safety check
	Object.defineProperty(self, 'subRpcDef', {
		value:function(){
			return {kind:'single',self:RpcProxy.createRpcDef(this, Node)}
		}
	})

	RpcProxy.defineProp = function(obj, key, value){
		var store = '__' + key
		Object.defineProperty(obj, key, {
			get:function(){
				return this[store]
			},
			set:function(v){
				// maybe error here?
				throw new Error('Please dont set key ' + key + ' on an rpc object, its readonly')
			}
		})
	}

	RpcProxy.defineMethod = function(obj, key){
		obj[key] = function(){
			var args = []
			var msg = {type:'method', rpcid:this._rpcid, method:key, args:args }

			for(var i = 0; i < arguments.length; i++){
				var arg = arguments[i]
				
				if(typeof arg == 'function' || typeof arg == 'object' && !RpcProxy.isJsonSafe(arg)){
					throw new Error('RPC call ' + key + ' can only support JSON safe objects')
				}

				args.push(arg)
			}
			if(!this._rpcpromise) return new Promise(function(resolve, reject){resolve(null)})
			return this._rpcpromise.sendAndCreatePromise(msg)
		}
	}

	RpcProxy.handleCall = function(object, msg, socket){
		var ret = object[msg.method].apply(object, msg.args)
		if(ret && ret.then){ // make the promise resolve to a socket send
			ret.then(function(result){
				socket.send({type:'return', uid:msg.uid, value:result})
			}).catch(function(error){
				socket.send({type:'return', uid:msg.uid, value:error, error:1})
			})
		}
		else{
			if(!RpcProxy.isJsonSafe(ret)){
				console.log('RPC Return value of ' + msg.rpcid + ' ' + msg.method + ' is not json safe')		
				ret = null
			}
			socket.send({type:'return', uid:msg.uid, value:ret})
		}		
	}

	RpcProxy.verifyRpc = function(rpcdef, component, prop, kind){
		// lets rip off the array index
		var def = rpcdef[component]
		if(!def){
			console.log('Illegal RPC ' + kind + ' on ' + component)
			return false
		}
		var prop = def[prop]
		if(!prop || prop.kind !== kind){
			console.log('Illegal RPC ' + kind + ' on '+component+'.'+prop)
			return false
		}
		return true
	}

	RpcProxy.bindSetAttribute = function(object, rpcid, bus){
		// ok lets now wire our mod.vdom.onSetAttribute
		Object.defineProperty(object, 'atAttributeSet', {
			value: function(key, value){
			if(!RpcProxy.isJsonSafe(value)){
				console.log('setAttribute not JSON safe ' + name + '.' + key)
				return
			}
			var msg = {
				type:'attribute',
				rpcid:rpcid,
				attribute:key,
				value: value
			}
			if(bus.broadcast){
				bus.broadcast(msg)
			}
			else{
				bus.send(msg)
			}
		}})
	}

	RpcProxy.decodeRpcID = function(onobj, rpcid){
		if(!rpcid) throw new Error('no RPC ID')

		var idx = rpcid.split('[')
		var name = idx[0]

		// its a object.sub[0] call
		if(name.indexOf('.') != -1){
			var part = name.split('.')
			var obj = onobj[part[0]]
			if(!obj) return 
			obj = obj[part[1]]
			if(!obj) return
			if(idx[1]) return obj[idx[1].slice(0,-1)]
			return obj
		}
		return onobj[name]
	}

	RpcProxy.isJsonSafe = function(obj, stack){
		if(obj === undefined || obj === null) return true
		if(typeof obj === 'function') return false
		if(typeof obj !== 'object') return true
		if(!stack) stack = []
		stack.push(obj)

		if(Array.isArray(obj)){
			for(var i = 0; i < obj.length; i++){
				if(!RpcProxy.isJsonSafe(obj[i])) return false
			}
			stack.pop()
			return true
		}

		if(Object.getPrototypeOf(obj) !== Object.prototype) return false

		for(var key in obj){
			var prop = obj[key]
			if(typeof prop == 'object'){
				if(stack.indexOf(prop)!= -1) return false // circular
				if(!RpcProxy.isJsonSafe(prop, stack)) return false
			}
			else if(typeof prop == 'function') return false
			// probably json safe then
		}
		stack.pop()
		return true
	}

	RpcProxy.createFromStub = function(stub, baseproto, rpcid, rpcpromise){
		var proxy = new RpcProxy()
		proxy.name = stub.name || stub.constructor.name
		Object.defineProperty(proxy, '_rpcid', {value: rpcid})
		Object.defineProperty(proxy, '_rpcpromise', {value: rpcpromise})

		for(var key in stub){
			if(key.charAt(0) === '_' || baseproto && key in baseproto) continue
			if(stub.isAttribute(key)){ // we iz attribute
				proxy.attribute(key, stub.getAttributeConfig(key))
			}
			else{
				var prop = stub[key]

				if(typeof prop == 'function'){
					RpcProxy.defineMethod(proxy, key)
				}
				else if(Array.isArray(prop)){
					// its an array!
				}
			}
		}
		return proxy
	}
})