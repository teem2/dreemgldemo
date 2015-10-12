define.class(function(require, screen, view, text){
	
	this.bgcolor = vec4("blue") 
	
	console.log("meh!");
	
	this.render = function(){
		return [
			view({bgcolor:"black", flex:1}, 
				text({text:"I am invisible!", fgcolor: "black", bgcolor: "red", margin: vec4(4) })
			)
		]
	}
})