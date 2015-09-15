// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite,view){
	// container class for menuitem instances
	this.bgcolor = vec4("lightgray" );	

	// render function passthrough
	this.render = function(){return this.instance_children;}
})