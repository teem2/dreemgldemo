// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class('./sprite_gl', function(require, exports, self){	
	var GLText = require('$gl/gltext')
	var GLShader = require('$gl/glshader')
	var GLCursor = require('$gl/glcursor')
	var GLMarker = require('$gl/glmarker')

	// lets require the keyhandling from edit
	this.mixin(require('$edit/editorimpl'))

	this.attribute('text', {type:String, value: "HELLO" })
	this.attribute('fontsize', {type:float, value: 18});
	this.attribute('color', {type:vec4, value: vec4(1,1,1,1)});

	exports.nest('Fg', GLText.extend(function(exports, self){}))
	exports.nest('Cursor', GLCursor.extend(function(exports, self){}))
	exports.nest('Markers', GLMarker.extend(function(exports, self){}))

	this.bg.color = 'vec4(0.6)'
	this.text = function(){
		this.dirty = true;
	}

	this.clearMarkers = function(){
		this.markers.mesh.length = 0
	}

	this.clearCursors = function(){
		this.cursor.mesh.length = 0
	}

	this.addMarkers = function(start, end){
		var markers = this.markers.markergeom.getMarkersFromText(this.textbuf, start, end, 0)
		// lets add all markers
		for(var i = 0;i<markers.length;i++){
			this.markers.mesh.addMarker(markers[i-1], markers[i], markers[i+1], this.textbuf.font_size, 0)
		}
	}

	this.addCursor = function(start){
		// lets add a cursor
		// console.log(1)
		// lets get the geometry of the cursor
		this.cursor.mesh.addCursor(this.textbuf, start)
		this.screen.device.redraw()
	}

	this.init = function(){

		this.textbuf = this.fg.newText()
		this.textbuf.font_size = this.fontsize;
		this.textbuf.fgcolor = vec4('white')
		this.textbuf.start_y = this.fontsize
		this.textbuf.clear()
		this.textbuf.add(this.text)

		//console.log(this.textbuf.charCoords(0))
		this.fg.mesh = this.textbuf

		//this.fg.color = "";
		this.cursor.mesh = this.cursor.cursorgeom.array()

		//this.fg.color = "";
		this.markers.mesh = this.markers.markergeom.array()

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
		this.bg.width = this.textbuf.text_w
		this.bg.height = this.textbuf.text_h
		this.bg.draw(this.screen.device)
		
		this.markers._matrix = this.bg._matrix
		this.markers.draw(this.screen.device)

		this.cursor._matrix = this.bg._matrix
		this.cursor.draw(this.screen.device)

		this.fg.draw(this.screen.device)
	}

	this.doDrawGuid = function(renderstate){
		this.bg.width = this.textbuf.text_w
		this.bg.height = this.textbuf.text_h
		this.bg.drawGuid(this.screen.device)
	}

})