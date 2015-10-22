"use strict";
define.class(function(view, icon, text){

	this.margin = vec4(0,4,0,0)
	this.padding = 0
	this.attribute("text", {type:String, value:""})
	this.attribute("title", {type:String, value:""})
	this.attribute("input", {type:boolean, value:""})
	this.attribute("basecolor", {type:vec4, value: vec4("green")})
	this.attribute("icon", {type:string, value:"flask"})
	this.attribute("targetscreen", {type:String, value:""})
	this.attribute("attrib", {type:String, value:""})
	this.flex = 1.0;
	this.alignself = "stretch"
	this.flexdirection = "row"
	
	this.hovered = 0;

	this.mouseover = function(){
		this.hovered++;
		this.setDirty();		
	}
	
	this.mouseout = function(){
		if (this.hovered>0) this.hovered--
		this.setDirty()	
	}
	
	this.bg.basecolor = vec4()
	this.bg.direction  = 1
	this.bg.offset  = 0

	this.bg.bgcolorfn = function(a,b){ 
		//dump = a.x*2;
		return mix(vec4(1,1,1,0), vec4('white'),  offset +  a.x*3 * direction)
	}
	
	this.atDraw = function(){

		this.bg.basecolor = this.basecolor;
	}
	
	this.click = function(){
		if (this.input){
			this.target.setConnectionEnd(this.targetscreen, this.attrib, this.blok, this.value);
		}
		else{
			this.target.setConnectionStart(this.targetscreen, this.attrib, this.blok, this.value);
		}
	}

	this.borderwidth = 0
	this.bordercolor = "white"

	this.render =function(){


		if (this.input){

			this.bg.bgcolorfn = function(a,b){
				//dump = a.x*2;
				return mix(vec4('white'), vec4(1,1,1,0),   offset +  a.x*0.9 * direction)
			}


			this.justifycontent = "flex-start"
			this.cornerradius = vec4(12,12,0,0)


			return [
				view({ bgcolor: "transparent", cornerradius: 8.6,borderwidth: 3,bordercolor: this.basecolor ,width:16, height:16, margin: vec4(3,5,0,3)})
				,icon({marginleft:4,margintop:2,icon: this.icon, fontsize: 12})
				,text({text:this.title,margin:vec4(4,0,0,0),fontsize: 14, bgcolor:"transparent", fgcolor:"#404040"})
			]
		}
		else{
			this.bg.bgcolorfn = function(a,b){
				//dump = a.x*2;
				return mix(vec4(1,1,1,0), vec4('white'),  offset +  a.x*3 * direction)
			}



			this.justifycontent = "flex-end"
			this.cornerradius = vec4(0,0,12,12);
	
			return [
				icon({icon: this.icon, fontsize: 14})
				,text({text:this.title, margin: vec4(4,0,0,0), fontsize: 14, bgcolor:"transparent", fgcolor:"#404040"})
				,view({ bgcolor: "transparent", cornerradius: 8,borderwidth: 3,bordercolor: this.basecolor ,width:16, height:16, margin: vec4(3,5,0,3)})
							]
		}
	}
})