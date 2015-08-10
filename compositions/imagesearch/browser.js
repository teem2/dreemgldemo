define.browser(function(require, screen, view, edit, text, myview){
	this.render = function(){return[
		myview({w:1920,h:1080})
		,edit({x:100,y:0,w:300,h:80,fontsize:60, text:'MyValue'})
		//,edit({x:100,y:30,w:300,h:80,fontsize:60, text:'MyValue'})

			//view({x:0,y:0,w:100,h:100}))
		/*,view({
			bordercolor:'blue', borderwidth:10, cornerradius:30, y:20, x:10, w:300, h:200,
			'bg.color': function(){
				//return demos.highdefblirpy(mesh.xy, 8*time, .5)
				return mix('orange', 'black',
					0.9*sin(48 * length(mesh.xy * vec2(.5, .9) - vec2(.25, .5)) + 40 * time))
			}
		},
			view({
				bordercolor:'blue', borderwidth:10, cornerradius:30, y:20, x:30, w:300, h:200,
				'bg.color': function(){
					return demos.highdefblirpy(mesh.xy, 8*time, .5)
					return mix('orange', 'black',
						0.9*sin(48 * length(mesh.xy * vec2(.5, .9) - vec2(.25, .5)) + 40 * time))
				}
			})
		)*/
		//,view({mode:'DOM', tag:'iframe', 'src':'http://blog.thisisnotrocketscience.nl', bgcolor:'yellow', x:10, y:100, w:190, h:190})
		//,view({mode:'DOM', tag:'iframe', 'src':'http://blog.thisisnotrocketscience.nl', bgcolor:'blue', x:10, y:200, w:290, h:190})
		//,treeview({})
		]
	}
})



