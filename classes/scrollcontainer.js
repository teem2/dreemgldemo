// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite,  view, scrollbar){
	// The scrollcontainer wraps all its children in a movable frame with 2 scrollbars around it.
	
	this.flexdirection = "column" ;
	this.flexwrap = "none" ;
	this.alignitems = "stretch";
	this.flex = 1;
	this.attribute("scrollbarwidth", {type: int, value: 16});
	
	this.updatescrollbars = function(view){
		var rect = view.getUnclippedBoundingRect()

		if(view.layout.height > rect.bottom){
			this.vscroll.page = 1
		}
		else{
			// offset (0.. 1-pagesize)
			// pagesize (0-1)
			this.vscroll.page = view.layout.height / rect.bottom
			this.computed_height = (rect.bottom - view.layout.height) / (1 - this.vscroll.page)
		}

		//console.log("SCROLLBARH")
	}

	this.render = function(){		
		if (this.instance_children.length === 0) return []
		var pthis = this
		return [
			view({flexdirection :"row", flex: 1 },
				view({bgcolor: "#c0c0c0",  clipping:false, flex:1},
					view({bgcolor: "#c0c0c0",  clipping:true, flex:1, alignself: "stretch",  margin: 0,
						postLayout:function(){
							pthis.updatescrollbars(this)
						}},
						this.move_view = view({bgcolor: "white", flex:1, borderwidth:1}, 
							this.instance_children
						)
					)
				),
				this.vscroll = scrollbar({width:this.scrollbarwidth, offset:function(){
					pthis.move_view.y = this.offset * pthis.computed_height * -1
					//console.log(this.offset)
				}})	
			),
			view({flexdirection :"row" },
				view({width:this.scrollbarwidth}),
				this.hscroll = scrollbar({vertical:false, height:this.scrollbarwidth, flex:1,})
			)
		]
	}
})
