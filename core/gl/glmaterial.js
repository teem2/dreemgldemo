// MIT License. 

define(function(require, exports){
	exports.noise = require('./glnoise')
	exports.pal = require('./glpalette')
	exports.math = require('./glmath')

	exports.matcap = function(texture, eye, normal){	
		var r = reflect( eye, normal );
		var m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
		var vN = r.xy / m + .5;		
		return texture2D( texture, vN );
	}
	
	
})