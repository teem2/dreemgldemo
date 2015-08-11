// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, view){
	this.title = "folding thing";
	this.render = function(){
		var childrenarray = [];
//		console.log(this);
		var childref = this.children;
		if (childref)
		{
			for(var i = 0;i<childref.length;i++){
				console.log(childref[i]);
					childrenarray.push(childref[i]);
			}
		}
		this.children = [];
		console.dir(childrenarray);
		var result = view({position:"relative",borderwidth:1,bordercolor: "darkgray", bgcolor: "blue", alignitems: "stretch", cornerradius: 14, flexdirection: "column", flex: 1},[
			view({bgcolor: "#303060", height: 33,position:"relative"},[
					text({fontsize: 18, text:this.title, width: 100, bgcolor: "transparent" , margin: 4})

			]), 
			view({bgcolor: "#202040", flex: 1, padding: 1,flexdirection: "column",position:"relative"} 
				,view({bgcolor: "#404080", margin: 5, padding: 1, flex: 1},childrenarray) 
				
			
			)
		])
			
			return result;
	}
});