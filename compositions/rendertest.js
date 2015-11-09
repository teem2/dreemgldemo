//Pure JS based composition
define.class(function(composition, screens, screen, view, text){

	this.render = function(){ return [
		screens(
			screen({clearcolor:'black'},
				view({
//					size:[100,100],
					name:'viewbg',
					flexdirection:'column',
					margin:0,
					flex:1,
					borderradius:30, 
					bgcolor:'red'
					} 
					,view({flex:1,margin:20,bgcolor:'blue',name:'view1'})
					,view({
						flex:1,borderradius:20,name:'view2',
						margin:20,mode:'2D',bgcolor:'purple'
					})
				)
			)
		)
	]}
})