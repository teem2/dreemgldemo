// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(require, sprite, text, view, icon){
	if(define.$environment === 'nodejs') return

	var GLShader = require('$gl/glshader')
	var GLTexture = require('$gl/gltexture')
	var GLGeom= require('$gl/glgeom')
	var GLMat = require('$gl/glmaterial')
	
	this.mouseover  = function(){
		console.log("blah");
	}
	
	this.mouseout = function(){
	}
	
	this.t = 0;
	this.atDraw = function(renderstate){
		
		if (this.screen && this.screen.node_timers) {
			this.screen.node_timers.push(this)
			this.screen.node_timers.push(this.parent)
		}
		if(renderstate.drawmode == 0) this.t+=this.interfaceguid*0.1;
		
		//console.log(lookat);
		
		this.bg_shader.modelmatrix =  mat4.rotateX(mat4.rotateY(mat4.identity(), this.t*0.002),this.t*0.0110);
	}
	
	define.class(this, 'bg', GLShader, function(){
		
		this.depth_test = 'src_depth < dst_depth';
		this.vertexstruct = define.struct({
			pos: vec3,
			norm: vec3,
			uv: vec2
		})
	
		this.texture = new GLTexture()
		this.mesh = this.vertexstruct.array();
		this.has_guid = true;
		
		if(false) GLGeom.createCube(100,100,100,function(triidx,v1,v2,v3,n1,n2,n3,t1,t2,t3,faceidx){
			this.mesh.push(v1,n1,t1);
			this.mesh.push(v2,n2,t2);
			this.mesh.push(v3,n3,t3);
		}.bind(this))
				
		if (false) GLGeom.createSphere(50,140,125,function(triidx,v1,v2,v3,n1,n2,n3,t1,t2,t3,faceidx){
			this.mesh.push(v1,n1,t1);
			this.mesh.push(v2,n2,t2);
			this.mesh.push(v3,n3,t3);
		}.bind(this))
		
		if(true) GLGeom.createTeapot(function(triidx,v1,v2,v3,n1,n2,n3,t1,t2,t3,faceidx){
			this.mesh.push(v1,n1,t1);
			this.mesh.push(v2,n2,t2);
			this.mesh.push(v3,n3,t3);
		}.bind(this))
		
		console.log(this.mesh);
		
		this.texture = require('$textures/matcap3.png');
		
		
		this.matrix = mat4.identity()
		this.modelmatrix = mat4.rotateX(mat4.rotateY(mat4.identity(), 0.2),1);
		this.projection = mat4.perspective(45, 1, 0.1, 400);				
		this.lookat = mat4.translate(mat4.lookAt(vec3(0,0,-2), vec3(0,-0,0), vec3(0,1,0)), vec3(0,0,0));
		this.scaler = mat4.identity()
		this.scaler[10] = 1.0;
		this.scaler[5] = 100.0;
		this.scaler[0] = 100.0;
		console.log(this.scaler);
		this.viewmatrix = mat4.identity();				
		
		this.position = function() {	
			
			
			var temp = (vec4(mesh.norm, 1.0) * modelmatrix) ;
			
			transnorm = normalize(temp.xyz);
			
			
			return vec4(mesh.pos, 1) * (modelmatrix * lookat * projection * scaler * matrix * viewmatrix)  // * matrix *viewmatrix
		}
		
		this.color = function(){
			//return vec4("yellow") ;
			
			var n = noise.s2d(vec2(sin(mesh.uv.x*6.283)*0.215, sin(mesh.uv.y*6.283)));
			var tn = normalize(transnorm.xyz);
			var nn =normalize(
			tn
				+ 
					vec3(
						sin(n * PI2 * 3) * 0.03,
						sin(n * PI2 * 5) * 0.03,
						sin(n * PI2 * 4) * 0.03
					)
					
					);
				;
	//		if (dot(nn, vec3(0,0,-1)) <0.0) return vec4(nn,1.0);
//			return vec4(nn*0.5 + vec3(0.5,0.5,0.5),1.0);
			var res = texture.sample(material.matcap(vec3(0,0,-1.0), nn));

			
	//		res.xyz *= 0.1*n + 0.9;
			return res;
			
			//return vec4(l,l,l,1.0);		
			
		}
	})		
})
