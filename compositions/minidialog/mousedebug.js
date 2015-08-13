// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// mouse debug class

define.class(function(sprite, text, view){
	
	this.attribute("buttoncolor1", {type: vec4, value: vec4("#9090b0")});
	this.attribute("buttoncolor2", {type: vec4, value: vec4("#8080c0")});
	this.bg.mousepos = vec2(0);
	this.bg.bgcolorfn = function(a,b){
		var dx = abs(a.x  * width - mousepos.x)/10.0;
		var dy = abs(a.y  * height - mousepos.y)/10.0;
		var mindist = min(dx,  dy);
		mindist = pow(mindist,0.08);
		
		return vec4(0.7, 0.6,0.3,clamp(1.-mindist, 0.,1. ));
	}
	this.render = function(){
		return [text({bgcolor: "transparent", fgcolor: "darkgray", text:"t", position:"absolute" ,width: 10})]
	}
	this.mousemove = function(a){
		this.children[0].text = Math.round(a[0]) + ", " + Math.round(a[1]);
		this.children[0].x = a[0];
		this.children[0].y = a[1];
		this.children[0].setDirty(true);
		this.bg.mousepos = vec2(a[0],a[1]);		
		this.setDirty(true);
	}
});