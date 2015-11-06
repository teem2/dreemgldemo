// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class('../layer', function(require, baseclass){
	// drawing

	var Texture = require("./texturewebgl")
	
	this.atConstructor = function(gldevice, view){
		baseclass.prototype.atConstructor.call(this)
		this.device = gldevice
		this.view = view
		// lets do the flatten
		this.draw_list = []
		this.addToDrawList(this.view, true)
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
		
		if(isroot || !view.layer){
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


	this.drawInside = function(){
		if(!this.view.dirty) return
		this.view.dirty = false

		if (this.texture) this.device.bindRenderTarget(this.texture)
		var dl = this.draw_list
		for(var i = 0; i < dl.length; i++){
			var drawview = dl[i]
			drawview.update()
			// alright lets iterate the shaders and call em
			var shaders =  drawview.shader_list
			for(var j = 0; j < shaders.length; j++){
				// lets draw em
				var shader = shaders[j]
				shader.drawArrays(this.device)
			}
		}
		if (this.texture) this.device.unbindRenderTarget()
	}
	
	this.drawOutside = function(){
		if (!this.texture){
			this.drawInside()
			return
		}
		
		this.texture.bindAsTexture()
		this.device.drawSomeQuad()
		this.texture.unbindAsTexture()
	}
})