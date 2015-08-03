define.browser(function(require, screen, myview){
	this.render = function(){return[
		myview({w:800,h:600})
		/*view({
			bordercolor:'blue', borderwidth:10, cornerradius:30, y:20, x:10, w:800, h:600,
			'bg.color': function(){
				return vec4(demos.highdefblirpy(mesh.xy, 8*time, .5),1.)
				return mix('orange', 'black',
					0.9*sin(48 * length(mesh.xy * vec2(.5, .9) - vec2(.25, .5)) + 40 * time))
			}
		})*/
		//,view({mode:'DOM', tag:'iframe', 'src':'http://www.google.com', bgcolor:'yellow', x:10, y:100, w:190, h:190})
		//,treeview({})
		]
	}
})



