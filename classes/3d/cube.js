// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite, text, view, icon){
	
	var GLShader = require('$gl/glshader')
	var GLTexture = require('$gl/gltexture')
	var GLText = require('$gl/gltext')
	var GLGeom= require('$gl/glgeom')
	
	define.class(this, 'cubeshader', GLShader, function(){
		this.texture = new GLTexture()
		this.mesh = vec3();
		this.matrix = mat4.identity()
		this.viewmatrix = mat4.identity();				
		this.position = function() {	
			return vec4(mesh.pos, 1) * matrix * viewmatrix
		}
	})
	
	this.bg_shader = new this.cubeshader();	
})
