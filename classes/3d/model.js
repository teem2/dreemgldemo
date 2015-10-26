// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(require, shape3d, text, view, icon){
	if(define.$environment === 'nodejs') return

	var GLShader = require('$gl/glshader')
	var GLTexture = require('$gl/gltexture')
	var GLGeom= require('$gl/glgeom')
	var GLMat = require('$gl/glmaterial')

	this.attribute("model",{});
	
	
	this.model = function(data){
		console.log(data);
	}
	
	this.init = function(){
		//this.bg_shader.addModel(this.file, function(){ this.setDirty()}.bind(this));
	}

	this.mouseover  = function(){
		console.log("mouse over geometry!", this.interfaceguid);
		this.bg_shader.diffusecolor = vec4("#ff0000");
		this.setDirty();
	}
	
	this.mouseout = function(){
		console.log("mouse out geometry!", this.interfaceguid);
		this.bg_shader.diffusecolor = vec4("#ffffff");
		this.setDirty();
	}
})
