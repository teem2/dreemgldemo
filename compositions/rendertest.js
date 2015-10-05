//Pure JS based composition
define.class(function(teem, screens, screen, view, text){
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
		fileio(),
		screens(     
			screen(  
				view({
					bg:{bgcolorfn: function(pos, tex){
						return 'darkblue'
						//return demos.fractzoom(pos, time * 2, 1.)
						//return demos.highdefblirpy(pos * 0.5, time * 2, 1.)
						//return mix('red','blue',sin(32*length(mesh+time)))
					}},
					init: function(){
						this.teem.fileio.hello()
					},
					bgcolor:'transparent', w:2000, h:1000
				})
			)
		)
	]}
})