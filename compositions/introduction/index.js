define.class(function(composition, require, screens, screen, docviewer, text, scrollcontainer, codeviewer, view, slideviewer, draggable, perspective3d, teapot,ballrotate, architecture){
	// Live coding presentation docs!

	this.attribute('testattr', {type:vec4,value:'red'})
	
	this.render = function render(){ 
		return [
			screens(
				screen({name:'desktop'},
					slideviewer({
						init:function(){
							console.log()
						},
						slideheight:800,
						position:'absolute',
						x: 0,
						bgcolor:'black'
					}
					,view({
							bgcolor:"transparent", 
							flex:1,
							slidetitle:'DreemGL introduction'
						}
						,perspective3d({bgcolor:"transparent", name:"teapotview", flex:1,flexdirection:"row", clipping:true,camera:[10,-10,-30],fov:60,flex:1}
							,teapot({pos:[0,-100],bg:{diffusecolor:'white'},rot3d:[PI/2,0,0], pos3d:[0,2,0]})
							,ballrotate({bgcolor:"transparent", init:function(){this.target= this.find("teapotview");}, flex:1})	
						)
					)
					,view({
						slidetitle:'This presentation'
						,flex:1
						}
						,scrollcontainer({flex:1},
							codeviewer({flex:1,margin:vec4(10),code:render.toString(), padding:vec4(4), fontsize: 14, bgcolor:"#000030", multiline: true})
						)
					)
					,view({
							slidetitle:'Architecture overview'
							,flex:1 , bgcolor:"transparent" 
						}
						,architecture({flex:1, file:require("./dreemglarchitecture.json")})
					)
					,view({
							flex:1,
							bgcolor:'transparent',
							slidetitle:'Using shaders to style'
						}
						,perspective3d({bgcolor:'transparent',name:"teapotview2", flex:1,flexdirection:"row", clipping:true,camera:[10,-10,-70],fov:60,flex:1,
							render:function(){
								var ret = [
									ballrotate({
										bgcolor:"transparent", 
										init:function(){this.target= this.find("teapotview2");}, flex:1}
									)
								]
								for(var i = 0; i < 16; i ++) ret.push(
									teapot({
										position:'absolute',
										attribute_vanim:{type:float, value:0, duration:0.5, motion:'bounce'},
										mouseover:function(){
											this.vanim = 1
										},
										mouseout:function(){
											this.vanim = 0
										},
										pos:[0,0],
										bg:{
											i:i,
											view:{vanim:0},
											patterns: require('./shaderpatterns').prototype,
											color:function(){
												return vec4( patterns.wave(mesh.uv, i*.1 + view.vanim * 10., i*.1 + view.vanim * 10.) * pal.pal1(i*.1).xyz, 1.)
											//	return vec4( patterns.stripe(mesh.uv, 10., i*.1 + view.vanim * 10.) * pal.pal1(i*0.1).xyz, 1.) 
											}
										}
										,rot3d:[PI/3,0,0], pos3d:[floor(i/4)*12-17,(i%4)*10-15,0]
									})
								)
								return ret
							}
						})
					)
					,view({
						flex:1,
						slidetitle:'Rendering vs drawing'
					},
					view({flexdirection:'row', flex:1},
						codeviewer({flex:1,alignself:'stretch',margin:vec4(10),code:function(){
							// Rendering returns scenegraph structures
							this.render = function(){
								return view({}, view({}))
							}

							// Drawing is the actual GL drawcall flow
							this.atDraw = function(){ // called right before drawing
								// we can mess with the shader instance here
								this.bg_shader.value += 0.1
							}

							// make sure we redraw on mousemove
							this.mousemove = function(){
								this.setDirty(true)
							}
							
							// subclass the default background shader
							this.bg = {
								value:0,
								color:function(){
									return mix('red', 'green', abs(sin(mesh.y+value)))
								}
							}
						}.toString(), padding:vec4(4), fontsize: 14, bgcolor:"#000030", multiline: true})
						,view({flex:1,padding:4,margin:10,
								mousemove:function(){
									this.setDirty(true)
								},
								atDraw:function(){
									this.bg_shader.value += 0.1
								},
								bg:{
								value:1,
								color:function(){
									return mix('red', 'green', abs(sin(mesh.y+value)))
								}
							}
						})
					)
				)
				,view({
						flex:1,
						clipping:true,
						slidetitle:'Compositions'
					}
					,codeviewer({flex:1,margin:vec4(10),code:require('../rpcremote').module.factory.body.toString(), padding:vec4(4), fontsize: 14, bgcolor:"#000030", multiline: true})
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
			}
			,view({
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
		)]
	}
})