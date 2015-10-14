define.class(function(require, screen, view, text, cube, perspective3d){
	this.bgcolor = vec4("blue") 
	
	console.log("meh!");
	
	this.render = function(){
		return [
			view({bgcolor:"#f0f0ff", flex:1, flexdirection:"column" }
				,text({text:"3D Scene test 1", fontsize: 40,  fgcolor: "darkblue", bgcolor: "transparent", margin: vec4(4), padding: vec4(10)})
				,perspective3d({clipping: true, width: 200, height: 200, margin:vec4(10)}
					, cube({bgcolor: "black"})				
					, cube({bgcolor: "black"})				
					, cube({bgcolor: "black"})				
					, cube({bgcolor: "black"})				
					, cube({bgcolor: "black"})				
					, cube({bgcolor: "black"})				
				)
				,perspective3d({clipping: true, width: 100, height: 100, margin:vec4(10), borderwidth:2, bordercolor:"black"}, 
					cube({bgcolor: "black"}))
				,perspective3d({clipping: true, width: 100, height: 100, margin:vec4(10)}, 
					cube({bgcolor: "black"}))

			)
		]
	}
})