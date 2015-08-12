// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite,  view, scrollbar){
		this.flexdirection = "column" ;
		this.render = function(){		
		if (this.instance_children.length > 0){
						return [view({flexdirection :"row" },scrollbar({width:20}),view({bgcolor: "#c0c0a0",flex:1,insidebigger:true}, this.instance_children)),view({flexdirection :"row" },view({width:20}),scrollbar({vertical:false, height:20, flex:1}))];
		}else{
			return [];
		}
	}
});