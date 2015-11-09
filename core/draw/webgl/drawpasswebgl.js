// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(require, baseclass){
	// drawing

	var Texture = require("./texturewebgl")
	var FlexLayout = require('$lib/layout')
	
	this.atConstructor = function(gldevice, view){
		this.device = gldevice
		this.view = view
		view.layer = this
		// lets do the flatten
		this.draw_list = []
		this.addToDrawList(this.view, true)
		this.viewmatrix = mat4.identity()
	}
	
	this.atDestroy = function(){
		this.releaseTexture()
	}
		
	this.addToDrawList = function(view, isroot){
		//matrix = matrix? matrix: mat4.identity()
		//view.draw_matrix = mat4.mul_mat4(view.layout_matrix, matrix)
		this.draw_list.push(view)

		if(this.draw_list.length > 65535) throw new Error("Too many items in a drawpass, ID space out of range, you get a piece of pie.")
		if(isroot || !view._mode){
			var children = view.children
			for(var i = 0; i < children.length; i++){
				this.addToDrawList(children[i])
			}
		}
	}
	/*
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
	*/

	this.allocDrawTarget = function(width, height, drawtarget){
		//var twidth = this.nextPowerTwo(layout.width* main_ratio), theight = this.nextPowerTwo(layout.height* main_ratio)
		if(!this[drawtarget]){
			this[drawtarget] = this.device.Texture.createRenderTarget(this.device, width, height, this.view._mode === '2D'?'rgba':'rgba_depth_stencil')
		} 
		else{
			var tsize = this[drawtarget].size
			if(width > tsize[0] || height > tsize[1]) this[drawtarget].resize(width, height)
		}
	}

	this.drawPick = function(isroot, passid, mousex, mousey, debug){
		var view = this.view
		var device = this.device
		var layout = view.layout

		if(!layout || layout.width === 0 || isNaN(layout.width) || layout.height === 0 || isNaN(layout.height)) return

		if(isroot){
			if(!debug) this.allocDrawTarget(4, 4, 'pick_buffer')
		}
		else{
			var main_ratio = device.main_frame.ratio, twidth = layout.width * main_ratio, theight = layout.height * main_ratio
			this.allocDrawTarget(twidth, theight, 'pick_buffer')
		}

		device.bindFramebuffer(this.pick_buffer)

		device.clear(0,0,0,0)

		 // 2d/3d switch
		if(view._mode === '2D'){
			if(isroot && !debug)
				mat4.ortho(mousex, 4 + mousex, mousey, 4 + mousey, -100, 100, this.viewmatrix)
			else
				mat4.ortho(0, layout.width, 0, layout.height, -100, 100, this.viewmatrix)

		}
		else if(view._mode === '3D'){

		}

		var pick = vec3()
		pick[0] = (((passid+1)*131)%256)/255
		// modulo inverse: http://www.wolframalpha.com/input/?i=multiplicative+inverse+of+31+mod+256
		for(var dl = this.draw_list, i = 0; i < dl.length; i++){
			var id = ((i+1)*29401)%65536
			pick[1] = (id&255)/255
			pick[2] = (id>>8)/255

			var draw = dl[i]
			draw.viewmatrix = this.viewmatrix
			if(draw._mode && draw.layer !== this && draw.layer.pick_buffer){
				// ok so the pick pass needs the alpha from the color buffer
				// and then hard forward the color
				var blendshader = draw.blendshader
				blendshader.texture = draw.layer.pick_buffer
				blendshader._width = draw.layout.width
				blendshader._height = draw.layout.height
				blendshader.drawArrays(this.device)
			}
			else{
				draw.update()
				// alright lets iterate the shaders and call em
				var shaders =  draw.shader_list
				for(var j = 0; j < shaders.length; j++){
					// lets draw em
					var shader = shaders[j]
					// we have to set our guid.
					shader.pick = pick
					shader.drawArrays(this.device, 'pick')
				}
			}
		}
	}

	this.drawColor = function(isroot){
		var view = this.view
		var device = this.device
		var layout = view.layout

		if(!layout || layout.width === 0 || isNaN(layout.width) || layout.height === 0 || isNaN(layout.height)) return

		// lets see if we need to allocate our framebuffer..
		if(!isroot){
			var main_ratio = device.main_frame.ratio, twidth = layout.width * main_ratio, theight = layout.height * main_ratio
			this.allocDrawTarget(twidth, theight, 'color_buffer')
		}

		this.device.bindFramebuffer(this.color_buffer)

		if(layout.width === 0 || layout.height === 0) return

		device.clear(view._clearcolor)
		// 2d/3d switch
		if(view._mode === '2D'){
			if (isroot){
				mat4.ortho(0, layout.width, 0, layout.height, -100, 100, this.viewmatrix)
			}
			else{
				mat4.ortho(0, layout.width, layout.height, 0, 100, -100, this.viewmatrix)
			}
		}
		else if(view._mode === '3D'){

		}

		// each view has a reference to its layer
		for(var dl = this.draw_list, i = 0; i < dl.length; i++){
			var draw = dl[i]
			draw.viewmatrix = this.viewmatrix
			if(draw._mode && draw.layer !== this && draw.layer.color_buffer){
				// ok so when we are drawing a pick pass, we just need to 1 on 1 forward the color data
				// lets render the view as a layer
				var blendshader = draw.blendshader
				blendshader.texture = draw.layer.color_buffer
				blendshader.width = draw.layout.width
				blendshader.height = draw.layout.height
				blendshader.drawArrays(this.device)
			}
			else{
				draw.update()
				// alright lets iterate the shaders and call em
				var shaders =  draw.shader_list
				for(var j = 0; j < shaders.length; j++){
					// lets draw em
					var shader = shaders[j]
					// we have to set our guid.
					shader.drawArrays(this.device)
				}
			}
		}
	}
})