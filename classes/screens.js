// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(node, require){
	var RpcProxy = require('$rpc/rpcproxy')

	this.createRpcProxy = function(parent){
		return RpcProxy.createChildSet(this, parent)
	}
})