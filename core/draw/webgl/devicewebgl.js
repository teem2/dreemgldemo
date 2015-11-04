// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(require, exports, self){

	var Keyboard = require('./keyboardwebgl')
	var Mouse = require('./mousewebgl')
	var Touch = require('./touchwebgl')

	// require embedded classes	
	this.shader = require('./shaderwebgl')
	this.texture = require('./texturewebgl')
	this.layer = require('./layerwebgl')

	this.frame = 
	this.main_frame = this.texture.fromType('rgb_depth_stencil')
	
	this.preserveDrawingBuffer = true
	this.antialias = false
	
	this.atConstructor = function(){
		this.extensions = {}
		this.shadercache = {}
		
		this.animFrame = function(time){
			this.anim_req = false
			this.atRedraw(time)
		}.bind(this)
	
		if(!this.parent) this.parent = document.body

		this.canvas = document.createElement("canvas")
		this.canvas.className = 'unselectable'
		this.parent.appendChild(this.canvas)
		
		var options = {
			alpha: this.frame.type.indexOf('rgba') != -1,
			depth: this.frame.type.indexOf('depth') != -1,
			stencil: this.frame.type.indexOf('stencil') != -1,
			antialias: this.antialias,
			premultipliedAlpha: this.premultipliedAlpha,
			preserveDrawingBuffer: this.preserveDrawingBuffer,
			preferLowPowerToHighPerformance: this.preferLowPowerToHighPerformance
		}

		this.gl = this.canvas.getContext('webgl', options) || 
			this.canvas.getContext('webgl-experimental', options) || 
			this.canvas.getContext('experimental-webgl', options)

		if(!this.gl){
			console.log(this.canvas)
			console.log("Could not get webGL context!")
		}
		// require derivatives
		this.getExtension('OES_standard_derivatives')

		//canvas.webkitRequestFullscreen()
		var resize = function(){
			var pixelRatio = window.devicePixelRatio
			var w = this.parent.offsetWidth
			var h = this.parent.offsetHeight
			var sw = w * pixelRatio
			var sh = h * pixelRatio
			this.gl.width = this.canvas.width = sw
			this.gl.height = this.canvas.height = sh
			this.canvas.style.width = w + 'px'
			this.canvas.style.height = h + 'px'

			this.gl.viewport(0, 0, sw, sh)
			// store our w/h and pixelratio on our frame
			this.main_frame.ratio = pixelRatio
			this.main_frame.size = vec2(sw, sh) // actual size
			this.size = vec2(w, h)
			this.ratio = this.main_frame.ratio
		}.bind(this)

		window.onresize = function(){
			resize()
			this.atResize()
			this.redraw()
		}.bind(this)

		resize()

		setTimeout(function(){
			this.redraw()
		}.bind(this), 0)

		this.mouse = new Mouse()
		this.keyboard = new Keyboard()
		this.touch = new Touch()
	}

	this.clear = function(r, g, b, a){
		if(arguments.length === 1){
			a = r.length === 4? r[3]: 1, b = r[2], g = r[1], r = r[0]
		}
		if(arguments.length === 3) a = 1
		this.gl.clearColor(r, g, b, a)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT|this.gl.STENCIL_BUFFER_BIT)
	}

	this.getExtension = function(name){
		var ext = this.extensions[name]
		if(ext) return ext
		return this.extensions[name] = this.gl.getExtension(name)
	}

	this.redraw = function(){
		if(this.anim_req) return
		this.anim_req = true
		window.requestAnimationFrame(this.animFrame)
	}

	this.setTargetFramebuffer = function(frame){
		if(!frame) frame = this.main_frame
		this.frame = frame
		this.size = vec2(frame.size[0]/frame.ratio, frame.size[1]/frame.ratio)

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frame.frame_buf)
		this.gl.viewport(0, 0, frame.size[0], frame.size[1])
	}

	this.readPixels = function(x, y, w, h){
		var buf = new Uint8Array(w*this.ratio*h*this.ratio*4);
		this.gl.readPixels(x * this.ratio, y * this.ratio, w * this.ratio, h * this.ratio, this.gl.RGBA, this.gl.UNSIGNED_BYTE, buf);
		return buf
	}

	this.atRedraw = function(time){
		// shall we redraw our scene?
	}

	this.atResize = function(){}
	
	// remote nesting syntax
	this.allocRenderTarget = function(width, height, type){
		
		var gl = this.gl
		
		type = type? type: "rgb_depth_stencil"
			
		var fb = this.frame_buf = gl.createFramebuffer()
		var tex = gl.createTexture()

		// our normal render to texture thing
		gl.bindTexture(gl.TEXTURE_2D, tex)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

		var buf_type = gl.RGB
		if(type.indexOf('luminance') != -1){
			buf_type = gl.LUMINANCE
			if(type.indexOf('alpha') != -1) buf_type = gl.LUMINANCE_ALPHA
		}
		else if(type.indexOf('alpha') != -1) buf_type = gl.ALPHA
		else if(type.indexOf('rgba') != -1) buf_type = gl.RGBA

		var data_type = gl.UNSIGNED_BYTE
		if(type.indexOf('half_float_linear') != -1){
			var ext = gl._getExtension('OES_texture_half_float_linear')
			if(!ext) throw new Error('No OES_texture_half_float_linear')
			data_type = ext.HALF_FLOAT_LINEAR_OES
		}
		else if(type.indexOf('float_linear') != -1){
			var ext = gl._getExtension('OES_texture_float_linear')
			if(!ext) throw new Error('No OES_texture_float_linear')
			data_type = ext.FLOAT_LINEAR_OES
		}
		else if(type.indexOf('half_float') != -1){
			var ext = gl._getExtension('OES_texture_half_float')
			if(!ext) throw new Error('No OES_texture_half_float')
			data_type = ext.HALF_FLOAT_OES
		}
		else if(type.indexOf('float') != -1){
			var ext = gl._getExtension('OES_texture_float')
			if(!ext) throw new Error('No OES_texture_float')
			data_type = gl.FLOAT
		}

		gl.texImage2D(gl.TEXTURE_2D, 0, buf_type, width, height, 0, buf_type, data_type, null)
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)

		var has_depth = type.indexOf('depth') != -1 
		var has_stencil = type.indexOf('stencil') != -1
		if(has_depth || has_stencil){

			if(!this.depth_buf) this.depth_buf = gl.createRenderbuffer()

			var dt = gl.DEPTH_COMPONENT16, at = gl.DEPTH_ATTACHMENT
			if(has_depth && has_stencil) dt = gl.DEPTH_STENCIL, at = gl.DEPTH_STENCIL_ATTACHMENT
			else if(has_stencil) dt = gl.STENCIL_INDEX, at = gl.STENCIL_ATTACHMENT

			gl.bindRenderbuffer(gl.RENDERBUFFER, this.depth_buf)
			gl.renderbufferStorage(gl.RENDERBUFFER, dt, width, height)
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, at, gl.RENDERBUFFER, this.depth_buf)

			gl.bindRenderbuffer(gl.RENDERBUFFER, null)
		}
		gl.bindTexture(gl.TEXTURE_2D, null)
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
		
		return this.texture.fromGLTexture(type, tex, width, height, fb)
	}
	
	this.disposeRenderTarget = function(rendertarget){
	}
})