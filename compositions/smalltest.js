//a JS based composition
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
		return text({x:0, y:0, bgcolor:'blue', text:'HELLO WORLD'})
	})

	this.render = function(){ return [
		fileio(),
		screens(
			screen(
				myview({
					init:function(){
						this.teem.fileio.hello()
					},
					bgcolor:'transparent',w:200,h:100
				})
			)
		)
	]}
})