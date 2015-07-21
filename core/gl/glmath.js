// Seriously awesome GLSL noise functions. (C) Credits and kudos go to
// Copyright (C) Stefan Gustavson, Ian McEwan Ashima Arts
// MIT License. 

define(function(require, exports){
	exports.rotate2d = function(v, angle){
		var cosa = cos(angle)
		var sina = sin(angle)
		return vec2(v.x * cosa - v.y * sina, v.x * sina + v.y * cosa)
	}

	exports.bezier2d = function(p0, p1, p2, p3, t){
		var t2 = t*t;
		var t3 = t2*t;
		var it = (1-t);
		var it2 = it*it;
		var it3 = it2*it;
	//	return p0 + t*vec2(1,0);
		var pos = p0 * it3  + p1*3*t*it2 + p2 * 3*it*t2 +  p3* t3;
		var deriv = -3.0 * p0 * it2 + 3 * p1 * (it2-2*t*it) + 3 * p2 *( -t2 + it * t * 2) + 3 * p3 * t2;
		deriv = normalize(deriv);
		return vec4(pos.x, pos.y, deriv.x, deriv.y);
    }
})