// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(view, text){
	// A fullscreen semitransparent overlay, for use under modal dialogs
	
	var screenoverlay = this.constructor;
	
	// Basic usage. Please note that this control should be used at a level high enough to actually cover the whole screen.
	define.example(this, function Usage(){
		return [screenoverlay()];
	});
	
	this.x = 0
	this.y = 0
	this.init = function(){
		this.size = this.screen.size;
	}
	this.position = "absolute";
	this.bg = {
		color:function(){return vec4(0,0,0,0.3);}
	}
})