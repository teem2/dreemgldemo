// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class('./sprite_gl', function(require, exports, self){	
	var GLText = require('$gl/gltext')
	var GLShader = require('$gl/glshader')
	// lets require the keyhandling from edit
	this.mixin(require('$edit/editorimpl'))

	this.attribute('text', {type:String, value: "HELLO" })
	this.attribute('fontsize', {type:float, value: 18});
	this.attribute('color', {type:vec4, value: vec4(1,1,1,1)});
	
	exports.nest('Fg', GLText.extend(function(exports, self){}))

	exports.nest('Cursor', GLShader.extend(function(exports, self){

		this.mesh = vec2.array()
		this.matrix = mat4
		this.position = function(){
			return mesh.xy * matrix
		}

		this.color = function(){
			var rel = mesh.xy//cursor_pos
			var dpdx = dFdx(rel)
			var dpdy = dFdy(rel)
			var edge = min(length(vec2(length(dpdx), length(dpdy))) * SQRT_1_2, 1.)
			if(edge > 0.04){
				if(rel.x < dpdx.x) return 'white'
				return vec4(0.)
			}
			return vec4('white', smoothstep(edge,-edge, shape.box(rel, 0,0,0.1,1.)))
		}
	}))

	this.bg.color = 'vec4(0.6)'
	this.text = function(){
		this.dirty = true;
	}

	this.atDraw = function(){
		if(this.rendered_text !== this.text){
			this.rendered_text = this.text
			var textbuf = this.fg.newText()
			textbuf.font_size = this.fontsize;
			textbuf.fgcolor = vec4('white')
			textbuf.shift_y = this.fontsize
			textbuf.add(this.text)
			//this.fg.color = "";
			//this.fg.color = "'red'"
			this.fg.mesh = textbuf
			console.log(this.fg.mesh)
		}
	}

	this.doDraw = function(){
		this.bg.draw()
		this.cursor.draw()
		this.fg.draw()
	}
})