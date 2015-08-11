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
	
	this.toggle = function(){
		this.collapsed = !this.collapsed;
		console.log("foldcontainer: " , this.collapsed);
	}
	
	this.render = function(){
		
		this.bar = view({bgcolor: "#303060",position:"relative" , padding: 6},[
			view({bgcolor: "red",width:16,  margin:4}),
			text({fontsize: 16, text:this.title, flex:1, bgcolor: "transparent" })
		]);
		
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