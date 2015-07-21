// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Rpc multicall object

define.class('$base/node', function(require, exports, self){
	var Node = require('$base/node')
	var RpcProxy = require('$rpc/rpcproxy')
	var RpcMulti = exports
	
	function defineIndex(obj, i){
		Object.defineProperty(obj, i, {
			get:function(){
				if(i >= this._array.length) return this._voidproxy
				return this._array[i]
			},
			set:function(){
				// set a multi rpc thing?
			}
		})
	}

	function defineSetFwd(obj, key){
		Object.defineProperty(obj, key, {
			get:function(){
				// lets just get the first value
				return this._array[0][key]
			},
			set:function(v){
				// set all
				for(var i = 0;i<this._array.length;i++){
					this._array[i][key] = v
				}
			}
		})
	}

	function defineMethodFwd(obj, method){
		obj[method] = function(){
			var out = []
			for(var i = 0;i<this._array.length;i++){
				var item = this._array[i]
				if(item) out.push(item[method].apply(item, arguments))
			}
			return Promise.all(out)
		}
	}

	self.length = 0//this.attribute('length', 'number', 0)
	// lets define array indices
	for(var i = 0; i < 256; i++){
		defineIndex(this, i)
	}

	Object.defineProperty(this, 'subRpcDef', {
		value:function(){
			// ok what do we do, we should return our entire substructure
			if(!this._def) console.log('WTF')
			var array = []
			var def = {
				kind: 'multi',
				self: this._def,
				array: array
			}
			//!TODO prune this array for null sockets
			for(var i = 0; i < this._array.length; i++){
				array.push(RpcProxy.createRpcDef(this._array[i], Node))
			}
			return def
		}
	})

	self.push = function(){
		this._array.push.apply(this._array, arguments)
	}

	self.createIndex = function(index, rpcid, rpcpromise, rpcbus){
		var proxy = RpcProxy.createFromDef(this._def, rpcid + '[' + index + ']', rpcpromise, rpcbus)
		this._array[index] = proxy
	}

	exports.createFromObject = function(object, baseclass){
		var def = RpcProxy.createRpcDef(object, baseclass)
		return RpcMulti.createFromDef(def)
	}

	exports.createFromDef = function(def, rpcid, rpcpromise){
		var obj = new RpcMulti()

		Object.defineProperty(obj, '_rpcid', {value: rpcid})
		Object.defineProperty(obj, '_array', {value: []})
		Object.defineProperty(obj, '_def', {value: def})
		Object.defineProperty(obj, '_voidproxy', {value: RpcProxy.createFromDef(def)})

		// lets interpret the def
		for(var key in def){
			var prop = def[key]
			if(typeof prop == 'object'){
				if(prop.kind == 'attribute'){
					defineSetFwd(obj, key)
				}
				else if(prop.kind == 'method'){
					defineMethodFwd(obj, key)
				}			
			}
			else{ // we are a plain value, dont do much
				if(key in obj) throw new Error('RpcMulti createFromDef collision on '+key)
				obj[key] = prop
			}
		}

		return obj
	}
})