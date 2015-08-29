//Pure JS based composition
define.class(function(teem, screens, screen, view, text){

	var fileio = define.class(function fileio(server){
		this.init = function(){
			console.log("Server loaded up!")
		}
		this.hello = function(){
			console.log("Received hello call!")
		}
	})

	var myview = define.render(function myname(view){
		//return text({x:0, y:0, text:'Its a live coding widget'})
	})

	this.render = function(){ return [
		fileio(),
		screens(
			screen(
				myview({
					'bg.bgcolorfn':function(pos,tex){
						return demos.highdefblirpy(pos, time*2, 2.)
						//return mix('red','blue',sin(32*length(mesh+time)))

					},
					init:function(){
						this.teem.fileio.hello()
					},
					bgcolor:'transparent',w:2000,h:1000
				})
			)
		)
	]}
})