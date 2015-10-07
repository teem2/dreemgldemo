// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite, text, view, icon, button){
	
	// the label for the button
	this.attribute("text", {type: String, value: ""});
	// the icon for the button, see FontAwesome for the available icon-names.
	this.attribute("icon", {type: String, value: ""});

	// font size in device-pixels.
	// example: example1
	this.attribute("fontsize", {type: float, value: 14});
	
	// A simple button
	define.example(this, function example1(){ return [button({text:"Press me!"})] });
	

	// color of the labeltext in neutral state
	this.attribute("labelcolor", {type: vec4, value: vec4("#404040")});
	this.attribute("labelactivecolor", {type: vec4, value: vec4("black")});
	this.attribute("buttoncolor1", {type: vec4, value: vec4("#fffff0")});
	this.attribute("buttoncolor2", {type: vec4, value: vec4("#ffffff")});
	this.attribute("hovercolor1", {type: vec4, value: vec4("#f0f0f0")});
	this.attribute("hovercolor2", {type: vec4, value: vec4("#f8f8f8")});
	this.attribute("pressedcolor1", {type: vec4, value: vec4("#d0d0f0")});
	this.attribute("pressedcolor2", {type: vec4, value: vec4("#d0d0f0")});
	this.buttonres = {};
		
	// the shader for the inside fill
	// <mesh> Texture coordinate from vertex (in 0,0 -> 1,1 space) 
	// <distance> Distance to outside border (in pixels) 
	this.buttonfill = function(mesh,distance){
		var fill = mix(col1, col2, (mesh.y)/0.8);
		return fill;
	}

	this.bg = {
		wobbleamount: 0.0,
		bgcolorfn: this.buttonfill,
		col1: vec4("yellow"),
		col2: vec4("yellow")
	}

	this.padding = 8;
	this.cornerradius = 3;
	this.borderwidth  = 2;
	this.margin = 4;
	this.bordercolor = vec4("lightgray");
	this.alignItems = "center";
	
	this.pressed = 0;
	this.hovered = 0;
		
	// The icon class used for the icon display. Exposed to allow overloading/replacing from the outside.
	define.class(this, 'icon_class', function(icon){

	})

	this.mouseover  = function(){
		this.hovered++;
		this.setDirty(true)
	}
	
	this.attribute("bgcolor", {duration: 1.0});
	
	this.mouseout = function(){
		if(this.hovered>0)this.hovered--;
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
			this.bg_shader.col2 = this._pressedcolor2;
			this.bg_shader.col1 = this._pressedcolor1;
			this.buttonres.fgcolor = this._labelactivecolor;		
			
				if (this.iconres) this.iconres.fgcolor = this._labelactivecolor;
		}
		else{
			if (this.hovered > 0){
				this.bg_shader.col2 = this._hovercolor2;
				this.bg_shader.col1 = this._hovercolor1;
				this.buttonres.fgcolor = this._labelactivecolor;
				if (this.iconres) this.iconres.fgcolor = this._labelactivecolor;
			}
			else{
				this.buttonres.fgcolor = this._labelcolor;
				if (this.iconres) this.iconres.fgcolor = this._labelcolor;
				this.bg_shader.col2 = this._buttoncolor2;
				this.bg_shader.col1 = this._buttoncolor1;
			}
		}
	}

	this.render = function(){
		this.buttonres =  text({rotation: 0, bgcolor:"transparent",fgcolor:"white", marginleft: 4,fontsize: this.fontsize, position: "relative", text: this.text})
		if (!this.icon || this.icon.length == 0){
			this.iconres = undefined;
			return [this.buttonres];
		}
		else{
			this.iconres = this.icon_class({fontsize: this.fontsize,color:vec4('red'), icon: this.icon}); 
			return [this.iconres,this.buttonres];
		}
	}
	
})