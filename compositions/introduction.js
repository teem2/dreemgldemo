define.class(function(composition, require, screens, screen, docviewer, text, scrollcontainer, codeviewer, view, slideviewer, draggable, perspective3d, teapot,ballrotate){
	// Live coding presentation 

	this.attribute('testattr', {type:vec4,value:'blue'})

	this.render = function render(){ return [
		screens(
			screen({name:'desktop'},
				slideviewer({
					init:function(){
					},
					slideheight:800,
					position:'absolute',
					x: 0,
					bgcolor:'black'
					},
					view({
						bgcolor:"transparent", 
						flex:1,
						slidetitle:'DreemGL introduction'
						}
						,perspective3d({bgcolor:"transparent", name:"teapotview", flex:1, flexdirection:"row", clipping:true, camera:[10,-10,-30], fov:60, flex:1}
							,teapot({pos:[0,-100], bg:{diffusecolor:'white'}, rot3d:[PI/2,0,0], pos3d:[0,2,0]})
							,ballrotate({bgcolor:"transparent", init:function(){this.target = this.find("teapotview");}, flex:1})	
						)
					)
					,view({
						slidetitle:'This presentation'
						,flex:1
						}
						,scrollcontainer({flex:1},
							codeviewer({flex:1, margin:vec4(10), code:render.toString(), padding:vec4(4), fontsize: 14, bgcolor:"#000030", multiline: true})
						)
					)
					,view({
						flex:1,
						bgcolor:'transparent',
						slidetitle:'Using shaders to style'
						}
						,perspective3d({bgcolor:'transparent',name:"teapotview2", flex:1,flexdirection:"row", clipping:true,camera:[10,-10,-30],fov:60,flex:1}
							,teapot({pos:[0,0],bg:{color:function(){
								var stripeamt = 7.0
								var stripes = 5.0
								var stripex = floor(mod((mesh.uv.x) * stripes + 0.05, 1.0) * stripeamt) / stripeamt < 0.1? 1.0: 0.0
								var stripey = floor(mod((mesh.uv.y) * stripes + 0.05, 1.0) * stripeamt) / stripeamt < 0.1? 1.0: 0.0
								var maxstripe = max(stripex, stripey)
								return vec4(0 , maxstripe * pow(gl_FragCoord.z / 2.5, 2.0), maxstripe * 0.9, 1)//0.5 + 0.9*maxstripe);
							}}, rot3d:[PI/3,0,0], pos3d:[0,2,0]})
							,ballrotate({bgcolor:"transparent", init:function(){this.target = this.find("teapotview2");}, flex:1})	
						)
					)
					,view({
						flex:1,
						slidetitle:'Rendering vs drawing'
						},
						codeviewer({alignself:'stretch',flex:1,margin:vec4(10),code:function(){
							// Rendering works with structure:

							this.render = function(){
								return view({}, view({}))
							}

							// Drawing works with painting pixels
							this.atDraw = function(){ // called right before drawing

							}
							// subclassing the shader
							this.bg = {
								color:function(){
									return 'red'
								}
							}
						}.toString(), padding:vec4(4), fontsize: 14, bgcolor:"#000030", multiline: true})
					)
					,view({
						flex:1,
						clipping:true,
						slidetitle:'Compositions'
						}
						,codeviewer({flex:1,margin:vec4(10),code:require('./rpcremote').module.factory.body.toString(), padding:vec4(4), fontsize: 14, bgcolor:"#000030", multiline: true})
					)
					,view({
						flex:1,
						slidetitle:'Live documentation'
						}
						,docviewer({flex:1, model:this.constructor})
					)

				)
			),
			screen({
				attribute_mousepos:{type:vec2, value:'${this.main.pos}'},
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