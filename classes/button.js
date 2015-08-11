// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, view){
	
	this.attribute("text", {type: String, value: "button"});
	this.attribute("labelcolor", {type: vec4, value: vec4("black")});
	this.attribute("buttoncolor1", {type: vec4, value: vec4("#ffed64")});
	this.attribute("buttoncolor2", {type: vec4, value: vec4("#ffaa22")});
	this.attribute("hovercolor1", {type: vec4, value: vec4("white")});
	this.attribute("hovercolor2", {type: vec4, value: vec4("#ffaa22")});
	this.buttonres = {};
		
	this.buttonfill = function(a,b){
		
		var fill = mix(col1, col2,  (a.y-0.2)/0.8);
		
		var lvl = noise.noise2d(gl_FragCoord.xy  *0.02);
		var lvl2 = noise.noise2d(gl_FragCoord.xy  *0.0153);
		
		if (lvl< 0.5) lvl = 0.0;else lvl = 1.0;
		if (lvl2< 0.5) lvl2 = 0.0;else lvl = 1.0;
		if (a.y< 0.2) fill  = mix(col2, fill, a.y*5.)
		if (a.x < 0.1) fill =  mix(col2, fill, a.x*10.)
		if (a.x > 0.9) fill =  mix(col2, fill, 1.-(a.x-0.9)*10.)
		return mix(fill, mix(fill, vec4("black"), lvl2), lvl);
	}
	
	
	this.bg.wobbleamount = 0.0;
	this.padding = 8;
	this.cornerradius = 8;
	this.bg.bgcolorfn = this.buttonfill;
	
	this.bg.col1 = vec4("yellow");
	this.bg.col2 = vec4("yellow");
	this.borderwidth  = 2;
	this.margin = 4;
	this.bordercolor =vec4("#ffaa22");
	this.alignItems = "center";
	
	this.pressed = 0;
	this.hovered = 0;
	
	this.dodirty = function(){
			this.setDirty(true);	
	}
	
	this.mouseover  = function(){		
		this.hovered++;
		this.dodirty();
	}
	
	this.attribute("bgcolor", {type:vec4, duration: 1.0});
	
	this.mouseout = function(){
		this.hovered--;
		this.dodirty();
	}
	
	this.mouseleftdown = function(){
		this.pressed++;
		this.dodirty();
	//	console.log(this.pressed);
	}
	
	this.mouseleftup = function(){
		this.pressed--;
	//	console.log(this.pressed);
		this.dodirty();
	}
	this.drawcount = 0;
	this.atDraw = function(){
		this.buttonres.fgcolor = this.labelcolor;
		this.drawcount ++;
	//	console.log("atdraw button", this.drawcount);
		if (this.pressed > 0){
			this.bg.col2 = this.buttoncolor1;
			this.bg.col1 = this.buttoncolor2;
		}else{
			if (this.hovered > 0){
			this.bg.col2 = this.hovercolor2;
			this.bg.col1 = this.hovercolor1;
			}else{
			this.bg.col2 = this.buttoncolor2;
			this.bg.col1 = this.buttoncolor1;
			}
		}
	}
	this.render = function(){

			this.buttonres =  text({rotation: 0, bgcolor:"transparent",fgcolor:"white", position: "relative", text: this.text.toUpperCase(), fontsize: 16})
			
			return this.buttonres;
		}
	
})