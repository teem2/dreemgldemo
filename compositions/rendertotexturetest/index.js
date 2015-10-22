// this is the teem object for the composition
define.class(function(composition, screens, browser){
	this.render = function(){
		return [
			screens(
				browser()
			)
		]
	}
})