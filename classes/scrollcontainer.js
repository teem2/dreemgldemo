// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite,  view, scrollbar){
	this.flexdirection = "column" ;
	this.flexwrap = "none" ;
	this.alignitems = "stretch";
	this.flex = 1;
	
	this.updatescrollbars = function(view){
		//console.log(view.layout.width, view.layout.height);	
console.log("scroll!");		
	}	
	
	this.render = function(){		
		if (this.instance_children.length === 0) return []

		return [
			view({flexdirection :"row", flex: 1 },
				scrollbar({width:20}), 
				view({bgcolor: "#c0c0c0",  clipping:false, flex:1},
					view({bgcolor: "#c0c0c0",  clipping:true, flex:1, alignself: "stretch",  margin: 10},
						view({bgcolor: "white", flex: 1,borderwidth:1, layoutchanged:function(){this.updatescrollbars(this)}.bind(this)}, 
							this.instance_children
						)
					)
				)
			),
			view({flexdirection :"row" },
				view({width:20}),
				scrollbar({vertical:false, height:20, flex:1})
			)
		]
	}
})