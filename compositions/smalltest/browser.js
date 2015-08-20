define.browserClass(function(require, screen, view){
	
	var thing2 = view.extend(function(){
		this.bg.color = function(){
			return demos.highdefblirpy(mesh.xy, time, 1.)
		}
	});
	
	this.render = function(){return[
		thing2({w:1000, h:1000})
	]}
})



