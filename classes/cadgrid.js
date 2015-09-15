// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)



define.class(function(sprite,view){

// The CADGrid class provides a simple way to fill a frame with a classic engineering grid. 
// todo:
// - support zooming with incremental subdivision lines
// - link up to 

	this.flex = 1;
	this.flexdirection = "column"
	this.alignitem = "stretch"
	this.alignself = "stretch"

	this.bgcolor = vec4("#d0d0d0")

	// CADGrid shader - used various floored modulo functions to find out if either a major or minor gridline is being touched.
	this.bg = {
		gridcolor:vec4("#ffffff"),	
		grid: function(a,b){
			if (floor(mod(a.x * width,50. )) == 0. ||floor(mod(a.y * height,50. )) == 0.)	{
				return mix(gridcolor, vec4(0.9,0.9,1.0,1.0), 0.5);
			}
			if (floor(mod(a.x * width,10. )) == 0. ||floor(mod(a.y * height,10. )) == 0.)	{
				return mix(gridcolor, vec4(0.9,0.9,1.0,1.0), 0.2);
			}
			return gridcolor;
		},
		bgcolorfn:function(a,b){
			return grid(a,b);
		}
	}

	// The CADGrid does not do anything to its children - plain passthrough
	this.render = function(){return this.instance_children;}
	
	// Minimal usage example:
	this.example = function(){return cadgrid({width:100,height:100});};
})