// this is the teem object for the composition
define.class(function(composition, screens, fileio, flowgraph){
	this.render = function(){
		return [
			fileio(),
			screens(
				flowgraph({})
			)
		]
	}
})