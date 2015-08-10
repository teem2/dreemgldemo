// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, view){
	
	this.vertical = false;
	
	this.offset = 20;
	
	this.ruler = function(){
		
		var dist =(mesh.x *	width) - offset;
	
		if (dist > 0.)
		{ 
			if(floor(mod(dist  ,100.) ) < 1.) 
		{
			return vec4(0.8,0.8,0.8,1);
		}
		else
		{
			if (mesh.y >0.5 && floor(mod(dist ,10.) ) < 1.) 
			{
				return vec4(0.75,0.75,0.75,1.0);
			}
		}
		}
			return bgcolor;

		}
	
	this.vruler = function(){
		
		
	var dist =(mesh.y *	height) - offset;
	
		if (dist > 0.)
		{ 
		
		if (floor(mod(dist ,100.) ) < 1.) 
		{
			return vec4(0.8,0.8,0.8,1);
		}
		else
		{
			if (mesh.x >0.5 && floor(mod(dist ,10.) ) < 1.) 
			{
				return vec4(0.75,0.75,0.75,1.0);
			}
		}
		}
					return bgcolor;

	}
	
	
	this.render = function(){
		if (this.vertical == false)
		{
			var rulerres = view({bgcolor: "#8080b0", "bg.color": this.ruler, flexdirection:"column","bg.offset": this.offset, flex: 1, alignself:"stretch" });;		
		return rulerres;
		}
		else{
			var rulerres = view({bgcolor: "#8080b0", "bg.color": this.vruler, flexdirection:"column", "bg.offset": this.offset,flex: 1, alignself:"stretch" });;		
		return rulerres;
		}
	}
})