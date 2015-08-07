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

		this.matrix = mat4()

		this.position = function(){
			return mesh.pos * matrix
		}

		this.color = function(){
			var rel = mesh.edge//cursor_pos
			var dpdx = dFdx(rel)
			var dpdy = dFdy(rel)
			var edge = min(length(vec2(length(dpdx), length(dpdy))) * SQRT_1_2, 1.)
			if(edge > 0.04){
				if(rel.x < dpdx.x) return 'white'
				return vec4(0.)
			}
			return vec4(vec3(1.), smoothstep(edge, -edge, shape.box(rel, 0,0,0.05,1.)))
		}

		this.cursorgeom = define.struct({
			pos:vec2,
			edge:vec2
		})

		this.mesh = this.cursorgeom.array()
	}))

	this.bg.color = 'vec4(0.6)'
	this.text = function(){
		this.dirty = true;
	}

	this.clearMarkers = function(){
	}

	this.clearCursors = function(){
		this.cursor.mesh.length = 0
	}

	this.addMarkers = function(start, end){

	}

	this.addCursor = function(start){
		// lets add a cursor
		// console.log(1)
		// lets get the geometry of the cursor
		var pos = this.textbuf.cursorRect(start)
		pos.y = 0//this.textbuf.font_size - this.textbuf.font_size * this.textbuf.cursor_sink
		pos.w = this.textbuf.font_size		
		//this.cursor.mesh.length = 0
		this.cursor.mesh.pushQuad(
			pos.x, pos.y, 0, 0, 
			pos.x + pos.w, pos.y, 1, 0,
			pos.x, pos.y + pos.h, 0, 1,
			pos.x + pos.w, pos.y + pos.h, 1, 1
		)

		this.screen.device.redraw()
	}

	this.init = function(){

		this.textbuf = this.fg.newText()
		this.textbuf.font_size = this.fontsize;
		this.textbuf.fgcolor = vec4('white')
		this.textbuf.shift_y = this.fontsize
		this.textbuf.add(this.text)

		//console.log(this.textbuf.charCoords(0))
		this.fg.mesh = this.textbuf

		//this.fg.color = "";
		this.cursor.mesh = this.cursor.cursorgeom.array()

		this.initEditImpl()

		//this.cursors.moveRight()

		this.focus()

		//this.cursors.moveRight()
	}

	this.atDraw = function(){
		if(this.cursors.update) this.cursors.updateCursors()

		if(this.rendered_text !== this.text){
			this.rendered_text = this.text
			//this.fg.color = "'red'"
		}
	}

	this.doDraw = function(){
		//this.bg._matrix = renderstate.matrix
		this.bg.draw(this.screen.device)
		this.cursor._matrix = this.bg._matrix
		this.cursor.draw(this.screen.device)
		this.fg.draw(this.screen.device)
	}
})