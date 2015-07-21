// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class('./sprite_gl', function(require, exports, self){	
	var GLText = require('$gl/gltext')
	
	self.attribute('text', {type:String, value: "HELLO" })
	self.attribute('fontsize', {type:float, value: 18});
	self.attribute('color', {type:vec4, value: vec4(1,1,1,1)});
	
	exports.nest('Fg', GLText.extend(function(exports, self){}))
	
	self.text = function(){
		this.dirty = true;
	}

	self.atDraw = function(){
		if(this.rendered_text !== this.text){
			this.rendered_text = this.text
			var textbuf = this.fg.newText()
			textbuf.font_size = this.fontsize;
			textbuf.fgcolor = this.color
			textbuf.add(this.text)
			//this.fg.textcolor = this.color;
			this.fg.mesh = textbuf
		}
	}
})