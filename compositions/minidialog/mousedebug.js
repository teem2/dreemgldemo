// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// mouse debug class

define.class(function(sprite, text, view){
	
	this.attribute("buttoncolor1", {type: vec4, value: vec4("#9090b0")});
	this.attribute("buttoncolor2", {type: vec4, value: vec4("#8080c0")});
	this.bg.mousepos = vec2(0);
	this.bg.gridcolor = vec4("#909090");
	
	this.bg.grid = function(a,b){
		if (floor(mod(a.x * width,50. )) == 0. ||floor(mod(a.y * height,50. )) == 0.)	{
			return mix(gridcolor, vec4(1.0), 0.5);
		}
		if (floor(mod(a.x * width,10. )) == 0. ||floor(mod(a.y * height,10. )) == 0.)	{
			return mix(gridcolor, vec4(1.0), 0.2);
		}
		return gridcolor;
	}
	
	this.bg.bgcolorfn = function(a,b){
		var dx = abs(a.x  * width - mousepos.x)/10.0;
		var dy = abs(a.y  * height - mousepos.y)/10.0;
		var mindist = min(dx,  dy);
		mindist = pow(mindist,0.08);	
		return mix(grid(a,b),vec4(0.7, 0.6,0.3,1.0),clamp((1.-mindist)*4.0, 0.,1. ));
	}
	
	this.render = function(){
		return [text({bgcolor: "transparent", fgcolor: "darkgray", text:"this is a small text that will contain the cursor after move", position:"absolute" ,width: 10})]
	}
	
	this.mousemove = function(a){
		this.bg.mousepos = vec2(a[0],a[1]);		
		this.setDirty(true);
		
		
		if (this.children.length > 0)
		{
			this.children[0].text = Math.round(a[0]) + ", " + Math.round(a[1]);
			this.children[0].pos = vec2(a[0],a[1]);		
			
		}
		
	}
});