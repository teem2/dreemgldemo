// Copyright 2015 this2 LLC, MIT License (see LICENSE)
// this class

define.class('$base/composition_base', function(require, baseclass){

	var Node = require('$base/node')
	var RpcProxy = require('$rpc/rpcproxy')
	var RpcHub = require('$rpc/rpchub')

	var WebRTC = require('$rpc/webrtc')
	var BusClient = require('$rpc/busclient')
	var Render = require('$base/render')

	var Device = require('$draw/$drawdevice/device$drawdevice')
	var Shader = require('$draw/$drawdevice/shader$drawdevice')
	var View = require('$classes/view')

	this.atConstructor = function(previous, parent){

		if(previous){
			this.reload = (previous.reload || 0) + 1
			console.log("Reload " + this.reload)
		}
		else{
			// lets spawn up a webGL device
			this.device = new Device()
			// add a bg class on the view prototype
			define.class(View.prototype, 'bg', this.device.shader, function(){

			})
		}

		baseclass.prototype.atConstructor.call(this)


	}
})