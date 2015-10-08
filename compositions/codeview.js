//Pure JS based composition
define.class(function(teem, screens, screen, codeviewer){
	this.render = function(){ return [
		screens( 
			screen(  
				codeviewer({
				})
			)
		)
	]}
})