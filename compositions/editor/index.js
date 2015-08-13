// this is the teem object for the composition
define.class(function(teem, screens, fileio, browser){
	this.render = function(){
		return [
			fileio(),
			screens(
				browser( {})
			)
		]
	}
})