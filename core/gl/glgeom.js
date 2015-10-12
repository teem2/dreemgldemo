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

	
	var v1 = vec3(0,0,0);
	var v2 = vec3(0,0,0);
	var v3 = vec3(0,0,0);
	var n1 = vec3(0,0,0);
	var n2 = vec3(0,0,0);
	var n3 = vec3(0,0,0);
	var t1 = vec2(0,0);
	var t2 = vec2(0,0);
	var t3 = vec2(0,0);
	
	var v1n1t1 = function(x,y,z,nx,ny,nz,tx,ty){
		v1[0] = x;
		v1[1] = y;
		v1[2] = z;
		n1[0] = nx;
		n1[1] = ny;
		n1[2] = nz;
		t1[0] = tx;
		t1[1] = ty;
	}
	var v2n2t2 = function(x,y,z,nx,ny,nz,tx,ty){
		v2[0] = x;
		v2[1] = y;
		v2[2] = z;
		n2[0] = nx;
		n2[1] = ny;
		n2[2] = nz;
		t2[0] = tx;
		t2[1] = ty;
	}

	var v3n3t3 = function(x,y,z,nx,ny,nz,tx,ty){
		v3[0] = x;
		v3[1] = y;
		v3[2] = z;
		n3[0] = nx;
		n3[1] = ny;
		n3[2] = nz;
		t3[0] = tx;
		t3[1] = ty;
	}
	
	exports.createCube = function(width, height, depth, cb){
		if(arguments.length === 2) cb = height, height = depth = width
		if(arguments.length === 3) cb = depth, depth = height, height = width
		
		var hw = width / 2;
		var hh = height / 2;
		var hd = depth / 2;

// vertices:		
//		   d --- c
//		  /|    /|
//		 a --- b |
//		 | h - |-g
//       |/    |/		
//       e --- f
// faces:
// abcd -> abc, acd ->  0, 0,-1
// aefb -> aef, afb ->  0,-1, 0
// adhe -> adh, ahe -> -1, 0, 0
// bfgc -> bfg, bgc ->  1, 0, 0
// cghd -> cgh, chd ->  0, 1, 0
// ehgf -> ehg, egf ->  0, 0, 1

		var ax = -hw, ay = -hh, az = -hd;
		var bx = hw, by = -hh, bz = -hd;
		var cx = hw, cy = hh, cz = -hd;
		var dx = -hw, dy = hh, dz = -hd;
		var ex = -hw, ey = -hh, ez = hd;
		var fx  = hw, fy = -hh, fz = hd;
		var gx = hw, gy = hh, gz = hd;
		var hx = -hw, hy = hh, hz = hd;			
		
		v1n1t1(ax,ay,az,0,0,-1,0,0); v2n2t2(bx,by,bz,0,0,-1,1,0); v3n3t3(cx,cy,cz,0,0,-1,1,1);		
		cb(0, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);
		v1n1t1(ax,ay,az,0,0,-1,0,0); v2n2t2(cx,cy,cz,0,0,-1,1,1); v3n3t3(dx,dy,dz,0,0,-1,0,1);
		cb(1, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);

		
		v1n1t1(ax,ay,az,0,-1,0,0,0);v2n2t2(ex,ey,ez,0,-1,0,1,0);v3n3t3(fx,fy,fz,0,-1,0,1,1);		
		cb(2, v1, v2, v3, n1, n2, n3, t1, t2, t3, 1);
		v1n1t1(ax,ay,az,0,-1,0,0,0);v2n2t2(fx,fy,fz,0,-1,0,1,0);v3n3t3(bx,by,bz,0,-1,0,1,1);		
		cb(3, v1, v2, v3, n1, n2, n3, t1, t2, t3, 1);

		v1n1t1(ax,ay,az,-1,0,0,0,0);v2n2t2(dx,dy,dz,-1,0,0,1,0);v3n3t3(hx,hy,hz,-1,0,0,1,1);		
		cb(4, v1, v2, v3, n1, n2, n3, t1, t2, t3, 2);
		v1n1t1(ax,ay,az,-1,0,0,0,0);v2n2t2(hx,hy,hz,-1,0,0,1,0);v3n3t3(ex,ey,ez,-1,0,0,1,1);		
		cb(5, v1, v2, v3, n1, n2, n3, t1, t2, t3, 2);

		v1n1t1(bx,by,bz,1,0,0,0,0);v2n2t2(fx,fy,fz,1,0,0,1,0);v3n3t3(gx,gy,gz,1,0,0,1,1);		
		cb(6, v1, v2, v3, n1, n2, n3, t1, t2, t3, 3);
		v1n1t1(bx,by,bz,1,0,0,0,0);v2n2t2(gx,gy,gz,1,0,0,1,0);v3n3t3(cx,cy,cz,1,0,0,1,1);		
		cb(7, v1, v2, v3, n1, n2, n3, t1, t2, t3, 3);

		v1n1t1(cx,cy,cz,0,1,0,0,0);v2n2t2(gx,gy,gz,0,1,0,1,0);v3n3t3(hx,hy,hz,0,1,0,1,1);		
		cb(8, v1, v2, v3, n1, n2, n3, t1, t2, t3, 4);
		v1n1t1(cx,cy,cz,0,1,0,0,0);v2n2t2(hx,hy,hz,0,1,0,1,0);v3n3t3(dx,dy,dz,0,1,0,1,1);		
		cb(9, v1, v2, v3, n1, n2, n3, t1, t2, t3, 4);

		v1n1t1(ex,ey,ez,0,0,1,0,0);v2n2t2(hx,hy,hz,0,0,1,1,0);v3n3t3(gx,gy,gz,0,0,1,1,1);		
		cb(10, v1, v2, v3, n1, n2, n3, t1, t2, t3, 5);
		v1n1t1(ex,ey,ez,0,0,1,0,0);v2n2t2(gx,gy,gz,0,0,1,1,0);v3n3t3(fx,fy,fz,0,0,1,1,1);		
		cb(11, v1, v2, v3, n1, n2, n3, t1, t2, t3, 5);		
	}
	
	exports.createSphere = function(addtriangle, radius, detaillevel){			
	}
})