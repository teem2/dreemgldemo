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
	
	
	this.render = function(){
		var childrenarray = [];
		var childref = this.children;
		if (childref)
		{
			for(var i = 0;i<childref.length;i++){
					childrenarray.push(childref[i]);
			}
		}
		this.children = [];
		
		
		var bar = view({bgcolor: "#303060",position:"relative" , padding: 6},[
					view({bgcolor: "red",width:16,  margin:4}),
					text({fontsize: 16, text:this.title, flex:1, bgcolor: "transparent" })
			]);
		var container = view({bgcolor: "#202040",  padding: 15,position:"relative"} ,childrenarray) 
			
		;
		
			
		return [bar,container];
	}
});