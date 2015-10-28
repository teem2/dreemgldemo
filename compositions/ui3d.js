//Pure JS based composition
define.class(function(composition, screens, screen, scrollcontainer, codeviewer, perspective3d, perspective2d, cube, view, button){
	this.render = function(){ return [
		screens( 
			screen( 
				perspective3d({camera:[-10,-10,-10]}
				,cube()
				,perspective2d({position:"absolute" , bgcolor:"blue", width:400,height:400 },
					button({text:"some 2d button!"})
				)
				
				)
			)
		)
		]
	}
});