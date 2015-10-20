define.class(function(require, screen, view, text, cube, perspective3d, teapot){
	this.bgcolor = vec4("#f0f0f0") 
	this.padding = vec4(10);
	this.render = function(){
		return [
			view({alignitems:"stretch", flex: 0.3, bgcolor:"transparent" }
				,perspective3d({flex: 1, aligself:"stretch", clipping: true, fov:30, camera:vec3(-35,-5,35), lookat:vec3(0,-2,0),margin:vec4(10), borderwidth:2, bordercolor:"lightgray"}, 
					teapot({radius: 1, detail:2, pos3d:vec3(0,0,0), rot3d:vec3(PI/2,0,5)}),
					teapot({radius: 1, detail:2, rot3d:vec3(PI/2,0,0), pos3d:vec3(10,0,-10)})
				)
			)
			,view({alignitems:"stretch", flex: 0.3, bgcolor:"transparent" }
				,perspective3d({flex: 1, aligself:"stretch", clipping: true, margin:vec4(10), borderwidth:2, bordercolor:"lightgray", fov:90}, 
					teapot({radius: 1, detail:3, pos3d:vec3(4,0,0), rot3d:vec3(0,2,0)}),
					teapot({radius: 1, detail:4, rot3d:vec3(PI/2,0,0), pos3d:vec3(0,5,0)})
				)
			)
			,view({alignitems:"stretch", flex: 0.3, bgcolor:"transparent" }
				,perspective3d({flex: 1, aligself:"stretch", clipping: true, margin:vec4(10), borderwidth:2, bordercolor:"lightgray",fov:40, camera:vec3(-15,-15,15)}, 
					teapot({radius: 1, detail:12, pos3d:vec3(4,0,0), rot3d:vec3(0,2,0)}),
					teapot({radius: 1, detail:12, rot3d:vec3(PI/2,0,0), pos3d:vec3(0,5,0)})
				)
			)
			,view({bgcolor:"rgba(240,220,255,150)", cornerradius:vec4(20) , borderwidth: 1, bordercolor:"transparent", x: 100,y:100,position: "absolute" , flexdirection:"column" , padding:vec4(15)}
			
				,text({text:"Cubes:", fontsize: 20,  fgcolor: "darkblue", bgcolor: "transparent", margin: vec4(1), padding: vec4(2)})
				,perspective3d({clipping: true, width: 200, height: 200, margin:vec4(10)}
					, cube({bgcolor: "black", pos3d:vec3(1,0,0), dimension:vec3(0.2,0.2,0.2), rot3d:vec3(.0,.1,0)})				
					, cube({bgcolor: "black", pos3d:vec3(2,0,0), dimension:vec3(0.2,0.5,0.2), rot3d:vec3(.1,.1,0)})				
					, cube({bgcolor: "black", pos3d:vec3(3,0,0), dimension:vec3(0.2,0.8,0.2), rot3d:vec3(.2,.1,0)})				
					, cube({bgcolor: "black", pos3d:vec3(4,0,0), dimension:vec3(0.2,1.1,0.2), rot3d:vec3(.3,.1,0)})				
					, cube({bgcolor: "black", pos3d:vec3(5,0,0), dimension:vec3(0.2,1.4,0.2), rot3d:vec3(.4,.1,0)})				
					, cube({bgcolor: "black", pos3d:vec3(0,0,0), dimension:vec3(0.2,0.5,0.2), rot3d:vec3(-.1,.1,0)})				
				)
				,perspective3d({clipping: true, width: 100, height: 100, margin:vec4(10), borderwidth:2,cornerradius:vec4(30) , borderwidth: 1,  bordercolor:"black"}, 
					cube({bgcolor: "black", dimension:vec3(10,1,1), rot3d:vec3(1,1,1)}))
				,perspective3d({clipping: true, width: 100, height: 100, margin:vec4(10)}, 
					cube({bgcolor: "black", rot3d:vec3(2,1,0)}))

			)
		]
	}
})