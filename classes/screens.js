// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// screens class

define.class(function(node, require, self){
	var RpcProxy = require('$rpc/rpcproxy')
	var RpcMulti = require('$rpc/rpcmulti')

	self.init = function(){
		// lets put our multi children on ourselves
		for(var i = 0; i < this.children.length; i++){
			var child = this.children[i]
			var rpcdef = RpcProxy.createRpcDef(child, node)
			this[child.name] = RpcMulti.createFromDef(rpcdef)
		}
	}
})