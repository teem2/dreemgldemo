// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(require, sprite, text, view, icon, teapot){

	// The perspective3d defines a 3d viewport

	var perspective3d = this.constructor;
	var thepot = teapot;
	
	// Basic usage:
	define.example(this, function Usage(teapot){		
		return [
			view({height: 200, clipping:false,alignself:"stretch", alignitems: "stretch" , bgcolor:"green", flex: 1 }, 
				perspective3d({ bgcolor:"green", alignself:"stretch", flex:1,  fov:0.8,camera:vec3(-2,10,2)},
					thepot({})))]
	})
	
	// Field of view in radians. 
	this.attribute("fov", {type:float, value: 1});
	
	// If set to true, the distance from camera to "lookat" point will be normalized to make items at the lookat point facing the camera be exactly 1 unit = 1 pixel.
	this.attribute("camerafixedtofov", {type:Boolean, value: false});
	
	// The point the camera is pointed at
	this.attribute("lookat", {type:vec3, value: vec3(0,0,0)});
	
	// A vector pointing at the direction you want to become "up" 
	this.attribute("up", {type:vec3, value: vec3(0,1,0)});
	
	// The point the camera is located at. If camerafixedtofov is set to true, this attribute is used to determine a direction from lookat instead of an absolute point. 
	this.attribute("camera", {type:vec3, value: vec3(0,1,10)});

	// Near plane distance
	this.attribute("near", {type:float, value: 0.1});
	
	// Far plane distance
	this.attribute("far", {type:float, value: 1000});

	this.camerafixedtofov = function() {
	}
	
	this.fov = function(){
		console.log("fov updated!");
	}
	
	this.lookat = this.up = this.camera = function(){		
		console.log("camera updated");		
	}

	this.UpdateProjectionMatrix = function(){
	}
	
	this.UpdateLookAtMatrix = function(){
		this.lookatmatrix = mat4.lookAt(this.camera, this.lookat, this.up);		
	}
	
	
	this.atDraw = function(renderstate){

		var w = this.layout.width>0? this.layout.width: this.layout.right - this.layout.left;
		var h = this.layout.height>0? this.layout.height: this.layout.bottom - this.layout.top;
		console.log(w,h);
		this.projectionmatrix = mat4.perspective(this.fov, 1, this.near, this.far);										

		renderstate.projectionmatrix = this.projectionmatrix;
		renderstate.lookatmatrix = this.lookatmatrix;
	
		var adjust = mat4.identity();;
		mat4.scale(adjust, vec3(100,100, 1), adjust);
//		adjust = mat4.transpose(mat4.translate(mat4.transpose(adjust), vec3(w/2, h/2, 0)));
		
		renderstate.adjustmatrix1  = adjust;
		
		var adjust2 = mat4.identity();;
		adjust2 = mat4.transpose(mat4.translate(mat4.transpose(adjust2), vec3(w/2, h/2, 0)));
		renderstate.adjustmatrix2  = adjust2;

	
	
	}
	this.init = function() {
		this.threedee = true;		
		this.UpdateProjectionMatrix();
		this.UpdateLookAtMatrix();
	}

})