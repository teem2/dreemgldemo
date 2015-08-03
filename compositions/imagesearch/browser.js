define.browser(function(require, screen, view, text, treeview){
	this.render = function(){return[
		view({
			bordercolor:'blue', borderwidth:10, cornerradius:30, y:20, x:10, w:400, h:300,
			'bg.bgcolorfn': function(pos, tex){
				return mix('orange', 'black',
					0.9*sin(48 * length(pos * vec2(.5, .9) - vec2(.25, .5)) + 1 * time))
			}
		})
		//,view({mode:'DOM', tag:'iframe', 'src':'www.google.com', bgcolor:'yellow', x:10, y:100, w:190, h:190})
		//treeview({})
		]
	}
})



