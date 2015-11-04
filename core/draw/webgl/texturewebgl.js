// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(exports){
	var Texture = exports

	this.atConstructor = function(type, w, h){
		this.type = type
		this.size = vec2(w, h)
	}

	this.ratio = 1
	this.frame_buf = null

	exports.fromType = function(type){
		return new Texture(type,0,0)
	}

	exports.fromGLTexture = function(type, gltex, width, height, fb){
		var tex = new Texture(type, width, height)
		tex.frame_buf = fb
		tex.AL_IL_SC_TC = tex.gltex = gltex
		return tex
	}
	
	exports.fromImage = function(img){
		var tex = new Texture('rgba', img.width, img.height)
		tex.image = img
		return tex
	}

	exports.fromArray = function(array, w, h){
		var tex = new Texture('rgba', w, h)
		tex.array = array
		return tex
	}

	var buf_list = [
		'rgb',
		'rgba',
		'luminance',
		'alpha',
		'alpha_luminance',
		'luminance_alpha'
	]
	var bpp_list = [
		'',
		'_half_float',
		'_float',
		'_half_float_linear',
		'_float_linear'
	]
	var attach_list = [
		'',
		'_depth',
		'_stencil',
		'_stencil_depth',
		'_depth_stencil'
	]
	var num_list = [
		'',
		'_flipped',
		'_shared'
	]

	this.size = vec2(0, 0)

	// well lets do it like this.
	this.sample2 = function(x, y){ return sample(vec2(x, y)) }
	this.sample = function(v){
		return texture2D(this, v, {
			MIN_FILTER: 'LINEAR',
			MAG_FILTER: 'LINEAR',
			WRAP_S: 'CLAMP_TO_EDGE',
			WRAP_T: 'CLAMP_TO_EDGE'
		})
	}

	this.flipped2 = function(x,y){ return flipped(vec2(x,y)) }
	this.flipped = function(v){
		return texture2D(this, vec2(v.x, 1. - v.y), {
			MIN_FILTER: 'LINEAR',
			MAG_FILTER: 'LINEAR',
			WRAP_S: 'CLAMP_TO_EDGE',
			WRAP_T: 'CLAMP_TO_EDGE'
		})
	}

	this.point2 = function(x, y){ return point(vec2(x, y)) }
	this.point = function(v){
		return texture2D(this, vec2(v.x, v.y), {
			MIN_FILTER: 'NEAREST',
			MAG_FILTER: 'NEAREST',
			WRAP_S: 'CLAMP_TO_EDGE',
			WRAP_T: 'CLAMP_TO_EDGE'
		})
	}

	this.point_flipped2 = function(x, y){ return point_flipped(vec2(x, y)) }
	this.point_flipped = function(v){
		return texture2D(this, vec2(v.x, 1. - v.y), {
			MIN_FILTER: 'NEAREST',
			MAG_FILTER: 'NEAREST',
			WRAP_S: 'CLAMP_TO_EDGE',
			WRAP_T: 'CLAMP_TO_EDGE'
		})
	}

	this.createGLTexture = function(gl, texid, texinfo){
		var samplerid = texinfo.samplerid

		if(this.image && this.image[samplerid]){
			this[samplerid] = this.image[samplerid]
		}

		if(this[samplerid]){
			var gltex = this[samplerid]
			gl.activeTexture(gl.TEXTURE0 + texid)
			gl.bindTexture(gl.TEXTURE_2D, gltex)
			return gltex
		}

		var samplerdef = texinfo.samplerdef
		var gltex = gl.createTexture()
		gl.activeTexture(gl.TEXTURE0 + texid)
		gl.bindTexture(gl.TEXTURE_2D, gltex)
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, samplerdef.UNPACK_FLIP_Y_WEBGL || false)
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, samplerdef.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)

		if(this.array){
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.size[0], this.size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(this.array))
		}
		else if(this.image){
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
			this.image[samplerid] = gltex
		}
		else{
			return undefined
		}
		
		gltex.updateid = this.updateid
		// set up sampler parameters
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[samplerdef.MIN_FILTER])
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[samplerdef.MAG_FILTER])

		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[samplerdef.WRAP_S])
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[samplerdef.WRAP_T])

		this[samplerid] = gltex
		return gltex
	}

	this.updateGLTexture = function(gl, gltex){
		if(this.array){
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.size[0], this.size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(this.data)) 
		}
		else if(this.image){
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
		}
		gltex.updateid = this.updateid
	}

})