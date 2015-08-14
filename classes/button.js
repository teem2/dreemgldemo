// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, view, icon){
	
	this.attribute("text", {type: String, value: "button"});
	this.attribute("icon", {type: String, value: ""});
	this.attribute("fontsize", {type: float, value: 20});
	this.attribute("labelcolor", {type: vec4, value: vec4("black")});
	this.attribute("labelactivecolor", {type: vec4, value: vec4("white")});
	this.attribute("buttoncolor1", {type: vec4, value: vec4("#9090b0")});
	this.attribute("buttoncolor2", {type: vec4, value: vec4("#8080c0")});
	this.attribute("hovercolor1", {type: vec4, value: vec4("#8080c0")});
	this.attribute("hovercolor2", {type: vec4, value: vec4("#3b5898")});
	this.attribute("pressedcolor1", {type: vec4, value: vec4("#3b5898")});
	this.attribute("pressedcolor2", {type: vec4, value: vec4("#637aad")});
	this.buttonres = {};
		
	this.buttonfill = function(a,b){
		
		var fill = mix(col1, col2,  (a.y)/0.8);
		return fill;
	}
	
	this.bg.wobbleamount = 0.0;
	this.padding = 8;
	this.cornerradius = 3;
	this.bg.bgcolorfn = this.buttonfill;
	
	this.bg.col1 = vec4("yellow");
	this.bg.col2 = vec4("yellow");
	this.borderwidth  = 2;
	this.margin = 4;
	this.bordercolor = vec4("#303060");
	this.alignItems = "center";
	
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
			this.bg.col2 = this.pressedcolor2;
			this.bg.col1 = this.pressedcolor1;
			this.buttonres.fgcolor = this.labelactivecolor;		
			
				if (this.iconres) this.iconres.fgcolor = this.labelactivecolor;
		}
		else{
			if (this.hovered > 0){
				this.bg.col2 = this.hovercolor2;
				this.bg.col1 = this.hovercolor1;
				this.buttonres.fgcolor = this.labelactivecolor;
				if (this.iconres) this.iconres.fgcolor = this.labelactivecolor;
			}
			else{
				this.buttonres.fgcolor = this.labelcolor;
				if (this.iconres) this.iconres.fgcolor = this.labelcolor;
				this.bg.col2 = this.buttoncolor2;
				this.bg.col1 = this.buttoncolor1;
			}
		}
	}

	this.render = function(){
		this.buttonres =  text({rotation: 0, bgcolor:"transparent",fgcolor:"white", marginleft: 4,fontsize: this.fontsize, position: "relative", text: this.text.toUpperCase()})
		if (!this.icon || this.icon.length == 0)
		{
			this.iconres = undefined;
		return [this.buttonres];
		}
		else{
				this.iconres =icon({fontsize: this.fontsize, icon: this.icon}); 
		return [this.iconres,this.buttonres];
		}
	}
	
})