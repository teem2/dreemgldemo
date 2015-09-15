// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite,  view, scrollbar){
	// The scrollcontainer wraps all its children in a movable frame with 2 scrollbars around it.
	
	this.flexdirection = "column" ;
	this.flexwrap = "none" ;
	this.alignitems = "stretch";
	this.flex = 1;

	this.attribute("scrollbarwidth", {type: int, value: 16});
	this.attribute("has_hscroll", {type: boolean, value: true});
	this.attribute("has_vscroll", {type: boolean, value: true});
	this.attribute("move_view_bgcolor", {type: vec4, value: vec4("white")});
	
	this.mousewheelx = function(){
		if(this.hscroll && this.mouse_height){
			var off = this.hscroll.offset
			off = clamp(off + value / this.mouse_width, 0, 1 - this.hscroll.page)
			if(off !== this.hscroll.offset) this.hscroll.offset = off
		}
	}

	this.mousewheely = function(value){
		if(this.vscroll && this.mouse_height){
			var off = this.vscroll.offset
			off = clamp(off + value / this.mouse_height, 0, 1 - this.vscroll.page)
			if(off !== this.vscroll.offset) this.vscroll.offset = off
		}
	}

	this.updatescrollbars = function(view){
		var rect = view.getUnclippedBoundingRect()
		if(this.vscroll){
			if(view.layout.height > rect.bottom){
				this.vscroll.page = 1
			}
			else{
				this.vscroll.page = view.layout.height / rect.bottom
				this.scaled_height = (rect.bottom - view.layout.height) / (1 - this.vscroll.page)
				this.mouse_height = rect.bottom
			}
		}
		if(this.hscroll){
			if(view.layout.width > rect.right){
				this.hscroll.page = 1
			}
			else{
				this.hscroll.page = view.layout.width / rect.right
				this.scaled_width = (rect.right - view.layout.width) / (1 - this.hscroll.page)
				this.mouse_width = rect.bottom
			}
		}
	}

	this.render = function(){		
		if (this.instance_children.length === 0) return []
		var pthis = this
		return [
			view({flexdirection :"row", flex: 1 },
				view({bgcolor: "#c0c0c0",  clipping:false, flex:1},
					view({bgcolor: this.move_view_bgcolor,  clipping:true, flex:1, alignself: "stretch",  margin: 0,
						postLayout:function(){
							pthis.updatescrollbars(this)
						}},
						this.move_view = view({bgcolor: this.move_view_bgcolor, flex:1}, 
							this.instance_children
						)
					)
				),
				this.has_vscroll && (this.vscroll = scrollbar({width:this.scrollbarwidth, offset:function(){
					pthis.move_view.y = this.offset * pthis.scaled_height * -1
					//console.log(this.offset)
				}}))	
			),
			view({flexdirection :"row" },
				view({width:this.scrollbarwidth}),
				this.has_hscroll &&	(this.hscroll = scrollbar({vertical:false, height:this.scrollbarwidth, flex:1, offset:function(){
					pthis.move_view.x = this.offset * pthis.scaled_width * -1
				}}))
			)
		]
	}
})
