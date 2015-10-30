// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(require, shape3d, text, view, icon){
	if(define.$environment === 'nodejs') return

	var GLShader = require('$gl/glshader')
	var GLTexture = require('$gl/gltexture')
	var GLGeom= require('$gl/glgeom')
	var GLMat = require('$gl/glmaterial')

	
	this.attribute("dimension", {type:vec3, value:vec3(1)});

	
	this.init = function(){
		this.bg_shader.addBox(this.dimension[0], this.dimension[1], this.dimension[2]);
	}
	
	this.mouseover  = function(){
		console.log("mouse over geometry!", this.interfaceguid);
	}
	
	this.mouseout = function(){
		console.log("mouse out geometry!", this.interfaceguid);
	}
	
	this.t = 0;

	
})