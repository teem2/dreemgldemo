// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, view){

	this.title = "folding thing";
	this.position ="relative";
	this.borderwidth = 1;
	this.bordercolor = vec4("gray");
	this.bgcolor = vec4("transparent");
	this.alignitems = "stretch";
	
	this.flexdirection = "column";
	this.attribute("collapsed", {type: Boolean, value: false});
	
	this.attribute("buttoncolor1", {type: vec4, value: vec4("#9090b0")});
	this.attribute("buttoncolor2", {type: vec4, value: vec4("#8080c0")});

	
	this.attribute("hovercolor1", {type: vec4, value: vec4("#8080c0")});
	this.attribute("hovercolor2", {type: vec4, value: vec4("#3b5898")});
	this.attribute("pressedcolor1", {type: vec4, value: vec4("#3b5898")});
	this.attribute("pressedcolor2", {type: vec4, value: vec4("#637aad")});
	
	this.toggle = function(){
		this.collapsed = !this.collapsed;
		console.log("foldcontainer: " , this.collapsed);
	}
	
	
	this.bggradient = function(a,b){
		
		var fill = mix(col1, col2,  (a.y)/0.8);
				
	//	if (a.y< 0.2) fill  = mix(col2, fill, a.y*5.)
	//	if (a.x < 0.1) fill =  mix(col2, fill, a.x*10.)
	//	if (a.x > 0.9) fill =  mix(col2, fill, 1.-(a.x-0.9)*10.)
		return fill;
	}
	
	
	
	this.render = function(){
		
		this.bar = view({bgcolor: "#303060",position:"relative" , "bg.col2":vec4("yellow"), "bg.col1":vec4("yellow"), "bg.bgcolorfn": this.bggradient, padding: 6},[
			view({bgcolor: "red",width:16,  margin:4}),
			text({fontsize: 16, text:this.title, flex:1, bgcolor: "transparent" })
		]);
		this.bar.pressed = 0;
		this.bar.hovered = 0;
		this.bar.mouseenter  = function()
		{
		}			
		this.bar.atDraw = function()
		{
			this.bg.col1 = this.parent.hovercolor1;
			this.bg.col2 = this.parent.hovercolor2;
		}
		
		this.bar.click = function(){
			this.toggle();
		}.bind(this);
			
		var res = [this.bar];
		if (this.collapsed == false) {
			var childrenarray = [];
			var childref = this.children;
			if (childref) {
				for(var i = 0;i<childref.length;i++){
					childrenarray.push(childref[i]);
				}
			}
			this.container = view({bgcolor: "#202040",  padding: 15,position:"relative"} ,childrenarray) 
			res.push(this.container)
		}
		this.children = [];
		
		return res;
	}
});