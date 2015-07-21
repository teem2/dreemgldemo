
// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class('./sprite_base', function (require, exports, self) {

	var GLShader = require('$gl/glshader')
	var GLTexture = require('$gl/gltexture')
	var GLText = require('$gl/gltext')
	var Sprite = self
	self.dump = 1

	exports.interfaceguid = 1

	self.dirty = true

	self.clipping =
	self.bordercolor =
	self.bgcolor =
	self.cornerradius =
	self.borderwidth =
	self.height =
	self.width =
	self.opacity = function(){
		this.setDirty(true)
	}

	self.plaincolor = function(pos, dist){
		return bgcolor
	}

	exports.nest('Bg', GLShader.extend(function(exports, self){
		self.texture = new GLTexture()

		self.mesh = vec2.quad(0, 0, 1, 0, 0, 1, 1, 1)
		self.tex = vec2.quad(0, 0, 1, 0, 0, 1, 1, 1)
	
		self.bgcolor = vec4(1)
		
		self.bordercolor = vec4(0, 0, 0, 0)
		self.borderwidth = 0.0,
		
		self.width = 0.0
		self.radius = vec4(4, 14, 4, 14)
		//self.dump = 1
		self.height = 0
		self.matrix = mat4.identity()
		self.opacity = 0.0;
		self.time = 0.1

		self.bgcolorfn = Sprite.plaincolor 
		self.color = function(){
			var dist = shape.roundedrectdistance(sized, width, height, radius.r, radius.a, radius.g, radius.b)
			//dump = dist*0.01
			//dist += noise.s2d(mesh*32)*5
			var bgcolor =  bgcolorfn(mesh.xy, dist)
			if(borderwidth < 0.001) return bgcolor
			var clamped = 1.0 - (clamp(dist, -0.5, 0.5) + 0.5)
			if (clamped == 0.) discard
			var b = clamp(-dist - (borderwidth-0.5), 0., 1.)
			var precol = mix(bordercolor, bgcolor, b);
			var col =  precol //pal.dither(precol);
			col.a *= clamped * opacity
			return col
		}

		//var distfact = pow((1.0- 0.8*clamp(1.+dist*0.06,0.,1.)),0.4);
		/*
			var xs = 18.
			var ys = 16.
			var x = mesh.x*xs+0.1*time
			var y = mesh.y*ys
			//dbg = mesh.xy
			var ns = noise.snoise3(x, y, 0.1*time)
			bgcolor = vec4(pal.pal2(ns) + 0.5*(vec3(1.)*sin(-8*time + (length(mesh-.5)-.01*ns+ .001*noise.snoise3(x*1, y*1, 0.1*time))*2400)),1.)
			*/
			/*
		self.color = function(){
			var xs = 18.
			var ys = 16.
			var x = mesh.x*xs+0.1*time
			var y = mesh.y*ys
			dbg = mesh.xy
			var ns = noise.snoise3(x, y, 0.1*time)
			return	pal.pal3(ns) + 0.5*(vec3(1.)*sin(-8*time + (length(mesh-.5)-.01*ns+ .001*noise.snoise3(x*1, y*1, 0.1*time))*2400))
		}*/

		self.color_blend = 'src_alpha * src_color + (1-src_alpha) * dst_color'
			//self.color_blend = 'src_alpha * src_color + dst_color'
		self.position = function(){
			sized = vec2(mesh.x * width, mesh.y * height)
			return vec4(sized.x, sized.y, 0, 1) * matrix
		}
	}))
	
	exports.nest('Fg', GLText.extend(function(exports, self){
		self.no_guid = 1
	}))
	
	/*
	self.TexturedShader = exports.Shader.extend(function(exports,self){
		self.texture = GLTexture.rgba(),
		self.color = function(){
			var dist = shape.roundedrectdistance(sized, width, height, radius.r, radius.a, radius.g, radius.b);
			
			var clamped = 1.0 - (clamp(dist, -0.5, 0.5) + 0.5);
			if (clamped == 0.) discard;
			
			var b = clamp(-dist-borderwidth,0.,1.);
			//var distfact = pow((1.0- 0.8*clamp(1.+dist*0.06,0.,1.)),0.4);
			var precol = mix(bordercolor,bgcolor* texture.sample(tex), b);
		//	precol.xyz *= distfact;
			var col =  pal.dither(precol);
		//	var col = precol;
			//col.xyz *= ;
			col.a *= clamped;
			return col;
		}
	})*/
		
	self.enableTextureCache = function(enabled){
		if (enabled == false){
			if(this.texturecache != false){
				// destroy texturecache
				this.texturecache = false;
				this.setDirty(true)
			}
		}
		else{
			if(this.texturecache == false){ // only build if it doesn't already have a texture cache
				this.texturecache = {
					textureID : 0
				};
				this.setDirty(true)
			}
		}
	}

	self.getInvertedMatrix = function(){
		if (this.matrixdirty){
			this.recomputeMatrix();
			this.orientation.worldmatrix = mat4.mul(this.orientation.matrix, this.parent.orientation.worldmatrix);
		}
		if (this.orientation.invertedworldmatrix === undefined){
			this.orientation.invertedworldmatrix = mat4.invert(this.orientation.worldmatrix)
		}
		//mat4.debug(this.orientation.invertedworldmatrix);
		return this.orientation.invertedworldmatrix;
	}
	
	self.recomputeMatrix = function(){
		
		var o = this.orientation;
		if (this.layout) {
			var s = o.scale;
			var r = o.rotation;
			var t = vec3(this.layout.left, this.layout.top, 0);
			if (this._position === "absolute"){
				t[0] = this._x;
				t[1] = this._y;
			}
			var hw = ( this.layout.width ? this.layout.width: this._width ) /  2;
			var hh = ( this.layout.height ? this.layout.height: this._height) / 2;
			mat4.TSRT(-hw, -hh, 0, s[0], s[1], s[2], r[0], r[1], r[2], t[0] + hw * s[0], t[1] + hh * s[1], t[2], this.orientation.matrix);
			//console.log(this.layout)
		}
		else {
			var s = o.scale;
			var r = o.rotation;
			var t = o.translation;
			var hw = this._width / 2;
			var hh = this._height / 2;
			mat4.TSRT(-hw, -hh, 0, s[0], s[1], s[2], r[0], r[1], r[2], t[0] + hw * s[0], t[1] + hh * s[1], t[2], this.orientation.matrix);
		}
		
		this.orientation.invertedworldmatrix = undefined;
		//this.orientation.worldmatrix = mat4.mul(this.orientation.matrix,this.parent.orientation.worldmatrix );
		this.matrixdirty = false;
	}

	self.init = function (obj){
		
		this.orientation = {
			rotation : vec3(0, 0, 0), // (or {0,0,0} for 3d rotation)
			translation : vec3(this.x != undefined ? this.x : 0, this.y != undefined ? this.y : 0, 0),
			scale : vec3(1, 1, 1),
			matrix : mat4.identity(), // calculated
			worldmatrix : mat4.identity() // calculated
		};
		
		this.interfaceguid = exports.interfaceguid++;
		this.screen.guidmap[this.interfaceguid] = this;

		this.rotation = function(){
			this.orientation.rotation[2] = this.rotation;
			this.setDirty(true)
			this.matrixdirty = true
		}

		this.y = function(){
			this.orientation.translation[1] = this.y;
			this.setDirty(true)
			this.matrixdirty = true
		}

		this.x = function(){
			this.orientation.translation[0] = this.x;
			this.setDirty(true)
			this.matrixdirty = true
		}

		this.emit('rotation')
		this.emit('y')
		this.emit('x')
	
		this.visible = true
		this.backgroundTexture = false;
		this.texturecache = false;
		this.effectiveopacity = this.opacity;
		this.effectiveguid = this.interfaceguid;
		
		// if we have a bgimage, we have to set our bgimage function to something
		if(this.bgimage){
			// lets make the thing fetch a texture
			this.bg.texture = new GLTexture()

			if(this.bg.bgcolorfn === this.plaincolor){
				this.bg.bgcolorfn = function(pos, dist){
					var aspect = texture.size.y / texture.size.x
					var center = (1. - aspect) * .5
					var sam = vec2(pos.x * aspect, pos.y)
					var col = texture.sample(sam)
					if(sam.x< 0. || sam.x > 1.) col.a = 0.
					return col
				}
			}

			require.async(this.bgimage).then(function(result){
				this.bg.texture = GLTexture.fromImage(result)
			}.bind(this))
		}

		this.fg.screen = this.screen
		this.bg.screen = this.screen

		//this.shader = new this.Shader()
		//this.textureshader = new this.TexturedShader()
		this.boundingrect = rect(0, 0, 0, 0);
		
		this.onsrc = function(value){
			return
			if (value && value.length > 0) {
				require.async('$root' + this.src).then(function(texture){				
					this.textureshader.texture = GLTexture.fromImage(texture);
					this.textureloaded = true;
					this.logdirty = true;
					this.dirty = true;
				}.bind(this));
			}
		}
	
		this.recomputeMatrix();
	}

	self.renderQuad = function (texture, boundingrect) {}

	self.drawStencil = function (renderstate) {
		this.bg.matrix = renderstate.matrix;
		if (this.layout){
				this.bg.width = this.layout.width? this.layout.width:this.width;
				this.bg.height = this.layout.height? this.layout.height:this.height;
		}
		else{
			this.bg.width = this.width;
			this.bg.height = this.height;
		}
		this.bg.draw();
	}
	
	self.drawContent = function (renderstate) {
		//mat4.debug(this.orientation.matrix);
		if (this.texturecache == false || this.texturecache == true && this.dirty) {
			
			var bg = this.bg
			var fg = this.fg
			// idea reference outer node using shader.node
			// and 
			if (this.matrixdirty) this.recomputeMatrix()
			fg._matrix = bg._matrix = renderstate.matrix

			if (this.layout) {
				//window.dbgthing = this
				//console.log(this.layout);
				//	console.log(this.layout.width);
				this.bg._width = this.layout.width? this.layout.width: this._width
				this.bg._height = this.layout.height? this.layout.height: this._height
			}
			else{
				//console.log(this.layout.width);
				this.bg._width = this._width
				this.bg._height = this._height
			}
			
			bg._borderwidth = this._borderwidth[0]
			//console.log(this.effectiveopacity);
			fg._alpha = bg._alpha = this.effectiveopacity

			fg._opacity = bg._opacity = this.effectiveopacity;

			fg._fgcolor = this._fgcolor
			bg._bgcolor = this._bgcolor

			bg._bordercolor = this._bordercolor
			bg._radius = this._cornerradius

			if(renderstate.drawmode === 2){
				var type = bg.drawDebug()
				if(type) renderstate.debugtypes.push(type)
				fg.drawDebug()
			}
			else if (renderstate.drawmode === 1) {			
				if (this.hasListeners('click') || this.hasListeners('mousedown') || this.hasListeners('mouseout') ||  this.hasListeners('mouseover')|| this.hasListeners('mouseup') || this.hasListeners('mousemove') ||this.hasListeners('scroll')){
					this.effectiveguid = this.interfaceguid;
				}	
				else{
					this.effectiveguid = this.parent.effectiveguid;
				}
				var r = ((this.effectiveguid &255)) / 255.0
				var g = ((this.effectiveguid>>8) &255) / 255.0
				var b = ((this.effectiveguid>>16) &255) / 255.0
				bg._guid = vec4(r,g,b,1.0);					
				bg.drawGuid()
			}
			else{
				bg.time = (this.screen.time%100000)*0.001
				fg.time = (this.screen.time%100000)*0.001

				bg.draw()
				fg.draw()
				//console.log(bg)

			}
		} 
		else {
			console.log("Drawing cached content");
			this.renderQuad(textureID, this.boundingrect);
		}
		this.dirty = false;
		return rect.intersects(this.boundingrect, renderstate.boundingrect);
	}
	
	self.layoutChanged = function() {
		return true;
	}
	
	self.draw = function (renderstate) {
		if (this.atDraw) this.atDraw()

		if (this.visible) {
			if (this.dirty != false || this.layoutChanged()) {
				this.orientation.rotation[2] = this._rotation * 6.283 / 360;
				this.recomputeMatrix();

				this.effectiveopacity = this._opacity !== undefined ? this._opacity : 1.0;
				if (this.parent !== undefined && this.parent.effectiveopacity !== undefined) {
					this.effectiveopacity *= this.parent.effectiveopacity;
				}
			}
			var prevmatrix = mat4.copy(renderstate.matrix);
			this.orientation.worldmatrix = mat4.mul(this.orientation.matrix, renderstate.matrix);
			renderstate.matrix = mat4.copy(this.orientation.worldmatrix);

			var actuallyclipping = this._clipping == true || this.texturecache != false;

			if (actuallyclipping)
				renderstate.pushClip(this);

			var onscreen = this.drawContent(renderstate); // should check against bounds?
			if (actuallyclipping)
				renderstate.stopClipSetup();
			if ((actuallyclipping && onscreen) || actuallyclipping == false) {
				if (this.children) for (var i = 0; i < this.children.length; i++) {
					var child = this.children[i]
					if (child.draw) {
						this.children[i].draw(renderstate);
					}
				}
			}
			if (actuallyclipping) renderstate.popClip(this);

			renderstate.matrix = prevmatrix;
		}
		//this.screen.device.redraw()
	}

	self.render = function(){
	}

	self.spawn = function (parent) {}

	self.hideProperty(Object.keys(self))

})
