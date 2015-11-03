// Copyright 2015 this2 LLC, MIT License (see LICENSE)
// this class

define.class('$base/composition_base', function(require, baseclass){

	var Node = require('$base/node')
	var RpcProxy = require('$rpc/rpcproxy')
	var RpcHub = require('$rpc/rpchub')

	var WebRTC = require('$rpc/webrtc')
	var BusClient = require('$rpc/busclient')
	var Render = require('$base/render')

	var Device = require('$draw/webgl/devicewebgl')

	this.atConstructor = function(previous, parent){

		if(previous){
			this.reload = (previous.reload || 0) + 1
			console.log("Reload " + this.reload)
		}
		else{
			// lets spawn up a webGL device
			this.device = new Device()
		}

		// how come this one doesnt get patched up?
		baseclass.prototype.atConstructor.call(this)

	}
})