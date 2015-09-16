// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite, text, view, button){
	this.position = "absolute" ;
	this.left = 100;
	this.top = 100;
	this.width = 100;
	this.height = 100;
	this.render = function(){
		this.margin=  140;
		this.flexdirection = "column";
		return 
			[view({bgcolor: "white" , flex: 1, flexdirection:"column" }
						,view({bgcolor: "#70a0a0" , padding: 4,flexdirection:"column" ,flexdirection:"row", aligncontent:"flex-end"  }
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