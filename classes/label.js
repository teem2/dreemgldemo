// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class(function(view, require){	

	var Font = require('$font/fontshader')
	var glfontParser = require('$font/fontparser')

	this.bgcolor = vec4("transparent")

	this.attribute("fgcolor", {type:vec4, value: vec4(1,1,1,1)})
	
	// The string to display.
	this.attribute('text', {type:String, value: "text" })
	
	// Size of the font in pixels
	this.attribute('fontsize', {type:float, value: 18})
	
	// Name of the font.
	this.attribute('typeface', {type:Object, value: undefined})
	
	// Should the text wrap around when its width has been reached?
	this.attribute('multiline', {type:Boolean, value: false })
	
	// Alignment of the bodytext. 
	this.attribute("align", {type: String,  value: "left"})
	
	define.class(this, 'font', Font, function(){

		this.update = function(){
			var view = this.view
			
			var mesh = this.newText()

			if(this.typeface) mesh.typeface = this.typeface

			mesh.fontsize = view.fontsize
			mesh.add_y = mesh.line_height
			mesh.align = view.align
			mesh.start_y = mesh.line_height
			mesh.clear()

			if (this.multiline){
				mesh.addWithinWidth(text, maxwidth? maxwidth: this.layout.width)
			}
			else{
				mesh.add(view.text,0 ,0 ,0)
			}
			this.mesh = mesh
		}
	})

	this.text = function(){
		this.dirty = true
	}

	this.init = function(){
		if(this.typeface) this.typeface = glfontParser(this.typeface)
	}

	this.sizetocontent = function(width){
		this.fontshader.update()
		return {width: this.fontshader.mesh.bound_w, height: this.fontshader.mesh.bound_h};
	}

	this.atDraw = function(renderstate){
		this.fg_shader.viewmatrix = renderstate.viewmatrix;
		this.lazyInit()
	}

	// A label.
	define.example(this, function Usage(){
		return [label({text:"I am a textlabel!", fgcolor:"purple", fontsize: 30 })]
	})
})