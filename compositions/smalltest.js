//This is an all-in-one JS composition
define.class(function(teem, screens, screen, text){
	
	var browser = screen.extend(function browser(){
		this.render = function(){ return [
			text({text:'hello'})
		]}
	})

	this.render = function(){ return [
		screens(
			browser({})
		)
	]}
})