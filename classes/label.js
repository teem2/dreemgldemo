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
			var text = view.text
			var align = view.align

			this.lastmaxwidth = maxwidth
			this.lastalign = this.align
			
			var textbuf = this.fontshader.newText()

			if(this.typeface) textbuf.typeface = this.typeface

			textbuf.fontsize = this.fontsize
			textbuf.add_y = textbuf.line_height
			textbuf.align = this.align
			textbuf.start_y = textbuf.line_heigh
			textbuf.clear()

			if (this.multiline){
				textbuf.addWithinWidth(this.text, maxwidth? maxwidth: this.layout.width)
			}
			else{
				textbuf.add(this.text)
			}
			//this.fg.textcolor = this.color;
			this.fg_shader.mesh = textbuf
		}
	})

	this.text = function(){
		this.dirty = true
	}

	this.init = function(){
		if(this.typeface) this.typeface = glfontParser(this.typeface)
	}

	this.sizetocontent = function(width){
		this.lazyInit(width)
		return {width: this.fg_shader.mesh.bound_w, height: this.fg_shader.mesh.bound_h};
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