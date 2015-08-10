// this is the teem object for the composition
define.class(function(teem, screens, moviedb, browser){
	this.render = function(){
		return [
			moviedb(),
			screens(
				browser( {})
			)
		]
	}
})