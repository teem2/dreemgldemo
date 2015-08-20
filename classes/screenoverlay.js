// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite, text, view){
	this.x = 0;
	this.y  = 0;
	this.init = function(){
		this.size = this.screen.size;
	}
	this.position = "absolute";
	this.bg.color = function(){return vec4(0,0,0,0.3);}
})