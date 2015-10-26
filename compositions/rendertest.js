//Pure JS based composition
define.class(function(composition, screens, screen, view, text){

	var fileio = define.class(function fileio(server){
		
		this.attribute('bla', {type:String, value:'test'})

		this.init = function(){
			console.log("Server loaded up!")
		}

		this.hello = function(){
			console.log("Received hello call!")
			this.rpc.screen.default.test()
		}
	})

	this.render = function(){ return [
		fileio({name:'fileio'}),
		screens(
			screen({
				render: function(){
					return view({
						bg:{
							kali2d: function(pos, steps, space){
								var v = pos
								for(var i = 0; i < 130; i ++){
									if(i > int(steps)) break
									v = abs(v)

									v = v / (v.x * v.x + v.y * v.y) + space
								}			
								return v
							},
							color:function(){
								return mix('red','green',mesh.y)
								return pal.pal1( kali2d(mesh.xy, 20, vec2(-0.8280193310201044,-0.658019331020104-abs(0.1*cos(time)))).y )
							}
						},
						init: function(){
							this.rpc.fileio.hello()
						},
						click:function(){
							this.bg_shader.bla = vec4('red')
							this.setDirty(true)
						},
						bgcolor:'blue', w:2000, h:1000
					})
				}
			})
		)
	]}
})