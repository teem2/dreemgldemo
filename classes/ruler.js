// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, view){
	
	
	this.ruler = function(){
		
		var dist =mesh.x *	width;
	
		if (floor(mod(dist ,100.) ) < 1.) 
		{
			return vec4(0.8,0.8,0.8,1);
		}
		else
		{
			if (mesh.y >0.5 && floor(mod(dist ,10.) ) < 1.) 
			{
				return vec4(0.9,0.9,0.9,1.0);
			}
			return bgcolor;
		}
	}
	this.render = function(){
		
		var rulerres = view({bgcolor: "#b0b0b0", "bg.color": this.ruler, flexdirection:"column", flex: 1, alignself:"stretch" });;		
		return rulerres;
	}
})