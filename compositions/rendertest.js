//Pure JS based composition
define.class(function(composition, screens, screen, view){

	this.render = function(){ return [
		screens(
			screen({clearcolor:'#484230'},
				view({
//					size:[100,100],
					name:'viewbg',
					flexdirection:'column',
					margin:4,
					flex:1,
					borderradius:30, 
				
					bgcolor:'#CBD6D9'
					} 
					,view({flex:1,margin:20,bgcolor:'#8FA4A6',name:'view1', borderwidth:4, bordercolor:"#F2E5C9", borderradius:12})
					,view({
						flex:1,borderradius:vec4(10,20,30,40),name:'view2',
						margin:20,mode:'2D',bgcolor:'#A39565', bordercolor:"#484230", borderwidth: 20
					})
				)
			)
		)
	]}
})