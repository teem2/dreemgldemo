define.class(function(require, screen, view, text, cube, perspective3d, teapot, model, plane, button,sphere){

	this.bgcolor = vec4("#f0f0f0") 
	this.padding = vec4(0);
	
	this.render = function(){
		return [
			view({alignitems:"stretch",flexdirection:"column" , flex: 0.3, bgcolor:"transparent", bg:{bgcolorfn:function(a,b){return vec4("black" ) + (1-a.y) * vec4("#005060");}}}
				,perspective3d({ bgcolor:"transparent", aligself:"stretch", clipping: true, fov:45, camera:vec3(0,0,-100), lookat:vec3(0,0,0),margin:vec4(0), borderwidth:0, bordercolor:"lightgray"}, 
					button({text:"I am a button in a 3d viewport" })
				)
				,perspective3d({flex: 1, bgcolor:"transparent", aligself:"stretch", clipping: true, fov:45, camera:vec3(53,0,53), lookat:vec3(0,-10,0),margin:vec4(0), borderwidth:0, bordercolor:"lightgray"}, 
					model({file:"molecule.obj", rot3d:vec3(PI,0,0),scale3d:vec3(0.2,0.2,0.2),pos3d:vec3(20,-10,0)}),
					model({file:"molecule.obj", rot3d:vec3(PI,1,6),scale3d:vec3(0.2,0.2,0.2),pos3d:vec3(51,-2,0)}),
					model({file:"molecule.obj", rot3d:vec3(PI,5,2),scale3d:vec3(0.2,0.2,0.2),pos3d:vec3(2,-10,0)}),
					model({file:"molecule.obj", rot3d:vec3(PI,2,6),scale3d:vec3(0.2,0.2,0.2),pos3d:vec3(20,-10,0)}),
					model({file:"molecule.obj", rot3d:vec3(PI,PI/2,0),scale3d:vec3(0.2,0.2,0.2),pos3d:vec3(-1,-10,0)}),
					plane({xdiv:1, ydiv:1, dimension:vec2(140,140),
						bg:{
							color:function(){
								var stripeamt = 10.0
								var stripes = 220.0
								var stripex = floor(mod((mesh.uv.x )* stripes  + 0.05,1.0) *stripeamt ) / stripeamt < 0.1?1.0:0.0;
								var stripey = floor(mod((mesh.uv.y  )*stripes + 0.05, 1.0)*stripeamt ) / stripeamt < 0.1?1.0:0.0;
								var maxstripe = max(stripex, stripey);
								return vec4(0 , maxstripe*  pow(gl_FragCoord.z/2.5,2.0),maxstripe * 0.3,0.5 + 0.5*maxstripe);
							}						
						}, rot3d:vec3(PI/2,0,0), pos3d:vec3(0,-10,0)})
				)
				,perspective3d({flex: 1, bgcolor:"transparent", aligself:"stretch", clipping: true, margin:vec4(10), borderwidth:2, bordercolor:"lightgray",fov:40, camera:vec3(0,0,-100)}
					
					,teapot({radius: 1, detail:4, pos3d:vec3(10,0,10), rot3d:vec3(PI/2,0,0)})
					,teapot({radius: 1, detail:4, pos3d:vec3(20,0,20), rot3d:vec3(PI/2,0,0)})
					,teapot({radius: 1, detail:4, pos3d:vec3(30,0,30), rot3d:vec3(PI/2,0,0)})
					,teapot({radius: 1, detail:4, pos3d:vec3(40,0,40), rot3d:vec3(PI/2,0,0)})
					,teapot({radius: 1, detail:4, pos3d:vec3(0,0,0), rot3d:vec3(PI/2,0,0)})
					
					,sphere({radius: 1, pos3d:vec3(-20,0,0)})
					,sphere({radius: 1, pos3d:vec3(-10,0,0)})
					,sphere({radius: 1, pos3d:vec3(0,0,0)})
					,sphere({radius: 1, pos3d:vec3(10,0,0)})
					,sphere({radius: 1, pos3d:vec3(20,0,0)})
				)
			)
/*			*/
/*			,view({bgcolor:"rgba(240,220,255,150)", cornerradius:vec4(20) , borderwidth: 1, bordercolor:"transparent", x: 100,y:100,position: "absolute" , flexdirection:"column" , padding:vec4(15)}
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

			)*/
		]
	}
})