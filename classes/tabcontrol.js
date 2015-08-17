// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite,  view, button){
	this.attribute("vertical", {type: Boolean, value: false});
	this.attribute("activetab", {type: int, value: 0});
	
	this.flex = 1;
	
	this.buttoncolor1= vec4("#b0b0b0");
	this.buttoncolor2= vec4("#c0c0c0");
	this.hovercolor1= vec4("#8080c0");
	this.hovercolor2=vec4("#3b5898");
	this.pressedcolor1= vec4("#3b5898");
	this.pressedcolor2= vec4("#637aad");

	
	var tabbutton = button.extend(function tabbutton(){
		this.margin = 0;
		this.marginleft = 6;
		this.borderwidth = 0;
		
	});
	
	this.attribute("minimalchildsize", {type: float, value: 20});
	this.attribute("color", {type: vec4, value: vec4("#404050")});
	this.attribute("hovercolor", {type: vec4, value: vec4("#5050a0")});
	this.attribute("activecolor", {type: vec4, value: vec4("#7070a0")});
	
	this.flexwrap= "";
	
	this.flexdirection = this.vertical?"column":"row" ;
	this.position = "relative" ;
	this.flexdirection = "column"
	this.vertical = function(){
		this.flexdirection = this.vertical?"row":"column" ;
	}
	this.render = function(){		
		var myparent = this;
		if (this.instance_children.length > 1){
			
			this.bar =[ view({flexdirection:"row", bgcolor: "#f0f0f0", borderwidth:1, cornerradius: 0, bordercolor: "#c0c0c0"  },this.instance_children.map(
				function(m,id)
					{						
							return tabbutton({tabid: id, target: myparent, text: m.tabname, icon: m.tabicon? m.tabicon:"", click: function(){console.log(this.target);this.target.activetab = this.tabid}});
					})), view({flex: 1, borderwidth: 1,cornerradius: 0,  bordercolor: "#b0b0b0" ,padding: 4}, this.instance_children[this.activetab])];			
			return this.bar;						
		}else{
			return [];// this.instance_children;
		}
	}
});