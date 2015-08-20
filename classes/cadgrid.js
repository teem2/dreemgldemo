// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite,view){
	this.flex = 1;
	this.flexdirection = "column" ;
	this.alignitem = "stretch";
	this.alignself = "stretch"; 
	this.bgcolor = vec4("#d0d0d0");

	this.bg.gridcolor = vec4("#ffffff");
	
	this.bg.grid = function(a,b){
		if (floor(mod(a.x * width,50. )) == 0. ||floor(mod(a.y * height,50. )) == 0.)	{
			return mix(gridcolor, vec4(0.9,0.9,1.0,1.0), 0.5);
		}
		if (floor(mod(a.x * width,10. )) == 0. ||floor(mod(a.y * height,10. )) == 0.)	{
			return mix(gridcolor, vec4(0.9,0.9,1.0,1.0), 0.2);
		}
		return gridcolor;
	}
	
	this.bg.bgcolorfn = function(a,b){
		
		return grid(a,b);
	}
	
	this.render = function(){return this.instance_children;}
})