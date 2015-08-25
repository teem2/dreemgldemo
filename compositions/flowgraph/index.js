// this is the teem object for the composition
define.class(function(teem, screens, fileio, flowgraph){
	this.render = function(){
		return [
			fileio(),
			screens(
				flowgraph({})
			)
		]
	}
})