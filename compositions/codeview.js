//Pure JS based composition
define.class(function(teem, screens, screen, scrollcontainer, codeviewer){
	this.render = function(){ return [
		screens( 
			screen( 
				scrollcontainer({},
					codeviewer({fontsize:80,bgcolor:'vec4(transparent)'
					})
				)
			)
		)
	]}
})