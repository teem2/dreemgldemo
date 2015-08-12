define.browser(function(require, screen, view, edit, text, myview, treeview){
	this.render = function(){return[
		view({},
			view({},
			edit({x:100,y:0,w:300,h:80,fontsize:60,text:'Type\nHere\nMultiline'}))
				//,treeview({x:0,y:0})
			)
		
		]
	}
})



