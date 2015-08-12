// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// mouse debug class

define.class(function(sprite, text, view){
	
	this.attribute("buttoncolor1", {type: vec4, value: vec4("#9090b0")});
	this.attribute("buttoncolor2", {type: vec4, value: vec4("#8080c0")});
	this.bg.mousepos = vec2(0);
	this.bg.bgcolorfn = function(a,b)
	{
		var dx = abs(a.x  * width - mousepos.x);
		var dy = abs(a.y  * height - mousepos.y);
		return vec4(min(dx,  dy));
	}
	this.mousemove = function(a){
		console.log(a)
		this.bg.mousepos = vec2(a[0],a[1]);		
		this.setDirty(true);
	}
});