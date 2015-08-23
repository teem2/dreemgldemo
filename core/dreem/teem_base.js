// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// teem class

define.class('$base/node', function(require, exports, self, baseclass){

	var RpcProxy = require('$rpc/rpcproxy')

	self.atConstructor = function(){
		this._intervals = []
	}

	self.destroy = function(){
		for(var key in teem){
			prop = teem[key]
			if(typeof prop == 'object' && prop !== teem){
				if(prop.destroy && typeof prop.destroy == 'function'){
					prop.destroy()
				}
				renderer.destroy(prop)
			}
		}
		for(var i = 0; i < teem._intervals.length; i++){
			clearInterval(teem._intervals[i])
		}
	}

	self.toString = function(){
		// lets dump our RPC objects
		var out = 'Teem RPC object:\n'
		for(var key in this){
			if(key in Node.prototype) continue
			out += key +'\n'
		}
		return out
	}

	self.setInterval = function(cb, timeout){
		var id = setInterval(cb, timeout)
		this._intervals.push(id)
		return id
	}

	self.clearInterval = function(id){
		var i = teem._intervals.indexOf(id)
		if(i != -1) teem._intervals.splice(i, 1)
		clearInterval(id)
	}

	self.renderComposition = function(){
		// we have to render the RPC bus
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
				obj.teem = this
			}
		}

		this.children = composition

		// merge name
		for(var i = 0; i < this.children.length; i++){
			// create child name shortcut
			var child = this.children[i]
			var name = child.name || child.constructor.name
			if(name !== undefined && !(name in this)) this[name] = child
		}

		// lets call init on everything
		this.emitRecursive('init')		
	}
})