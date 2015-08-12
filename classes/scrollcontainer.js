// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite,  view, scrollbar){
	
	this.render = function(){		
		if (this.instance_children.length > 0){
						return [scrollbar(),scrollbar({vertical:true}),view({insidebigger:true}, this.instance_children)];
		}else{
			return [];
		}
	}
});