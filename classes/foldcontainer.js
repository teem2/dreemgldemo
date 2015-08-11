// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, view){

	this.title = "folding thing";
	this.position ="relative";
	this.borderwidth = 1;
	this.bordercolor = vec4("gray");
	
	this.alignitems = "stretch";
	
	this.flexdirection = "column";
	this.attribute("collapsed", {type: Boolean, value: false});
	
	this.attribute("buttoncolor1", {type: vec4, value: vec4("#303060")});
	this.attribute("buttoncolor2", {type: vec4, value: vec4("#303060")});	
	this.attribute("hovercolor1", {type: vec4, value: vec4("#404080")});
	this.attribute("hovercolor2", {type: vec4, value: vec4("#5050a0")});
	this.attribute("pressedcolor1", {type: vec4, value: vec4("#3b5898")});
	this.attribute("pressedcolor2", {type: vec4, value: vec4("#637aad")});
	
	this.toggle = function(){
		this.collapsed = !this.collapsed;		
	}
	
	
	this.clickablebar = view.extend(function(){

		this.bggradient = function(a,b){	
			var fill = mix(col1, col2,  (a.y)/0.8);
			return fill;
		}
		this.toggle = function(){console.log("nothing happens")}
		this.attribute("title", {type:String});
		this.position = "relative" ;
		this.bg.col2 = vec4("yellow");
		this.bg.col1 = vec4("yellow");
		this.bg.bgcolorfn = this.bggradient;
		this.padding = 6;
			
		this.render = function()
		{			
			return [view({bgcolor: "red",width:16,  margin:4}), text({fontsize: 16, text:this.title, flex:1, bgcolor: "transparent" })];
		}
		
		this.pressed = 0;
		this.hovered = 0;
		
		this.mouseover  = function(){
			this.hovered++;
			this.setDirty(true);
		}			
		
		this.mouseout  = function(){
			this.hovered--;
			this.setDirty(true);
		}			
		
		this.mouseleftdown = function()
		{
			this.pressed++;
			this.setDirty(true);
		}
		
		this.mouseleftup = function()
		{
			this.pressed--;
			this.setDirty(true);
		}

		this.atDraw = function()
		{
			if (this.hovered > 0){
				if (this.pressed > 0){
					this.bg.col1 = this.parent.pressedcolor1;
					this.bg.col2 = this.parent.pressedcolor2;
				}
				else{
					this.bg.col1 = this.parent.hovercolor1;
					this.bg.col2 = this.parent.hovercolor2;
				}
			}
			else{
					this.bg.col1 = this.parent.buttoncolor1;
					this.bg.col2 = this.parent.buttoncolor2;
			}
		}
		
			
	});
	
	this.render = function(){
		
		this.bar = this.clickablebar({title: this.title});
		
		this.bar.click = this.toggle.bind(this);
		var res = [this.bar];
		if (this.collapsed == false) {
			this.container = view({bgcolor: "#202040",  padding: 15,position:"relative"} ,this.instance_children) 
			res.push(this.container)
		}
		this.children = [];
		
		return res;
	}
});