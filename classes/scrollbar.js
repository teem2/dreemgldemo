// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, view){
	
	this.attribute("buttoncolor1", {type: vec4, value: vec4("#9090b0")});
	this.attribute("buttoncolor2", {type: vec4, value: vec4("#8080c0")});

	this.bg.offset = 0.5
	this.bg.total = 0.3

	this.bg.color = function(){
		// we have a rectangle
		var rel = vec2(mesh.x*width, mesh.y*height)
		var edge = min(length(vec2(length(dFdx(rel)), length(dFdy(rel)))) * SQRT_1_2, 0.001)
		var field = shape.roundbox(rel, 0.05 * width,offset*height,.9*width,total*height,4)
		var fg = vec4(1.,1.,1., smoothstep(edge, -edge, field))
		var bg = vec4(0.,0.,0.,0.05)
		return mix(bg.rgba, fg.rgba, fg.a)
	}	

	this.bg.col1 = vec4("yellow");
	this.bg.col2 = vec4("yellow");
	this.borderwidth  = 2;
	this.margin = 4;
	this.bordercolor = vec4("#303060");
	
	this.pressed = 0;
	this.hovered = 0;
		
	this.mouseover  = function(){
		this.hovered++;
		this.setDirty(true)
	}
	
	this.attribute("bgcolor", {type:vec4, duration: 1.0});
	
	this.mouseout = function(){
		this.hovered--;
		this.setDirty(true)
	}
	
	this.mouseleftdown = function(){
		this.pressed++
		this.setDirty(true)
	}
	
	this.mouseleftup = function(){
		this.pressed--;
		this.setDirty(true)
	}

	this.drawcount = 0;
	this.atDraw = function(){
		this.drawcount ++;
	//	console.log("atdraw button", this.drawcount);
		if (this.pressed > 0){
		}
		else{
			if (this.hovered > 0){
			}
			else{
			}
		}
	}
})