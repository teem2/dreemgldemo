// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// teem class

define.class('$base/node', function(require, exports, self, baseclass){

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
})