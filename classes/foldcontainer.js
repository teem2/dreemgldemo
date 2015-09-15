// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, icon, view){

	// the foldcontainer shows/hides all its children when the top bar is clicked
	
	this.title = "folding thing";
	this.position ="relative";
	this.borderwidth = 1;
	this.margin = 2;
	
	this.bordercolor = vec4("gray");
	
	this.alignitems = "stretch";
	this.flexdirection = "column";
	
	this.attribute("collapsed", {type: Boolean, value: false});
	this.attribute("icon", {type: String, value: 'times'});	
	this.attribute("basecolor", {type: vec4, value: vec4("#8080c0")});
	
	// Function to change the open/closed state. Used by the click handler of the clickablebar.
	this.toggle = function(){
		this.collapsed = !this.collapsed;		
	}
	
	// subclass to lay out the clickable portion of the folding container 
	define.class(this, 'clickablebar', function(view){

		this.bggradient = function(a,b){	
			var fill = mix(col1, col2,  (a.y)/0.8);
			return fill;
		}

		this.toggle = function(){console.log("nothing happens")}

		this.attribute("title", {type:String})
		this.position = "relative"

		this.bg = {
			col2: vec4("yellow"),
			col1: vec4("yellow"),
			bgcolorfn: this.bggradient
		}

		this.padding = 6
			
		this.render = function(){			
			return [icon({fontsize:16, icon:this.icon, fgcolor: "#303030" }), text({marginleft:5,fgcolor:"#303030", fontsize: 16, text:this.title, flex:1, bgcolor: "transparent" })];
		}
		
		this.pressed = 0
		this.hovered = 0
		
		this.mouseover  = function(){
			this.hovered++;
			this.setDirty(true);
		}			
		
		this.mouseout  = function(){
			this.hovered--;
			this.setDirty(true);
		}			
		
		this.mouseleftdown = function(){
			this.pressed++;
			this.setDirty(true);
		}
		
		this.mouseleftup = function(){
			this.pressed--;
			this.setDirty(true);
		}

		this.atDraw = function()
		{
			if (this.hovered > 0){
				if (this.pressed > 0){
					this.bg_shader.col1 = vec4.vec4_mul_float32(vec4(this.parent.basecolor), 1.3);
					this.bg_shader.col2 = vec4.vec4_mul_float32(vec4(this.parent.basecolor), 1.0);
				}
				else{
					this.bg_shader.col1 = vec4.vec4_mul_float32(vec4(this.parent.basecolor), 1.0);
					this.bg_shader.col2 = vec4.vec4_mul_float32(vec4(this.parent.basecolor), 1.2);
				}
			}
			else{
					this.bg_shader.col2 = vec4.vec4_mul_float32_rgb(vec4(this.parent.basecolor), 0.9);
//					this.bg.col1 = this.parent.basecolor;
					this.bg_shader.col1 = this.parent.basecolor;
			}
		}			
	});
	
	// render the foldcontainer - using a clickablebar for the title nad a containerview for the children. 
	this.render = function(){
		
		this.bar = this.clickablebar({icon:this.icon, title: this.title});
		
		this.bar.click = this.toggle.bind(this);
		var res = [this.bar];
		if (this.collapsed == false) {
			this.container = view({bg:{bgcolorfn:function(a,b){return mix(bgcolor*1.7, vec4("white"), (a.y/8))}} , bgcolor: this.basecolor,  padding: 4,position:"relative"} ,this.instance_children) 
			res.push(this.container)
		}
		this.children = [];
		
		return res;
	}
});