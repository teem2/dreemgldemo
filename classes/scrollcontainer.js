// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite,  view, scrollbar){
	this.flexdirection = "column" ;
	this.flexwrap = "none" ;
	this.alignitems = "stretch";
	this.flex = 1;
	this.attribute("scrollbarwidth", {type: int, value: 16});
	
	this.updatescrollbars = function(view){
		//console.log(view.layout.width, view.layout.height);	
		console.log("SCROLLBARH")
	}	
	
	this.render = function(){		
		if (this.instance_children.length === 0) return []

		return [
			view({flexdirection :"row", flex: 1 },
				view({bgcolor: "#c0c0c0",  clipping:false, flex:1},
					view({bgcolor: "#c0c0c0",  clipping:true, flex:1, alignself: "stretch",  margin: 0},
						view({bgcolor: "white", flex: 1,borderwidth:1, layoutchanged:function(){this.updatescrollbars(this)}.bind(this)}, 
							this.instance_children
						)
					)
				),
				scrollbar({width:this.scrollbarwidth})
				
			),
			view({flexdirection :"row" },
				view({width:this.scrollbarwidth}),
				scrollbar({vertical:false, height:this.scrollbarwidth, flex:1})
			)
		]
	}
})