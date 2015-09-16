// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(node, require, self){
	
	// Empty class used as a stub in the composition to contain all the screens. 
	
	var RpcProxy = require('$rpc/rpcproxy')
	var RpcMulti = require('$rpc/rpcmulti')

	self.init = function(){
		// lets put our multi children on ourselves
/*		for(var i = 0; i < this.children.length; i++){
			var child = this.children[i]
			var rpcdef = RpcProxy.createRpcDef(child, node)
			this[child.name] = RpcMulti.createFromDef(rpcdef)
		}*/
	}
})