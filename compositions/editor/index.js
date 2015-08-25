// this is the teem object for the composition
define.class(function(teem, screens, fileio, visualeditor){
	this.render = function(){
		return [
			fileio(),
			screens(
				visualeditor( {})
			)
		]
	}
})