// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// teem class

define.class(function(require, node){

	var RpcHub = require('$rpc/rpchub')

	this.atConstructor = function(){
		this._intervals = []
	}

	this.destroy = function(){
		for(var key in this.hub){
			prop = this.hub[key]
			if(typeof prop == 'object'){
				if(prop.destroy && typeof prop.destroy == 'function'){
					prop.destroy()
				}
				renderer.destroy(prop)
			}
		}
		for(var i = 0; i < this._intervals.length; i++){
			clearInterval(this._intervals[i])
		}
	}

	this.toString = function(){
		// lets dump our RPC objects
		var out = 'Teem RPC object:\n'
		for(var key in this){
			if(key in Node.prototype) continue
			out += key +'\n'
		}
		return out
	}

	this.setInterval = function(cb, timeout){
		var id = setInterval(cb, timeout)
		this._intervals.push(id)
		return id
	}
 
	this.clearInterval = function(id){
		var i = teem._intervals.indexOf(id)
		if(i != -1) teem._intervals.splice(i, 1)
		clearInterval(id)
	}

	this.renderComposition = function(){
		// we have to render the RPC bus
		this.children = this.render()
		this.names = {}
		// now lets rpc proxify them
		for(var i = 0; i < this.children.length; i++){
			// ok so as soon as we are stubbed, we need to proxify the object
			var child = this.children[i]

			if(!child.createRpcProxy) continue
			// add the proxy to the rpc object
			var name = child.name || child.constructor.name
			this.rpc[name] = child.createRpcProxy(this.rpc)
			this.names[name] = child
		}
	}
})