//Pure JS based composition
define.class(function(composition, screens, screen, view, text){

	this.render = function(){ return [
		screens(
			screen({},
				view({
					w:100, h:100, borderradius:1,
					bgcolor:'blue'
				})
			)
		)
	]}
})