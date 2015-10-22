define.class(function( screens, geomtest, screen){
	
	this.render = function(){
		return [
			screens(
				geomtest()
			)
		]
	}
})
