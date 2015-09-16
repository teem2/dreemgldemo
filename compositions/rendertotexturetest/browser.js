define.class(function(require, screen, view, edit, text){
	this.render = function(){return[
	view({w:40,h:40,x:0, bgcolor: "red"},
			 view({w:10,h:10, bgcolor: "purple"}),
			 view({x:300,y:10,w:10,h:10, bgcolor: "purple"})
			),
		view({w:50,h:50,y:120, bgcolor: "blue"}),
		view({w:60,h:60,y:260, bgcolor: "yellow"})		
		]
	}
})



