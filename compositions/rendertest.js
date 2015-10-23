//Pure JS based composition
define.class(function(composition, screens, screen, view, text){

	var fileio = define.class(function fileio(server){
		
		this.attribute('bla', {type:String, value:'test'})

		this.init = function(){
			console.log("Server loaded up!")
		}

		this.hello = function(){
			console.log("Received hello call!")
		}
	})

	this.render = function(){ return [
		fileio({name:'fileio'}),
		screens(
			screen({
				render: function(){
					return view({
						bg:{
							color:function(){
								return demo.highdefblirpy(mesh.xy, time, 1)
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