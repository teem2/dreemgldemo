//Pure JS based composition
define.class(function(composition, screens, screen, view, text){

	this.render = function(){ return [
		screens(
			screen({clearcolor:'black'},
				view({
//					size:[100,100],
					flexdirection:'column',
					margin:10,
					flex:1,
					borderradius:30, 
					bgcolor:'red'
					} 
					,view({flex:1,margin:10,bgcolor:'blue'})
					,view({flex:1,margin:10,bgcolor:'orange'})
				)
			)
		)
	]}
})