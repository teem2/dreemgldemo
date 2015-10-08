// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function codeviewer(require, text){

	// Display a function as syntax highlighted code.
	
	// The code to display
	this.attribute("code", {type:String, value:""})
	
	var codeviewer = this.constructor
	
	// Basic usage
	define.example(this, function Usage(){
		return [codeviewer({bgcolor:"#000040", padding:vec4(14), code: "console.log(\"Hello world!\");"})]
	})
	
	var GLTextCode = require('$gl/gltextcode')	

	var Parser = require('$parsers/onejsparser')
	this.font = require('$fonts/code_font1_ascii.glf')
	//this.bg = {color:undefined}
	this.fontsize = 14
	// syntax highlighting shader
	this.fg = function(){
		for(var key in GLTextCode.types){
			this[key] = String(GLTextCode.types[key])
		}

		this.paint = function(p, dpdx, dpdy, edge){
			//var edge = min(length(dpx))
			var unicode = int(mesh.tag.x)
			var selected = mesh.tag.w

			if(unicode == 10){
				return vec4(0)
			}

			if(unicode == 32){
				if(selected < 0.){
					var w = .3
					var h = .13
					var field = shape.box(p, .5 - .5 * w, .5 - .5 * h, w, h)
					return vec4("#AF8F7E".rgb, smoothstep(.75 * edge, -.75 * edge, field))
				}
				return vec4(0)
			}

			if(unicode == 9){ // the screen aligned tab dots
				// make a nice tab line
				//var out = vec4(0)
				if(edge > 0.01){ // pixel drawing
				//	var py = .5 * device.h - pixel vertex.y * floor(device.h * .5) 
				//	if(p.x > 1. * abs(dpdx.x) && p.x <= 2. * abs(dpdx.x) && mod(py,2.) > 1.) return vec4("#445", 1.)
				}
				else{ // switch to vector drawing
					var w = .01
					var h = .02
					var field = shape.box(mod(p,vec2(1.,.05)),.5*w,0,w,h)
					var col = vec4("#667".rgb, smoothstep(edge,-edge,field))
					if(col.a>0.01)return col
				}

				if(selected < 0.){
					if(edge > 0.02){
						if(p.x > 3. * dpdx.x && p.y >= .5 - .5 * dpdy.y && p.y <= .5 + .5 * dpdy.y)
							return vec4("#AF8F7E".rgb,1.)
						return vec4(0)
					}
					var sz = .01
					var field = shape.line(p, 0., .5-sz, 1., .5-sz, 2.*sz)
					return vec4("#AF8F7E".rgb, smoothstep(edge,-edge,field))
				}
				return vec4(0)
			}
			return vec4(-1.)
		}

		this.style = function(pos){
			var group = mesh.tag.y
			var type = int(mesh.tag.z / 65536.)
			var sub = int(mod(mesh.tag.z / 256., 256.))
			var part = int(mod(mesh.tag.z, 256.))
			var unicode = int(mesh.tag.x)
			if(unicode == 10 || unicode == 32 || unicode == 9) discard
			if(sub == _Paren || sub == _Brace || sub == _Bracket){
				if(sub == _Paren){
					fgcolor = "white"
				}
				else if(sub == _Bracket){
					fgcolor = "#ccc"
				}
				else{
					fgcolor = "white"
				}
			}
			else if(sub == _Operator){
				fgcolor = "#ff9d00"
			}
			else if(type == _Id){
				fgcolor = "white"
				if(sub == _Color){
					fgcolor = "pink"
				}
			}
			else if(type == _Value){
				if(sub == _String)
					fgcolor = "#0f0"
				else
					fgcolor = "aero"
			}
			else if(type == _Comment){
				fgcolor = "#777"
			}
			else if(type == _This){
				fgcolor = "#ff7fe1"
			}else{
				fgcolor = "#ff9d00"
			}
		}
	}

	this.text = "HELLO"

	this.code = codeviewer

	this.lazyInit = function(width){
		if(this.code !== this.printedcode){
			this.printedcode = this.code
			var ast = Parser.parse(this.code.toString())
			var textbuf = this.fg_shader.newText()

			if(this.font) textbuf.font = this.font
			textbuf.font_size = this.fontsize;
			textbuf.add_y = textbuf.line_height;
			textbuf.fgcolor = this.color
			textbuf.align = this.align;
			textbuf.start_y = textbuf.line_height
			textbuf.boldness = 0.5
			textbuf.clear()

			GLTextCode.walk(ast, textbuf)

			//textbuf.add("HELLO WORLD")

			this.fg_shader.mesh = textbuf

		}
	}	
})