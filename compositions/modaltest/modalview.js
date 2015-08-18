// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// mouse debug class

define.class(function(sprite, text, view){
	
	this.position = "absolute" ;
	this.left = 100;
	this.top = 100;
	this.render = function(){
		this.margin=  140;
		this.flexdirection = "column" ;
		
		return [view({bgcolor: "white" , flex: 1, flexdirection:"column" }
						,view({bgcolor: "#70a0a0" , padding: 4,flexdirection:"column" },
							text({text:"Modal Dialog!", bgcolor: "transparent" , fontsize: 16})
						)
						,view({},
							text({text:"I am a modal!", fontsize: 20, margin: 20,fgcolor: "black" })
						)
					)
					];
	}
	
	
});