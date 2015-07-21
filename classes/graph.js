// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class('$renderer/sprite_$rendermode', function(require, self){
	var AnimTrack = require('$animation/animtrack')

	self.attribute("linewidth", {type: float, value: 5});
	self.attribute("linecolor", {type: vec4, value: vec4(1,1,0,1)});
	self.bg.draw_type = 'TRIANGLE_STRIP'
	self.bg.time = 0
	self.bg.linewidth = 10;
	self.bg.linecolor = vec4(1,1,1,1);
	self.bg.color = function(){
		//dump = cos(mesh.pos.x*8-time)*sin(time+8*mesh.pos.x*mesh.pos.y)
		return mix(linecolor,bgcolor,cos(mesh.side*6.283)*0.5 + 0.5);
	}

	self.bg.position = function() {
		
		var rx = (mesh.pos.x * width) + ( mesh.norm.x * mesh.side*linewidth);
		var ry = (mesh.pos.y * height) + ( mesh.norm.y * mesh.side*linewidth);
		
		return vec4(rx,ry, 0, 1) * matrix
	}
	
	self.atDraw = function(){
		this.bg.time = (Date.now() - this.time_start)*0.001
		this.bg.linewidth = this.linewidth;
		this.bg.linecolor = this.linecolor;
	//	this.dirty = true
	}
	// ok lets do some awesome geometry
	
	self.vertexstruct = define.struct({
		pos:vec2,
		norm:vec2,
		side: float,
	})
	
	self.bg.mesh = self.vertexstruct.array();

	self.init = function(){
		this.time_start = Date.now()
		this.bg.mesh = this.vertexstruct.array();
		
		var track = new AnimTrack({
			motion:ease.linear, 
			0:0, 
			0.2:{value:1, motion:ease.expo},
			0.5:{value:0, motion:ease.linear},
			1:  {value:1, motion:ease.expo}		
		})

		var strip = this.bg.mesh
		strip.length = 0
		var steps = 100
		var ly = y
		var line = []
		
		
		for(var i = 0; i < steps; i++){
			var x = i /( steps-1)
			var y = track.compute(x)
			line.push(vec2(x,y));
		}
		
		
		for(var i = 0;i<steps;i++){
			var l1 = i>0?line[i-1]:line[i]; 
			var l2 = line[i];
			var l3 =i<(steps-1)?line[i + 1]:line[i ];
			
			var d1 = vec2.normalize(vec2.sub(l1,l2));
			//var d2 = vec2.normalize(vec2.sub(l2,l3));
			
		//	var dn = vec2.normalize(vec2.add(d1,d2));
			var d3 = vec2.ortho(d1);
		//	console.log(d3,dn);
			
			strip.pushStrip(l1[0], l1[1], d3[0], d3[1],-0.5,l1[0], l1[1], d3[0], d3[1],0.5)			
			strip.pushStrip(l2[0], l2[1], d3[0], d3[1],-0.5,l2[0], l2[1], d3[0], d3[1],0.5)
		}
	}
})