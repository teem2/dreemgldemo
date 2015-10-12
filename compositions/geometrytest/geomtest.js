define.class(function(require, screen, view, text, cube){
	this.bgcolor = vec4("blue") 
	
	console.log("meh!");
	
	this.render = function(){
		return [
			view({bgcolor:"lightblue", flex:1}
				,text({text:"Geometrytest 1", fgcolor: "darkblue", bgcolor: "transparent", margin: vec4(4), padding: vec4(10)})
				,cube({x: 200, y: 200, width: 1000, height:1000, bgcolor: "black"})
			)
		]
	}
})