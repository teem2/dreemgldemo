define.class(function(teem, screens, geomtest, screen){
	this.render = function(){
		return [
			screens(
				geomtest()			
			)
		]
	}
})
