// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class('./sprite_gl', function(require, exports, self){	
	var GLText = require('$gl/gltext')
	var glfontParser = require('$gl/glfontparser')

	// the string to display.
	this.attribute('text', {type:String, value: "HELLO" })
	
	// size of the font in pixels
	this.attribute('fontsize', {type:float, value: 18});
	
	// name of the font.
	this.attribute('font', {type:Object, value: undefined});
	
	this.attribute('color', {type:vec4, value: vec4(1,1,1,1)});
	this.attribute('multiline', {type:Boolean, value: false })
	
	// alignment of the bodytext. 
	// accepted values are "left", "right", "justify" and "center" 
		this.attribute("align", {type: String,  value: "left"});

	
	define.class(this, 'fg', GLText, function(){
	})

	//this.fg.dump =1 
	this.text = function(){
		this.dirty = true;
	}

	this.init = function(){
		if(this.font) this.font = glfontParser(this.font)
	}

	this.lazyInit = function(maxwidth){
		if(this.rendered_text !== this.text || this.lastmaxwidth !== maxwidth || this.align != this.lastalign){
			this.rendered_text = this.text
			this.lastmaxwidth = maxwidth;
			this.lastalign = this.align;
			
			var textbuf = this.fg_shader.newText()

			if(this.font) textbuf.font = this.font

			textbuf.font_size = this.fontsize;
			textbuf.add_y = textbuf.line_height;
			textbuf.fgcolor = this.color
			textbuf.align = this.align;
			textbuf.start_y = textbuf.line_height
			textbuf.clear()
			if (this.multiline){
				textbuf.addWithinWidth(this.text, maxwidth? maxwidth: this.layout.width);
			}
			else{
				textbuf.add(this.text)
			}
			//this.fg.textcolor = this.color;
			this.fg_shader.mesh = textbuf
		}
	}

	this.sizetocontent = function(width){
		this.lazyInit(width)
		return {width: this.fg_shader.mesh.bound_w, height: this.fg_shader.mesh.bound_h};
	}

	this.atDraw = function(renderstate){
		this.fg_shader.viewmatrix = renderstate.viewmatrix;
		this.lazyInit()
	}
})