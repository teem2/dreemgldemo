// this is the teem object for the composition
define.class(function(composition, screens, minidialog){
	this.render = function(){
		return [
			screens(
				minidialog( {})
			)
		]
	}
})