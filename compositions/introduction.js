// introduction presentation
define.class(function(composition, screens, screen, text, view, slideviewer, draggable, perspective3d, teapot,ballrotate){

	this.render = function(){ return [
		screens(
			screen({name:'desktop'},
				slideviewer({
					position:'absolute',
					x: 0,
					bgcolor:'black'
					},
					view({
							flex:1,
							slidetitle:'DreamGL introduction'
						}
						,perspective3d({name:"teapotview", flex:1,flexdirection:"row", clipping:true,camera:[10,-10,-30],fov:60,flex:1}
							,teapot({rot3d:[PI/2,0,0], pos3d:[0,2,0]})
							,ballrotate({bgcolor:"transparent", init:function(){this.target= this.find("teapotview");}, flex:1})	
						
						)
					)
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