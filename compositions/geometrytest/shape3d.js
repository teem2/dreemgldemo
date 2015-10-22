// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(require, view, text, icon){
	if(define.$environment === 'nodejs') return

	var GLShader = require('$gl/glshader')
	var GLTexture = require('$gl/gltexture')
	var GLGeom= require('$gl/glgeom')
	var GLMat = require('$gl/glmaterial')
	
	
	this.attribute("pos3d", {type:vec3, value:vec3(0,0,0)});
	this.attribute("scale3d", {type:vec3, value:vec3(2)});
	this.attribute("rot3d", {type:vec3, value:vec3(0.)});
	this.attribute("anchor", {type:vec3, value:vec3(0.)});
	
	
	this.anchor = this.pos3d = this.scale3d = this.rot3d = function(){
		this.setDirty();
	}
	
	this.atDraw = function(renderstate){		
		var mat =mat4.TSRT2(this.anchor, this.scale3d, this.rot3d, this.pos3d);

		var normalmat = mat3.transpose(mat3.normalFromMat4(mat4.transpose(mat)));

		this.bg_shader.modelmatrix =  mat;
		this.bg_shader.normalmatrix =  normalmat;
//		this.bg_shader.projectionmatrix = renderstate.projectionmatrix;
		this.bg_shader.lookatmatrix = renderstate.lookatmatrix;
		this.bg_shader.cameraposition = renderstate.cameraposition;
	//	this.bg_shader.adjustmatrix1 = renderstate.adjustmatrix1;
		//this.bg_shader.adjustmatrix2 = renderstate.adjustmatrix2;
		this.bg_shader.flattenmatrix = renderstate.flattenmatrix;
		var adjust = mat4.identity();;
		
			//adjust[3] = 300;
		this.bg_shader.scaler = renderstate.adjustmatrix;
		
		
	}
	
	this.init = function(){
		this.bg_shader.mesh = this.bg_shader.vertexstruct.array();
//		this.bg_shader.buildGeometry();
	}
	
	define.class(this, 'bg', GLShader, function(){
		
		this.attribute("shape", {type: String, value: "cube"} );
		
		this.depth_test = 'src_depth < dst_depth';
		
		this.vertexstruct = define.struct({
			pos: vec3,
			norm: vec3,
			uv: vec2
			
		})
	
		this.diffusecolor = vec4("#ffffff");
		this.texture = new GLTexture()
		this.mesh = this.vertexstruct.array();
		this.has_guid = true;
		this.addPlane = function(width, height, xdiv, ydiv){
			GLGeom.createPlane(width,height,xdiv,ydiv,function(triidx,v1,v2,v3,n1,n2,n3,t1,t2,t3,faceidx){
					this.mesh.push(v1,n1,t1);
					this.mesh.push(v2,n2,t2);
					this.mesh.push(v3,n3,t3);
				}.bind(this))
		}
		
		this.addBox = function(width, height, depth){
			if (width === undefined) width = 1;
			if (height === undefined) height = width;
			if (depth === undefined) depth = height;
			
			GLGeom.createCube(width,height,depth,function(triidx,v1,v2,v3,n1,n2,n3,t1,t2,t3,faceidx){
					this.mesh.push(v1,n1,t1);
					this.mesh.push(v2,n2,t2);
					this.mesh.push(v3,n3,t3);
				}.bind(this))
		}
		
		this.addTeapot = function(radius, detail){
			GLGeom.createTeapot(radius, detail, function(triidx,v1,v2,v3,n1,n2,n3,t1,t2,t3,faceidx){
					this.mesh.push(v1,n1,t1);
					this.mesh.push(v2,n2,t2);
					this.mesh.push(v3,n3,t3);
			}.bind(this))
		}
		
		this.addSphere = function(radius, xdetail, ydetail){
			if (radius === undefined) radius = 1;
			if (xdetail === undefined) xdetail = 20;
			if (ydetail === undefined) ydetail = 20;
			console.log(radius, xdetail, ydetail);
			GLGeom.createSphere(radius,xdetail,ydetail,function(triidx,v1,v2,v3,n1,n2,n3,t1,t2,t3,faceidx){
				this.mesh.push(v1,n1,t1);
				this.mesh.push(v2,n2,t2);
				this.mesh.push(v3,n3,t3);
			}.bind(this))		
		}
		
		this.addModel = function(objfile, completioncallback){
						
			require.async(objfile, 'txt').then(function(data){
				GLGeom.createModel(data, function(triidx,v1,v2,v3,n1,n2,n3,t1,t2,t3,faceidx){
					this.mesh.push(v1,n1,t1);
					this.mesh.push(v2,n2,t2);
					this.mesh.push(v3,n3,t3);
				}.bind(this))
				completioncallback();
			}.bind(this));						
		}
				
		
	
		this.texture = require('$textures/matcap6.png');

		this.matrix = mat4.identity()
		this.cameraposition = vec3(0,0,0)
		this.modelmatrix = mat4.identity();;
		this.dimension = vec2(1025,1025);
		this.normalmatrix = mat3.identity();;
		this.lookatmatrix = mat4.identity();;

		this.flattenmatrix = mat4.identity();

		this.viewmatrix = mat4.identity();				
		
		this.position = function() {						
			var temp = (vec3(mesh.norm) * normalmatrix );						
			transnorm = temp.xyz;			
			pos = vec4(mesh.pos, 1) * modelmatrix;
			//pos2 = pos * lookatmatrix;
			return pos * flattenmatrix * matrix * viewmatrix; // * matrix *viewmatrix
		}
				
		this.color = function() {
			//return vec4("yellow") ;			
			var n = noise.s2d(vec2(sin(mesh.uv.x*6.283)*0.215, sin(mesh.uv.y*6.283)));

			var raydir = -normalize( pos.xyz - cameraposition);
			
			var tn = normalize(transnorm.xyz);
			var res = material.matcap(raydir, tn);//texture.sample(material.matcap(tn,raydir));
			
			var r1 = cross(raydir, vec3(1,0,0));
			var r2 = cross(raydir, r1);
			
			return texture.sample(-vec2(dot(tn, r1), dot(tn,r2)) * 0.5 + vec2(0.5)) * diffusecolor;
			return vec4(dot(tn, r1), dot(tn,r2),0,1.);
			return vec4(vec3(0.5+0.5*sin((1-pow(dot(raydir, tn), 1. )) * 20.))  + sin(dot(r1, tn)*10.)*vec3(1,1,0) , 1.0);
			
			
			
			
	//		res.xyz *= 0.1*n + 0.9;
	//		return vec4(res.x *diffusecolor.x, res.y * diffusecolor.y, res.z*diffusecolor.z, 1.0) ;
			
			//return vec4(l,l,l,1.0);		
			
		}
	})		
})
