// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(require, shape3d, text, view, icon){
	if(define.$environment === 'nodejs') return

	var GLShader = require('$gl/glshader')
	var GLTexture = require('$gl/gltexture')
	var GLGeom= require('$gl/glgeom')
	var GLMat = require('$gl/glmaterial')

	
	this.attribute("radius", {type:float, value:1});
	this.attribute("detail", {type:float, value:10});
	
	this.init = function(){
		this.bg_shader.addTeapot(this.radius, this.detail);
	}
	
	this.mouseover  = function(){
		console.log("mouse over geometry!", this.interfaceguid);
	}
	
	this.mouseout = function(){
		console.log("mouse out geometry!", this.interfaceguid);
	}
	
	this.t = 0;

	
})
