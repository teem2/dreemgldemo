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
		return mix(vec4(1,1,1,0), basecolor*1.6,  offset +  a.x * direction)
	}
	
	this.atDraw = function(){
		if (this.input === false){
			this.bg.direction = 1
			this.bg.offset = 0
		}
		else {
			this.bg.direction = -1
			this.bg.offset = 1
		}
		if (this.hovered  > 0){
			this.bg.basecolor = vec4.vec4_mul_float32(this.basecolor, 1.6);
		}
		else{
			this.bg.basecolor = this.basecolor;
		}
	}
	
	this.click = function(){
		if (this.input){
			this.target.setConnectionEnd(this.targetscreen, this.attrib, this.blok, this.value);
		}
		else{
			this.target.setConnectionStart(this.targetscreen, this.attrib, this.blok, this.value);
		}
	}

	this.borderwidth = 2
	this.bordercolor = "white"
	
	this.render =function(){		
		if (this.input){
			this.justifycontent = "flex-start"
			this.cornerradius = vec4(12,12,0,0)
	
			return [
				view({bgcolor: "white", padding: vec4(4,0,4,2), cornerradius: 10,borderwidth: 2,bordercolor:"white",margin: vec4(3,3,0,3)}
					,icon({icon: this.icon, fontsize: 14})
				)
				,text({text:this.title,margin:vec4(4,2,0,0),fontsize: 14, bgcolor:"transparent", fgcolor:"#404040"})
			]
		}
		else{
			this.justifycontent = "flex-end"
			this.cornerradius = vec4(0,0,12,12);
	
			return [
				text({text:this.title, margin: vec4(4,2,16,0), fontsize: 14, bgcolor:"transparent", fgcolor:"#404040"})
				,view({bgcolor: "white", padding: vec4(4,0,4,2), cornerradius: 10,borderwidth: 2,bordercolor:"white" ,  margin: vec4(0,3, 3,3)}
					,icon({icon: this.icon, fontsize: 14})
				)
			]
		}
	}
})