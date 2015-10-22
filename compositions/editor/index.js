// this is the teem object for the composition
define.class(function(composition, screens, fileio, visualeditor){
	this.render = function(){
		return [
			fileio(),
			screens(
				visualeditor( {})
			)
		]
	}
})