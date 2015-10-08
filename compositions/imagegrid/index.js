// this is the teem object for the composition
define.class(function(teem, screens, browser){
	this.render = function(){
		return [
			screens(
				browser({})
			)
		]
	}
})