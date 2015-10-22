// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// mouse debug class

define.class(function(sprite, text, view,icon){
	
	this.attribute("items", {type: int, value: 5});
	this.attribute("cols", {type: int, value: 4});
	this.attribute("buttoncolor2", {type: vec4, value: vec4("#8080c0")});
	
	this.flexdirection ="column" 
	this.padding =4;
	this.flex = 1;
	this.alignself = "stretch";
	
	this.wraprow = function(children)
	{
		return view({clipping: true, alignself: "stretch", alignitems: "stretch", flex: 1, flexdirection: "row"}, children);	
	}
	
	this.wrapitem = function(item)
	{
		return view({clipping: true,flex: 1, alignitems: "center", alignself: "center",  flexdirection:"column", flexalign: "center",  margin: 2,borderwidth: 0, bgcolor: vec4(0,0,0,0.02),padding: 4}, item);
	}
	
	this.render = function(){
		
		var new_children = [];
		var new_row = [];
		for (var i = 0; i < this.constructor_children.length;i++){			
			
			new_row.push(this.wrapitem(this.constructor_children[i]));
			
			if ((i+1) % this.cols == 0)
			{
				new_children.push(this.wraprow(new_row));
				new_row = [];
			}
		}
		
		if (new_row.length > 0)  
		{
			while (new_row.length < this.cols) new_row.push(view({flex:1, margin:2, borderwidth: 2,bgcolor:"transparent", bordercolor: "transparent",  padding:4}));
			new_children.push(this.wraprow(new_row));			
		}
		
		return new_children;
	}
	
});