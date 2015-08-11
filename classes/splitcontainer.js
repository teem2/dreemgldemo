// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite,  view){
	this.attribute("vertical", {type: Boolean, value: true});
	this.attribute("splitsize", {type: float, value: 14});
	this.attribute("splittercolor", {type: vec4, value: vec4("#404050")});
	this.attribute("hovercolor", {type: vec4, value: vec4("#5050a0")});
	this.attribute("activecolor", {type: vec4, value: vec4("#7070a0")});
	this.flex = 1.0;
	this.flexdirection = this.vertical?"column":"row" ;
	this.position = "relative" ;
	this.borderwidth =1;
	this.bordercolor = vec4("#303060");
	
	this.splitter = view.extend(function(){
		this.bgcolor = vec4("red");
		
		this.alignitem = "stretch";
		this.attribute("vertical", {type: Boolean, value: false});
		this.attribute("splitsize", {type: float, value: 10});
		this.attribute("splittercolor", {type: vec4, value: vec4("#404050")});
		this.attribute("hovercolor", {type: vec4, value: vec4("#5050a0")});
		this.attribute("activecolor", {type: vec4, value: vec4("#7070a0")});

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
			
			
			
			this.mousemove = function(a){
				
				
				console.log(a, this.mouse.x);
				
			};
		}
		
		this.mouseleftup = function()
		{
			this.pressed--;
			this.setDirty(true);
			
			this.mousemove = function(){};
		}
		
		this.atDraw = function()
		{
			if (this.hovered > 0){
				if (this.pressed > 0){
					this.bgcolor = this.activecolor;
				}
				else{
					this.bgcolor = this.hovercolor;
				}
			}
			else{
				this.bgcolor = this.splittercolor;
			}
		}
		
		this.render = function(){
			if (this.vertical){
				this.height = this.splitsize;
				this.width = NaN;
			}else{
				this.width = this.splitsize;;
				this.height = NaN;
			}
				
		}
		
	});
	
	this.render = function(){		
		if (this.children.length > 1){
			this.flexdirection = this.vertical?"column":"row" ;
			this.newchildren = []
			this.newchildren.push(this.children[0]);
			if (!this.children[0].flex) this.children[0].flex =1;
			for (var i = 1;i<this.children.length;i++){
				if (!this.children[i].flex) this.children[i].flex =1;
				this.newchildren.push(this.splitter({vertical: this.vertical, splitsize: this.splitsize, splittercolor: this.splittercolor, hovercolor: this.hovercolor, activecolor: this.activecolor}));
				this.newchildren.push(this.children[i]);				
			}
			this.children = [];
			return this.newchildren;
				
		}else{
			return []
		}
	}
});