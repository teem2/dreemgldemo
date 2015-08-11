// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, view){
	
	this.attribute("text", {type: String, value: "button"});
	this.buttonres = {};
	this.mouseover = function(){
		this.bg.wobbleamount = 1;
		this.bgcolor = vec4("#6060a0");
	}
	
	this.attribute("bgcolor", {type:vec4, duration: 1.0});
	
	this.mouseout = function(){
		this.bgcolor = vec4("#404080");		
		this.bg.wobbleamount = 0;
	}
	
	this.mouseleftdown = function(){
		this.bg.wobbleamount = -1;
	}
	
	this.buttonfill = function(a,b){
		return mix(bgcolor*0.05, bgcolor,  a.y*(1.0 - (0.5*wobbleamount) ) + wobbleamount * 0.5* sin(time * 24.3));
	}
	
	this.bg.wobbleamount = 0.0;
	this.padding = 8;
	this.cornerradius = 4;
	this.bg.bgcolorfn = this.buttonfill;
	this.bgcolor = vec4("#404080");
	this.borderwidth  = 2;
	this.margin = 4;
	this.bordercolor =vec4("#202020");
	this.alignItems = "center";
	
	this.render = function(){

			this.buttonres =  text({rotation: 0, bgcolor:"transparent",position: "relative", text: this.text.toUpperCase(), fontsize: 16})
			
			return this.buttonres;
		}
	
})