// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(view, label, icon){
	// Simple button: a rectangle with a textlabel and an icon
	
	// The label for the button
	this.attribute("text", {type: String, value: ""})
	// The icon for the button, see FontAwesome for the available icon-names.
	this.attribute("icon", {type: String, value: ""})

	// Font size in device-pixels.
	// Example: example1
	this.attribute("fontsize", {type: float, value: 14})
	
	var button = this.constructor
	
	// Basic usage of the button.	
	define.example(this, function Usage(){
		return [
			button({text:"Press me!"})
			,button({text:"Colored!", buttoncolor1: "red", buttoncolor2: "blue", labelcolor: "white"  })
			,button({text:"With an icon!", icon:"flask" })
		] 
	});
	
	// Gradient color 1	
	this.attribute("col1", {type: vec4, value: vec4("#404040")})
	// Gradient color 2
	this.attribute("col2", {type: vec4, value: vec4("#404040")})

	// Color of the label text in neutral state	
	this.attribute("labelcolor", {type: vec4, value: vec4("#404040")})

	// Color of the label text in pressed-down state	
	this.attribute("labelactivecolor", {type: vec4, value: vec4("black")})
	
	// First gradient color for the button background in neutral state
	this.attribute("buttoncolor1", {type: vec4, value: vec4("#fffff0")})
	// Second gradient color for the button background in neutral state	
	this.attribute("buttoncolor2", {type: vec4, value: vec4("#ffffff")})
	
	// First gradient color for the button background in hovered state
	this.attribute("hovercolor1", {type: vec4, value: vec4("#f0f0f0")})
	// Second gradient color for the button background in hovered state
	this.attribute("hovercolor2", {type: vec4, value: vec4("#f8f8f8")})
	
	// First gradient color for the button background in pressed state
	this.attribute("pressedcolor1", {type: vec4, value: vec4("#d0d0f0")})
	// Second gradient color for the button background in pressed state
	this.attribute("pressedcolor2", {type: vec4, value: vec4("#d0d0f0")})
	
	this.buttonres = {};

	this.bg = {
		color: function(){
			return mix(view.col1, view.col2, (uv.y)/0.8)
		}
	}

	this.padding = 8
	this.borderradius = 3
	this.borderwidth  = 2
	this.margin = 4
	this.bordercolor = vec4("lightgray");
	this.alignItems = "center";

	// setting things as animatable
	this.attribute("col1", {duration: 1.0});
	this.attribute("col2", {duration: 1.0});
	
	// The icon class used for the icon display. Exposed to allow overloading/replacing from the outside.
	define.class(this, 'iconclass', function(icon){
	})

	this.statehover = function(){
		this.col1 = this.hovercolor1
		this.col2 = this.hovercolor2
		this.icol = this.labelactivecolor
	}

	this.statenormal = function(){
		this.col1 = this.buttoncolor1
		this.col2 = this.buttoncolor2
		this.icol = this.labelcolor
	}

	this.stateclick = function(){
		this.col1 = this.pressedcolor1
		this.col2 = this.pressedcolor2
		this.icol = this.labelactivecolor
	}

	this.init = this.statenormal
	this.mouseover  = this.statehover
	this.mouseout = this.statenormal
	this.mouseleftdown = this.stateclick
	this.mouseleftup = this.statenormal

	this.render = function(){
		this.buttonres =  label({rotation: 0, bgcolor:"transparent",fgcolor:"white", marginleft: 4,fontsize: this.fontsize, position: "relative", text: this.text})
		if (!this.icon || this.icon.length == 0){
			this.iconres = undefined;
			return [this.buttonres];
		} 
		else {
			this.iconres = this.iconclass({fontsize: this.fontsize,color:vec4('red'), icon: this.icon}); 
			return [this.iconres, this.buttonres];
		}
	}
	
})