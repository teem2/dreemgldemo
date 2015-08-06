define.browser(function(require, view){
	// this is a class, so use it like normal js codeflow
	this.bg.bgcolorfn = function(pos, tex){
		//dbg = mesh.y
		//dbg = vec2(0.5,0.1)
		return mix('whi', 'blue', abs(sin(8 * mesh.y + time)))
	}
})