// introduction presentation
define.class(function(composition, screens, screen, text, view, slideviewer, draggable, perspective3d, teapot){

	this.render = function(){ return [
		screens(
			screen({name:'desktop'},
				slideviewer({
					position:'absolute',
					x: 0,
					bgcolor:'black'
					},
					view({
						slidetitle:'DreamGL introduction'
					}
					,perspective3d({pos:[10,300],camera:[0,0,-10],fov:60,size:[50,50]}
						,teapot({rot3d:[PI/2.6,0,0]})
					))
					,view({
						slidetitle:'Rendering 3D'
					})
					,view({
						slidetitle:'Using shaders to style'
					})
					,view({
						slidetitle:'Rendering vs drawing'
					})
					,view({
						slidetitle:'Compositions'
					})
				)
			),
			screen({
				attribute_mousepos:{type:vec2, value:'${this.main.pos}'},
				attribute_mouseclk:{type:boolean, value:'${this.mouse.click}'},
				name:'remote',
				},
				view({
					name:'main',
					size: vec2(200, 200),
					bgcolor: vec4('yellow'),
					is: draggable(),
					init: function(){
						this.screen.mousepos = function(){
							console.log("MOVIN")
						}
						// alright lets make this draggable. framerjs style
					}
				})
			)
		)
	]}
})