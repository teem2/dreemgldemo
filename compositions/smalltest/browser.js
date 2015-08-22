define.browser(function(require, screen, text, view){
	
	var thing2 = view.extend(function(){
		this.bg.color = function(){
			var pos = math.rotate2d(mesh.xy, 0.1*time)
			//demos.highdefblirpy(pos, time, 3.)
			return demos.fractzoom(pos, time, 3.)
				
		}
	});
	
	this.render = function(){return[
		text({text:'test2',fontsize:80,bgcolor:'transparent', fgcolor:'white', w:1000, h:1000})
	]}
})



