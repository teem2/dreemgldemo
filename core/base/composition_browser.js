// Copyright 2015 this2 LLC, MIT License (see LICENSE)
// this class

define.class('$base/composition_client', function(require, baseclass){

	var Device = require('$draw/$drawdevice/device$drawdevice')

	this.atConstructor = function(previous, parent){

		if(previous){
			this.reload = (previous.reload || 0) + 1
			console.log("Reload " + this.reload)
		}
		else{
			// lets spawn up a webGL device
			this.device = new Device()

		}

		baseclass.prototype.atConstructor.call(this)

		// we haz device.. 
		//this.device.process(this.screen)

		//this.screen.process(this.device)


	}
})