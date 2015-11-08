// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class('../layer', function(require, baseclass){
	// drawing

	var Texture = require("./texturewebgl")
	var FlexLayout = require('$lib/layout')
	
	this.atConstructor = function(gldevice, view){
		baseclass.prototype.atConstructor.call(this)
		this.device = gldevice
		this.view = view
		view.layer = this
		// lets do the flatten
		this.draw_list = []
		this.addToDrawList(this.view, true)
		this.viewprojection_matrix = mat4.identity()
	}
	
	this.atDestroy = function(){
		this.releaseTexture()
	}

	// lets draw!
	this.draw = function(){
		// gotta draw!
	}
		
	this.allocateTexture = function(width, height){
		if (this.texture_w < width || this.texture_h < height){
			this.texture_w = width, this.texture_h = height
			this.color_target = this.device.allocRenderTarget(width, height)
			this.guid_target = this.device.allocRenderTarget(width, height)
		}
	}
	
	this.releaseTexture = function(){
		if (this.pixels){
			this.device.disposeRenderTarget(this.color_target)
			this.device.disposeRenderTarget(this.guid_target)
			this.pixels = undefined
			this.guid = undefined
		}
	}
	
	this.addToDrawList = function(view, isroot){
		//matrix = matrix? matrix: mat4.identity()
		//view.draw_matrix = mat4.mul_mat4(view.layout_matrix, matrix)
		this.draw_list.push(view)
		if(isroot || !view._mode){
			var children = view.children
			for(var i = 0; i < children.length; i++){
				this.addToDrawList(children[i])
			}
		}
	}
	
	this.orderDrawList = function(){
		var zfunc = function(view){
			var res = 0
			// res = view.z
			if (view.transparent){
			// res = FARPLANE * 2 - res;
			}
			return res
		}
		
		for (var i = 0; i < this.draw_list.length; i++){
			var dl = this.draw_list[i]
			dl.zorder = zfunc(v)
		}
		
		this.draw_list.sort(function(a,b){return a.zorder < b.zorder})
	}

	this.nextPowerTwo = function(value){
		var v = value - 1
		v 
		v |= v >> 1
		v |= v >> 2
		v |= v >> 4
		v |= v >> 8
		v |= v >> 16
		return v + 1
	}

	this.draw = function(root, shaderpass){
		var view = this.view
		var device = this.device
		var layout = view.layout

		// lets see if we need to allocate our framebuffer..
		if(!root){
			var main_ratio = device.main_frame.ratio
			var twidth = layout.width * main_ratio, theight = layout.height * main_ratio
			//var twidth = this.nextPowerTwo(layout.width* main_ratio), theight = this.nextPowerTwo(layout.height* main_ratio)
			if(!this.texture){
				this.texture = this.device.Texture.createRenderTarget(this.device, twidth, theight)
			} 
			else{
				var tsize = this.texture.size
				if(twidth > tsize[0] || theight > tsize[1]){
					this.texture.resize(twidth, theight)
				}
			}
		}

		if (this.texture) this.device.bindFramebuffer(this.texture)
		else this.device.bindFramebuffer()

		device.clear(view._clearcolor)

		// 2d/3d switch
		if(view._mode === '2D'){
			mat4.ortho(0, layout.width, 0, layout.height, -100, 100, this.viewprojection_matrix)
		}
		else if(view._mode === '3D'){

		}

		// each view has a reference to its layer
		var dl = this.draw_list
		for(var i = 0; i < dl.length; i++){
			var draw = dl[i]
			draw.viewmatrix = this.viewprojection_matrix
			if(draw._mode && draw.layer !== this && draw.layer.texture){
				// lets render the view as a layer
				var blendshader = draw.blendshader
				blendshader.texture = draw.layer.texture
				blendshader._size = vec2(draw.layout.width, draw.layout.height)
				blendshader.drawArrays(this.device)
			}
			else{
				draw.update()
				// alright lets iterate the shaders and call em
				var shaders =  draw.shader_list
				for(var j = 0; j < shaders.length; j++){
					// lets draw em
					var shader = shaders[j]
					shader.drawArrays(this.device, shaderpass)
				}
			}
		}
	}
	
	this.drawOutside = function(){
	}
})