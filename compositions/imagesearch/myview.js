define.browser(function(require, view){
	// this is a class, so use it like normal js codeflow
	this.bg.bgcolorfn = function(pos, tex){
		return mix('white','blue',abs(sin(8*mesh.y+time)))
	}
})