// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(require, sprite, text, view, icon){
	
	var GLShader = require('$gl/glshader')
	var GLTexture = require('$gl/gltexture')
	var GLText = require('$gl/gltext')
	var GLGeom= require('$gl/glgeom')
	
	this.t = 0;
	
	this.atDraw = function(){

		if (this.screen && this.screen.node_timers) {
			this.screen.node_timers.push(this)
			this.screen.node_timers.push(this.parent)
		}
		this.t++;
		
		var lookat = mat4.lookAt(vec3(0,0,-10), vec3(0,0,0), vec3(0,1,0));
		
		this.bg_shader.lookat = lookat;
		//console.log(lookat);
		
		this.bg_shader.modelmatrix =  mat4.rotateX(mat4.rotateY(mat4.identity(), this.t*0.02),this.t*0.0210);
	}
	
	define.class(this, 'bg', GLShader, function(){
	
		this.vertexstruct = define.struct({
			pos: vec3,
			norm: vec3,
			uv: vec2
		})
	
		this.texture = new GLTexture()
		this.mesh = this.vertexstruct.array();
		this.useguid = 1;
		
		GLGeom.createCube(1,1,1,function(triidx,v1,v2,v3,n1,n2,n3,t1,t2,t3,faceidx){
			this.mesh.push(v1,n1,t1);
			this.mesh.push(v2,n2,t2);
			this.mesh.push(v3,n3,t3);
		}.bind(this))
				
		console.log(this.mesh);
		
		this.matrix = mat4.identity()
		this.modelmatrix = mat4.rotateX(mat4.rotateY(mat4.identity(), 0.2),1);
		this.projection = mat4.perspective(45, 1, 0.1, 1000);				
		this.lookat = mat4.identity();
		
		this.viewmatrix = mat4.identity();				
		
		this.position = function() {	
			var temp = (vec4(mesh.norm, 1.0) * modelmatrix) ;
			transnorm = normalize(temp.xyz);
			return vec4(mesh.pos, 1) * (modelmatrix * lookat * projection   )  // * matrix *viewmatrix
		}
		
		this.color = function(){
			//return vec4("yellow") ;
			var l = dot(transnorm.xyz,vec3(0.0,0.0,-1.0)) 
			if (l<0.0) discard;
			
			l += 0.2;
			return vec4(l,l,l,1.0);		
			
		}
	})		
})
