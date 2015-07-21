// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class('$renderer/sprite_$rendermode', function(self){

	self.attribute("linewidth", {type: float, value: 5});
	self.attribute("linecolor", {type: vec4, value: vec4(1,1,0,1)});
	
	self.attribute("p1", {type: vec2, value: vec2(100,0)});
	self.attribute("p2", {type: vec2, value: vec2(0,100)});
	self.attribute("p3", {type: vec2, value: vec2(100,100)});

	self.bg.draw_type = 'TRIANGLE_STRIP'
	
	self.bg.time = 0
	self.bg.linewidth = 10;
	self.bg.p0 = vec2(0,0);
	self.bg.p1 = vec2(100,0);
	self.bg.p2 = vec2(0,100);
	self.bg.p3 = vec2(100,100);
	self.bg.linecolor = vec4(1,1,1,1);

	self.bg.color = function(){
		var hm = sin(mesh.side*PI)
		var norm = vec2(dFdx(hm),  dFdy(hm))
		norm = math.rotate2d(norm, -time+timephase)
		var lightdot = dot(norm, gl_FragCoord.xy*0.015) 
		var sw = sin(bezierlen*8-time*3*timedir+timephase*PI - 2.*cos(mesh.side*3.1415))
		if(sw<0.5)
		{
			sw = 1.
		}
		else
		{
			if(sw>0.5) sw = 0.
		}
		
		return linecolor * mix(mix(vec4(1.0,1.0,1.0,1.0),vec4(0.4,0.4,0.4,1.0 ), sw), vec4(1.0,1.0,1.0,1.0),1.- cos(mesh.side*3.1415));
	}

	self.bg.shapefn = function(v){
		return (sin(v)*.75+0.75)
	}
	//self.bg.dump = 1
	self.bg.scale = function(){
		return 4.5
	}

	self.bg.color3 = function(){
		var flowxy= vec2(bezierlen, mesh.side)
		var slide = bezierlen*2.+4*time 
		var flow1 = (shapefn(slide)+1.)*0.25-.35
		var flow2 = (shapefn(slide+.25*PI)+1.)*0.25
		
		var hm = sin(PI*(mesh.side+.5))- flow2 + flow1*.3 * noise.noise2d(scale()*flowxy)

		///dump = hm

		var norm = vec2(dFdx(hm),  dFdy(hm))
		norm = math.rotate2d(norm, time)
		var lightdot = dot(norm, gl_FragCoord.xy*0.015) 
		var ambient = 0.1
	//	dbg = hm
		var highlight = mix('black','white',lightdot + ambient) 
		var base = mix(bgcolor, 'black', pow(flow2,2.) + sin(flow1))
		var col =  base + highlight
		if(hm<0.) col.a = 1.+16.*hm
		col.a *= mesh.cap
		return col
	}

	self.bg.timedir = 1.0
	self.bg.timephase = 0.
	self.bg.color3 = function(){
		var flowxy= vec2(bezierlen*0.8, mesh.side)
		var slide = bezierlen-4. * time * timedir + timephase * PI2
		var flow1 = (shapefn(slide)+1.)*0.25-.35
		var flow2 = (shapefn(slide+.25*PI)+1.)*0.25
		var flow3 = (shapefn(slide+.25*PI)+1.)
		var hm = sin(PI*(mesh.side+.5))- flow2 

		var norm = vec2(dFdx(hm),  dFdy(hm))
		norm = math.rotate2d(norm, time)//-.75*PI)
		var lightdot = pow(dot(norm, gl_FragCoord.xy*0.01),3.0) 
		var ambient = 0.01
	//	dbg = hm
		var highlight = mix('black','white',lightdot + ambient) 
		var shine = mix('black',vec4(1,0.8,0.8,1.),flow2)
		var shape1 =  (1.5-pow(abs(sin(bezierlen*6.)),.5)*hm*2.)
		var base = mix(bgcolor, 'black',shape1*flow2*2.-.5  )
		var col =  base + highlight*flow3*0.08*linewidth + shine*.3
		if(hm<0.) col.a = 1.+16.*hm
		return col
	}
	//self.bg.dump = 1
	self.bg.position = function(){
		var npos = math.bezier2d(p0, p1, p2, p3, mesh.pos);

		var last = math.bezier2d(p0, p1, p2, p3, 0.)
		bezierlen = 0.
		var step = int(mesh.pos * 100.)
		for(var i = 1; i < 100; i++){
			var mypos = math.bezier2d(p0, p1, p2, p3, float(i) / 100.)
			bezierlen += 0.05*length(mypos - last)
			last = mypos
			if(i >= step) break
		}

		//linewidth*=sin(time + bezierlen*0.4)*10.
		var rx = (npos.x + mesh.side * -npos.w * linewidth);
		var ry = (npos.y + mesh.side * npos.z * linewidth);


		return vec4(rx,ry, 0, 1) * matrix
	}
	
	self.atDraw = function(){
		this.bg.time = (Date.now() - this.time_start)*0.001
		this.bg.linewidth = this.linewidth;
		this.bg.linecolor = this.linecolor;
		this.bg.p0 = vec2(0, 0);
		this.bg.p1 = this.p1;
		this.bg.p2 = this.p2;
		this.bg.p3 = this.p3;
		
	//	this.dirty = true
	}
	// ok lets do some awesome geometry

	self.vertexstruct = define.struct({
		pos: float,
		cap: float,
		side: float
	})
	
	self.bg.mesh = self.vertexstruct.array();

	self.init = function(){
		this.time_start = Date.now()
		this.bg.mesh = this.vertexstruct.array();
		
		var strip = this.bg.mesh
		strip.length = 0
		var steps = 100

		for(var i = 0;i<steps;i++){
			var l1 = i / (steps - 1)//line[i];
			var cap = i==0? 0: i==steps -1? 0: 1
			strip.pushStrip(l1, cap, -0.5, l1, cap,  0.5)
		}
			
		
	}
})