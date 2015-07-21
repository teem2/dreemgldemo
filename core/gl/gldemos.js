// Seriously awesome GLSL noise functions. (C) Credits and kudos go to
// Copyright (C) Stefan Gustavson, Ian McEwan Ashima Arts
// MIT License. 

define(function(require, exports){
	exports.noise = require('./glnoise')
	exports.pal = require('./glpalette')

	exports.highdefblirpy = function(pos, time, zoom){
		var xs = 10. * zoom
		var ys = 12. * zoom
		var x = pos.x*xs+0.1*time
		var y = pos.y*ys
		var ns = noise.snoise3(x, y, 0.1*time)
		return	pal.pal0(ns) + 0.5*(vec3(1.)*sin(-8*time + (length(pos-.5)-.01*ns+ .001*noise.snoise3(x*10, y*10, 0.1*time))*2400))
	}
})