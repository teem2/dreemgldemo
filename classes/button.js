// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, view){
	
	this.attribute("text", {type: String, value: "button"});
	this.buttonres = {};
	this.mouseover = function(){
		this.buttonres.bgcolor = vec4("#6060a0");
	}
	
	this.mouseout = function(){
		this.buttonres.bgcolor = vec4("#404080");		
	}
	
	this.buttonfill = function(a,b){
		return mix(bgcolor*0.05, bgcolor,  a.y);
	}
	
	this.render = function(){
		this.bgcolor = vec4("transparent");
			this.buttonres = view({bgcolor: "#404080",  padding: 5, paddingleft: 10, cornerradius: 4,"bg.bgcolorfn": this.buttonfill, borderwidth: 2,margin: 4, bordercolor: "#202020", flexdirection:"column", flex: 1, alignself:"stretch" }
				
				,text({rotation: 0, bgcolor:"transparent",position: "relative", text: this.text, fontsize: 14})
			);
			this.buttonres.mouseover = this.mouseover;
			this.buttonres.mouseout = this.mouseout;
			return this.buttonres;
		}
	
})