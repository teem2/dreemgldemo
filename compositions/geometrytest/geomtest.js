define.class(function(require, screen, view, text, cube, perspective3d){
	this.bgcolor = vec4("blue") 
	
	console.log("meh!");
	
	this.render = function(){
		return [
			view({bgcolor:"gray", flex:1}
				,text({text:"3D Scene test 1", fontsize: 40,  fgcolor: "white", bgcolor: "transparent", margin: vec4(4), padding: vec4(10)})
				,perspective3d({}, cube({bgcolor: "black"}))
				,text({text:"3D Scene test 1", fontsize: 40,  fgcolor: "darkblue", bgcolor: "transparent", margin: vec4(4), padding: vec4(10)})
			)
		]
	}
})