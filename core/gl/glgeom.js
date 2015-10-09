// MIT License. 

define(function(require, exports){	
	/*
	define.struct({
		pos:vec3
	})

	createCube(10,10,10,function(id, p1, p2, p3, n1, n2, n3, t1, t2, t3){
		buf.push(p1, n1, t1)
		buf.push(p2, n2, t2)
		buf.push(p3, n3, t3)
	})*/

	exports.createCube = function(width, height, depth, cb){
		if(arguments.length === 2) cb = height, height = depth = width
		if(arguments.length === 3) cb = depth, depth = height, height = width
	}
	
	exports.createSphere = function(addtriangle, radius, detaillevel){			
	}
}