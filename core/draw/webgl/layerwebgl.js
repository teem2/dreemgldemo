// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class('../layer', function(require, baseclass){
	// drawing

	var Texture = require("./texturewebgl")
	
	this.atConstructor = function(gldevice, view){
		baseclass.prototype.atConstructor.call(this)
		this.device = gldevice
		this.view = view
		this.texturesize = {w:0, h:0}
	}
	
	this.atDestroy = function(){
		this.releaseTexture()
	}
	
	this.allocateTexture = function(width, height){
		if (this.texturesize.w < width || this.texturesize.h < height){
			this.texturesize = {w:width, h:height}
			
			this.texture = this.device.allocRenderTarget(width, height)
			this.dirty = true
		}
	}
	
	this.releaseTexture = function(){
		if (this.texture){
			this.device.disposeRenderTarget(this.texture)
			this.texture = undefined
		}
	}
	
	this.addToDrawList = function(view, matrix){
		matrix = matrix? matrix: mat4.identity()
		
		view.draw_matrix = mat4.mul_mat4(view.layout_matrix, matrix)
		
		this.draw_list.push(view)
		
		if (!view.layer){
			var children = view.children
			for(var i = 0; i < children.length; i++){
				this.addToDrawList(children[i], view.draw_matrix)
			}
		}
		else{
			this.draw_list.push(view.layer)
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

	// called AFTER layout engine is done.
	this.flatten = function(){
	
		var children = this.view.children
		this.draw_list = []
		
		this.addToDrawList(this.view)
		for(var i = 0; i < children.length; i++){
			this.addToDrawList(children[i])
		}

		this.orderDrawList()
	}
	
	this.prepareDrawing = function(){
		if (this.layoutdirty){
			this.performLayout()
		}
		this.allocateTexture(this.layout_width, this.layout_height)
		this.flatten()
	}

	this.drawInside = function(){
		if (this.texture) this.texture.bindAsRenderTarget()
		var dl = this.draw_list
		for(var i = 0; i < dl.length; i++){
			dl[i].draw()
		}
		if (this.texture) this.texture.unbindAsRenderTarget()
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