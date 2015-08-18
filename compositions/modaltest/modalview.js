// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// mouse debug class

define.class(function(sprite, text, view, button){
	this.position = "absolute" ;
	this.left = 100;
	this.top = 100;
	this.width = 400;
	this.height = 400;
	this.borderwidth = 4;
	this.bordercolor = vec4("blue");
	this.flexdirection = "row" ;
	this.flex =1;
	this.alignitems = "stretch";
	
	this.margin = 4;
	this.padding = 4;
	this.render = function(){
		
		return 
			[view({bgcolor: "white" , flex: 1, flexdirection:"column" }
						,view({bgcolor: "#70a0a0" , padding: 4,flexdirection:"column" }
							,text({text:"Modal Dialog!", bgcolor: "transparent" , fontsize: 16, flex: 1})
							,button({icon:"close", alignitem: "flex-end" })
						)
						,view({},
							text({text:"I am a modal!", fontsize: 20, margin: 20,fgcolor: "black" })
						)
					)
			];
	}
});