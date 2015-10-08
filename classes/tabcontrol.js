// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite,  view, button, text){
	// Create a tabcontrol - 1 tab for each instance-child. Each instance-child can provide a title and an icon property which will be used in the activation button for the tab.
	

	// The currently active tab. 
	this.attribute("activetab", {type: int, value: 0});
	
	// The currently active tab. 
	this.state("activetab");
	
	var tabcontrol = this.constructor;
	
	define.example(this, function Usage(){
		return [
			tabcontrol({}
			,text({tabicon:"flask", tabname:"Flask",  text: "I am on tab 1 - my icon is a flask!", fgcolor: "blue", fontsize: 20})
			,text({tabicon:"gears",tabname:"Gears",text: "I am on tab 2 - my icon is a gearbox!", fgcolor: "red", fontsize: 20})
			,text({tabicon:"briefcase",tabname:"Briefcase",text: "I am on tab 3 - my icon is a briefcase!", fgcolor: "green", fontsize: 20})
			,text({tabicon:"battery-full",tabname:"Battery",text: "I am on tab 4 - my icon is a battery!", fgcolor: "yellow", fontsize: 20})
			)
		]
	});
	
	this.attribute("color", {type: vec4, value: vec4("#404050")});
	this.attribute("hovercolor", {type: vec4, value: vec4("#5050a0")});
	this.attribute("activecolor", {type: vec4, value: vec4("#7070a0")});

	this.flex = 1;
	
	this.buttoncolor1= vec4("#b0b0b0");
	this.buttoncolor2= vec4("#c0c0c0");
	this.hovercolor1= vec4("#8080c0");
	this.hovercolor2=vec4("#3b5898");
	this.pressedcolor1= vec4("#3b5898");
	this.pressedcolor2= vec4("#637aad");

	define.class(this, "tabbutton", function (button){
		this.margin = 0;
		this.marginleft = 6;
		this.borderwidth = 0;	
	});
	
	var tabbuttonprox = this.tabbutton;
	this.flexwrap= "";	
	this.flexdirection = "column";
	this.position = "relative" ;
	this.flexdirection = "column"
	
	this.render = function(){		
		var myparent = this;
		if (this.instance_children.length > 1){		
			this.bar =[ view({flexdirection:"row", bgcolor: "#f0f0f0", borderwidth:1, cornerradius: 0, bordercolor: "#c0c0c0"  },this.instance_children.map(
				function(m,id)
					{						
							return tabbuttonprox({tabid: id, tabdebug:m.tabdebug, target: myparent, text: m.tabname, icon: m.tabicon? m.tabicon:"", click: function(){this.target.activetab = this.tabid}});
					})), view({flex: 1, borderwidth: 2,cornerradius: 0,  bordercolor: "#b0b0b0" ,padding: 4, alignself: "stretch"}, this.instance_children[this.activetab])];			
			return this.bar;						
		}else{
			return [];// this.instance_children;
		}
	}
});