define.class(function(require, screen, view, text, cube, perspective3d, teapot, model, plane, button,sphere, ballrotate){

	this.bgcolor = vec4("#f0f0f0") 
	this.padding = vec4(0);
	
	this.render = function(){
		return [
			view({alignitems:"stretch",flexdirection:"column" , flex: 0.3, bgcolor:"transparent", bg:{bgcolorfn:function(a,b){return vec4("black" ) + (1-a.y) * vec4("#005060");}}}
				,perspective3d({ bgcolor:"transparent", aligself:"stretch", clipping: true, fov:45, camera:[0,0,-100], lookat:[0,0,0],margin:vec4(0), borderwidth:0, bordercolor:"lightgray"}, 
					button({text:"I am a button in a 3d viewport" })
				)
				,view({flexdirection:"row", flex: 1, bgcolor:"transparent"}
					,perspective3d({flex: 1, bgcolor:"transparent", aligself:"stretch", clipping: true, fov:45, camera:[53,-10,-53], lookat:[0,0,0],margin:vec4(0), borderwidth:0, bordercolor:"lightgray"}, 
						model({file:"molecule.obj", rot3d:[PI,PI/2,0],scale3d:[0.2,0.2,0.2],pos3d:[-1,-15,0]}),
						model({file:"molecule.obj", rot3d:[PI,PI/2 + 0.1,0],scale3d:[0.2,0.2,0.2],pos3d:[-1,-10,0]}),
						model({file:"molecule.obj", rot3d:[PI,PI/2 + 0.2,0],scale3d:[0.2,0.2,0.2],pos3d:[-1,-5,0]}),
						model({file:"molecule.obj", rot3d:[PI,PI/2 + 0.5,0],scale3d:[0.2,0.2,0.2],pos3d:[-1,0,0]}),
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
							}, rot3d:[PI/2,0,0], pos3d:[0,1,0]})
					)
					,perspective3d({name:"rotatableview", flex: 1, bgcolor:"transparent", aligself:"stretch", clipping: true, borderwidth:12, bordercolor:"black",fov:40, camera:[0,0,-100]}
						
						,ballrotate({init:function(){this.target= this.find("rotatableview");}, width:100, height:100})	
						,teapot({position:"absolute" , radius: 1, detail:4, pos3d:[10,0,10], rot3d:[PI/2,0,0]})
						,teapot({radius: 1, detail:4, pos3d:[20,0,20], rot3d:[PI/2,0,0]})
						,teapot({radius: 1, detail:4, pos3d:[30,0,30], rot3d:[PI/2,0,0]})
						,teapot({radius: 1, detail:4, pos3d:[40,0,40], rot3d:[PI/2,0,0]})
						,teapot({radius: 1, detail:4, pos3d:[0,0,0], rot3d:[PI/2,0,0]})
						
						,sphere({radius: 1, pos3d:[-20,0,0]})
						,sphere({radius: 1, pos3d:[-10,0,0]})
						,sphere({radius: 1, pos3d:[0,0,0]})
						,sphere({radius: 1, pos3d:[10,0,0]})
						,sphere({radius: 1, pos3d:[20,0,0]})
					)
					
				)
				,view({flex: 1, bgcolor:"rgba(40,220,255,150)", bordercolor:"transparent", flexdirection:"row" }
				,perspective3d({clipping: true, flex: 1, bgcolor:"transparent" }
					, cube({bgcolor: "black", pos3d:[1,0,0], dimension:[0.2,0.2,0.2], rot3d:[.0,.1,0]})				
					, cube({bgcolor: "black", pos3d:[2,0,0], dimension:[0.2,0.5,0.2], rot3d:[.1,.1,0]})				
					, cube({bgcolor: "black", pos3d:[3,0,0], dimension:[0.2,0.8,0.2], rot3d:[.2,.1,0]})				
					, cube({bgcolor: "black", pos3d:[4,0,0], dimension:[0.2,1.1,0.2], rot3d:[.3,.1,0]})				
					, cube({bgcolor: "black", pos3d:[5,0,0], dimension:[0.2,1.4,0.2], rot3d:[.4,.1,0]})				
					, cube({bgcolor: "black", pos3d:[0,0,0], dimension:[0.2,0.5,0.2], rot3d:[-.1,.1,0]})				
				)
				,perspective3d({flex:1, clipping: true, bgcolor:"transparent"}, 
					cube({bgcolor: "black", rot3d:[2,1,0]}))
				)
			)
		]
	}
})