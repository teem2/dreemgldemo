// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite,  view, scrollbar){
	this.flexdirection = "column" ;
	this.flexwrap = "none" ;
	this.alignitems = "stretch";
	this.flex = 1;
	
	this.updatescrollbars = function(view){
		//console.log(view.layout.width, view.layout.height);			
	}	
	
	this.render = function(){		
		if (this.instance_children.length === 0) return []

		return [
			view({flexdirection :"row", flex: 1 },
				scrollbar({width:20}), 
				view({bgcolor: "#c0c0a0",  clipping:true, flex:1, margin: 4, bordercolor: "red" , borderwidth: 4},
					view({bgcolor: "#8080b0", x:10, y:10,padding:4,flex: 1,borderwidth:1, bordercolor: "red", layoutchanged:function(){this.updatescrollbars(this)}.bind(this)}, 
						this.instance_children
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