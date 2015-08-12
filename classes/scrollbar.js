// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, view){
	
	this.attribute("draggercolor", {type: vec4, value: vec4("#9090b0")});
	this.attribute("hovercolor", {type: vec4, value: vec4("#8080c0")});
	this.attribute("activecolor", {type: vec4, value: vec4("#8080c0")});
	this.attribute("vertical", {type: Boolean, value: true});
	this.attribute("offset", {type:float, value:0})
	this.attribute("page", {type:float, value:0.3})

	this.bg.draggercolor = vec4();
	this.bg.offset = 0
	this.bg.page = 0.3

	this.hslider = function(){
		// we have a rectangle
		var rel = vec2(mesh.x*width, mesh.y*height)
		var edge = min(length(vec2(length(dFdx(rel)), length(dFdy(rel)))) * SQRT_1_2, 0.001)		
		var field = shape.roundbox(rel, offset * width, 0.05*height,page*width, .9*height,4)
		var fg = vec4(draggercolor.rgb, smoothstep(edge, -edge, field)*draggercolor.a)
		var bg = vec4(0.,0.,0.,0.05)
		return mix(bg.rgba, fg.rgba, fg.a)
	}	
	
	this.vslider = function(){
		// we have a rectangle
		var rel = vec2(mesh.x*width, mesh.y*height)
		var edge = min(length(vec2(length(dFdx(rel)), length(dFdy(rel)))) * SQRT_1_2, 0.001)
		var field = shape.roundbox(rel, 0.05 * width, offset*height,.9*width, page*height,4)
		var fg = vec4(draggercolor.rgb, smoothstep(edge, -edge, field)*draggercolor.a)
		var bg = vec4(0.,0.,0.,0.05)
		return mix(bg.rgba, fg.rgba, fg.a)
	}	
	this.bg.color = this.vslider;
	
	this.render = function()
	{
		if (this.vertical){
			this.bg.color = this.vslider;
		}else{
			this.bg.color = this.hslider;	
		}
		
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
	
	this.mouseleftdown = function(start){
		this.pressed++
		this.setDirty(true)
		// detect if we clicked not on the button
		if(this.vertical){
			var p = start[1] / this.layout.height
		}
		else{
			var p = start[0] / this.layout.width
		}
		if(p < this.offset){
			this.offset = clamp(p - 0.5 * this.page, 0, 1.-this.page)
			this.setDirty(true)
		}
		else if (p > this.offset + this.page){
			this.offset = clamp(p - 0.5*this.page, 0, 1.-this.page)
			this.setDirty(true)
		}
		var start_offset = this.offset
		this.onmousemove = function(pos){
			if(this.vertical){
				var p = start_offset + (pos[1] - start[1]) / this.layout.height
			}
			else{
				var p = start_offset + (pos[0] - start[0]) / this.layout.width
			}
			this.offset = clamp(p, 0, 1.-this.page)
			this.setDirty(true)
		}
	}
	
	this.mouseleftup = function(){
		this.pressed--;
		this.onmousemove = function(){}
		this.setDirty(true)
	}

	this.drawcount = 0;
	this.atDraw = function(){
		this.drawcount ++;
		this.bg._offset = this._offset
		this.bg._page = this._page

	//	console.log("atdraw button", this.drawcount);
		if (this.pressed > 0){
				this.bg._draggercolor = this.activecolor;
		}
		else{
			if (this.hovered > 0){
				this.bg._draggercolor = this.hovercolor;
			}
			else{
				this.bg._draggercolor = this.draggercolor;
			}
		}
	}
})