// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class('./sprite_base', function (require, exports, self, baseclass) {

	var GLShader = require('$gl/glshader')
	var GLTexture = require('$gl/gltexture')
	var GLText = require('$gl/gltext')

	var Sprite = self
	this.dump = 1

	exports.interfaceguid = 1
	this.matrixdirty = true;
	this.dirty = true
	this.attribute("texturecache", {type:boolean, value:false})

	this.clipping =
	this.bordercolor =
	this.bgcolor =
	this.cornerradius =
	this.borderwidth =
	this.height =
	this.width =
	this.texturecache = 
	this.opacity = function(){
		this.setDirty(true)
	}

	this.plaincolor = function(pos, dist){
		return bgcolor
	}

	exports.nest('Bg', GLShader.extend(function(exports, self){
		this.texture = new GLTexture()

		this.mesh = vec2.quad(0, 0, 1, 0, 0, 1, 1, 1)
		this.tex = vec2.quad(0, 0, 1, 0, 0, 1, 1, 1)
	
		this.bgcolor = vec4(1)
		
		this.bordercolor = vec4(0, 0, 0, 0)
		this.borderwidth = 0.0,
		
		this.width = 0.0
		this.radius = vec4(4, 14, 4, 14)
		//this.dump = 1
		this.height = 0
		this.matrix = mat4.identity()
		this.viewmatrix = mat4.identity();
		this.opacity = 0.0;
		this.time = 0.1

		this.bgcolorfn = Sprite.plaincolor 
		this.color = function(){
			var dist = shape.roundedrectdistance(sized, width, height, radius.r, radius.a, radius.g, radius.b)
			//dump = dist*0.01
			//dist += noise.s2d(mesh*32)*5
			var bgcolor =  bgcolorfn(mesh.xy, dist)
			if(borderwidth < 0.001) return bgcolor
			var clamped = 1.0 - (clamp(dist, -0.5, 0.5) + 0.5)
			if (clamped == 0.) discard
			var b = clamp(- dist - (borderwidth - 0.5), 0., 1.)
			var precol = mix(bordercolor, bgcolor, b)
			var col =  precol //pal.dither(precol);
			col.a *= clamped * opacity
			
			return col
		}

		this.color_blend = 'src_alpha * src_color + (1 - src_alpha) * dst_color'
		//this.color_blend = 'src_alpha * src_color + dst_color'
		this.position = function(){
			sized = vec2(mesh.x * width, mesh.y * height)
			return vec4(sized.x, sized.y, 0, 1) * matrix * viewmatrix
		}
	}))
	
	exports.nest('Fg', GLText.extend(function(exports, self){
		this.no_guid = 1
	}))
	
	this.layoutchanged = function(){
	}
	
	this.enableTextureCache = function(enabled){
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
					textureID: 0
				};
				this.setDirty(true)
			}
		}
	}
	
	this.getWorldMatrix = function(){
		
		if (this.matrixdirty || this.hasLayoutChanged()){
			if (this.parent && this.parent.matrixdirty || (this.parent.hasLayoutChanged && this.parent.hasLayoutChanged())) {
					if (parent.recomputeMatrix) parent.recomputeMatrix();
			}
			this.recomputeMatrix();
			this.orientation.worldmatrix = mat4.mul(this.orientation.matrix, this.parent.orientation.worldmatrix);
		}	
		return this.orientation.worldmatrix;
	}
	
	this.getInvertedMatrix = function(){
		if (this.matrixdirty || this.hasLayoutChanged()){
			this.recomputeMatrix();
			this.orientation.worldmatrix = mat4.mul(this.orientation.matrix, this.parent.orientation.worldmatrix);
		}
		if (this.orientation.invertedworldmatrix === undefined){
			this.orientation.invertedworldmatrix = mat4.invert(this.orientation.worldmatrix)
		}
		//mat4.debug(this.orientation.invertedworldmatrix);
		return this.orientation.invertedworldmatrix;
	}
	
	this.getBoundingRect = function(){
		return this.calculateBoundingRect();
	}
	
	this.calculateBoundingRect = function(){	
		if (!this.orientation) return{left:0,right:0, top:0, bottom: 0};
		if (this.matrixdirty) this.recomputeMatrix();
		var x1 = 0;
		var x2 = this._width;
		var y1 = 0;
		var y2 = this._height;

		if(this.layout){
			x2 = this.layout.width;
			y2 = this.layout.height;
		}

		var v1 = vec2(x1,y1);
		var v2 = vec2(x2,y1);
		var v3 = vec2(x2,y2);
		var v4 = vec2(x1,y2);
		
		v1 = vec2.mul_mat4_t(v1, this.orientation.worldmatrix)
		v2 = vec2.mul_mat4_t(v2, this.orientation.worldmatrix)
		v3 = vec2.mul_mat4_t(v3, this.orientation.worldmatrix)
		v4 = vec2.mul_mat4_t(v4, this.orientation.worldmatrix)		
		//mat4.debug(this.orientation.worldmatrix,true);
		//mat4.debug(this.orientation.matrix,true);
		var minx = v1[0];
		var miny = v1[1];
		var maxx = v1[0];
		var maxy = v1[1];
		if (v2[0] < minx) minx = v2[0];else if (v2[0] > maxx) maxx = v2[0];
		if (v3[0] < minx) minx = v3[0];else if (v3[0] > maxx) maxx = v3[0];
		if (v4[0] < minx) minx = v4[0];else if (v4[0] > maxx) maxx = v4[0];
		
		if (v2[1] < miny) miny = v2[1];else if (v2[1] > maxy) maxy = v2[1];
		if (v3[1] < miny) miny = v3[1];else if (v3[1] > maxy) maxy = v3[1];
		if (v4[1] < miny) miny = v4[1];else if (v4[1] > maxy) maxy = v4[1];
		
		var ret = {left: minx, top: miny, right: maxx, bottom: maxy};
		return ret
	}
	
	
	this.recomputeMatrix = function(){
		
		var o = this.orientation;
		if (!o) return;
		if ((this.parent && this.parent.matrixdirty) || (this.parent && this.parent.hasLayoutChanged && this.parent.hasLayoutChanged()))  {
					if (parent.recomputeMatrix){
						parent.recomputeMatrix();
						mat4.debug(parent.orientation.worldmatrix, true);
					}
					
			}
	
		o.rotation[2] = this._rotation * 6.283 / 360;
		
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
		if (this.parent ) {
				if ( this.parent.orientation){
					this.orientation.worldmatrix = mat4.mul(this.orientation.matrix,this.parent.orientation.worldmatrix );
				}else{
					if (this.parent.matrix){
					this.orientation.worldmatrix = mat4.mul(this.orientation.matrix,this.parent.matrix);
					}else{
						console.log("hmm?");
					}
				}
		}
		else{
			this.orientation.worldmatrix = this.orientation.matrix;
			
		}
		
		this.matrixdirty = false;
	}
	
	this.reinit = function(){
		this.interfaceguid = this.screen.interfaceguid++;
//		console.log(this.interfaceguid)
		this.screen.guidmap[this.interfaceguid] = this;
		this.effectiveguid = this.interfaceguid;
	}

	this.init = function (obj){
		
		this.orientation = {
			rotation : vec3(0, 0, 0), // (or {0,0,0} for 3d rotation)
			translation : vec3(this.x != undefined ? this.x : 0, this.y != undefined ? this.y : 0, 0),
			scale : vec3(1, 1, 1),
			matrix : mat4.identity(), // calculated
			worldmatrix : mat4.identity() // calculated
		};
		
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
		
		this.texturecache = function(){
			//console.log("setting texturecaching: ", this.texturecache);
			this.enableTextureCache(this.texturecache);
		}
		
		this.emit('rotation')
		this.emit('y')
		this.emit('x')
	
		this.visible = true
		this.backgroundTexture = false;
		this.texturecache = false;
		this.effectiveopacity = this.opacity;
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

		//this.shader = new this.Shader()
		//this.textureshader = new this.TexturedShader()
		this.boundingrect = rect(0, 0, 0, 0);
	
		this.recomputeMatrix();

		if(!this.mode && this.parent) this.mode = this.parent.mode

		if(this.mode === undefined || this.mode === 'GL'){
			this.drawContent = this.drawContentGL
		}
		else if(this.mode === 'DOM'){
			this.drawContent = this.drawContentDOM
		}
		else if(this.mode === 'Dali'){
			this.drawContent = this.drawContentDali
		}
	}

	this.renderQuad = function(texture, boundingrect) {}

	this.drawStencil = function (renderstate) {
		this.bg.matrix = renderstate.matrix;
		if (this.layout){
			this.bg.width = this.layout.width? this.layout.width:this.width;
			this.bg.height = this.layout.height? this.layout.height:this.height;
		}
		else{
			this.bg.width = this.width;
			this.bg.height = this.height;
		}
		this.bg.draw(renderstate.device);
	}
	
	this.drawContentDOM = function(renderstate){
		
		if (this.matrixdirty) this.recomputeMatrix()
		// lets check if we have a div

		var dom = this.dom
		if(!dom){
			dom = this.dom = document.createElement(this.tag || 'div')
			var parent = this.parent === this.screen? this.parent.device.canvas.parentNode: this.parent.dom
			parent.appendChild(this.dom)
		}

		if(this.layout){
			dom.style.width = this.layout.width? this.layout.width: this._width
			dom.style.height = this.layout.height? this.layout.height: this._height
		}
		else{
			//console.log(this.layout.width);
			dom.style.width = this._width
			dom.style.height = this._height
		}
		dom.style.left = this._pos[0]
		dom.style.top = this._pos[1]
		dom.style.position = 'absolute' 
		dom.style.display = 'block'

		if(this.src) dom.src = this.src

		var bg = this._bgcolor
		if(bg){
			dom.style.backgroundColor = 'rgba('+parseInt(255*bg[0])+','+parseInt(255*bg[1])+','+parseInt(255*bg[2])+','+parseInt(255*bg[3])+')'
		}
		// we have to append it to our parent
	}

	// called by diffing
	this.atDestroy = function(){
		if(this.dom) this.dom.parentNode.removeChild(this.dom)
	}

	this.drawContentDali = function(renderstate){

	}

	this.doDraw = function(renderstate){
		this.bg.time = this.screen.time
		this.fg.time = this.screen.time

		this.bg.draw(this.screen.device)
		this.fg.draw(this.screen.device)

		// lets check if we have a reference on time
		if(this.bg.shader && this.bg.shader.unilocs.time || 
			this.fg.shader && this.fg.shader.unilocs.time){
			this.screen.device.redraw()
		}
	}

	this.doDrawGuid = function(renderstate){
		this.bg.drawGuid(this.screen.device)
	}

	this.drawContentGL = function(renderstate){
		//mat4.debug(this.orientation.matrix);
			var bg = this.bg
			var fg = this.fg
			bg.viewmatrix = renderstate.viewmatrix;
			fg.viewmatrix = renderstate.viewmatrix;
		if (this.texturecache == false || this.texturecache == true && this.dirty){
			
			// idea reference outer node using shader.node
			// and 
			if (this.matrixdirty) this.recomputeMatrix()
			fg._matrix = bg._matrix = renderstate.matrix

			if(this.layout){
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
			fg._opacity = bg._opacity = this.effectiveopacity

			fg._fgcolor = this._fgcolor
			bg._bgcolor = this._bgcolor

			bg._bordercolor = this._bordercolor
			bg._radius = this._cornerradius

			fg.screen = this.screen
			bg.screen = this.screen

			if(renderstate.drawmode === 2){
				var type = bg.drawDebug(this.screen.device)
				if(type) renderstate.debugtypes.push(type)
				fg.drawDebug(this.screen.device)
			}
			else if(renderstate.drawmode === 1){
				if (this.hasListeners('click') || this.hasListeners('mouseleftdown') || this.hasListeners('mouseout') ||  this.hasListeners('mouseover')|| this.hasListeners('mouseup') || this.hasListeners('mousemove') ||this.hasListeners('scroll')){
					this.effectiveguid = this.interfaceguid;
				}
				else{
					this.effectiveguid = this.parent.effectiveguid;
				}
				var r = ((this.effectiveguid &255)) / 255.0
				var g = ((this.effectiveguid>>8) &255) / 255.0
				var b = ((this.effectiveguid>>16) &255) / 255.0
				bg._guid = vec4(r, g, b, 1.0)
				this.doDrawGuid(renderstate)
			}
			else{
				this.doDraw(renderstate)
			}
		} 
		else {
			console.log("Drawing cached content");
			this.renderQuad(textureID, this.boundingrect);
		}
		this.dirty = false;
		return rect.intersects(this.boundingrect, renderstate.boundingrect);
	}
	
	this.drawContent = this.drawContentGL

	this.hideContent = function(){
		
	}
	this.lastLayout ;
	
	this.hasLayoutChanged = function(){
		var changed = false;
		
		if (this.layout && !this.lastLayout){
				changed = true
				this.lastLayout = {left:0, top:0, width:0, height:0, right: 0, bottom: 0};
		}
		if (!this.layout && this.lastLayout) changed = true;
		
		if (this.layout){
			if (this.layout.left != this.lastLayout.left) { changed = true;}
			if (this.layout.top != this.lastLayout.top) { changed = true;}
			if (this.layout.right != this.lastLayout.right) {changed = true;}
			if (this.layout.bottom != this.lastLayout.bottom) { changed = true;}
			
			
		}
		if (changed) 
		{
			this.layoutchanged();
			this.setDirty(true);
			this.setDirty(true, this.lastLayout)
		}
		if (this.layout) this.lastLayout= {left:this.layout.left, top:this.layout.top, width:this.layout.width, height:this.layout.height, right: this.layout.right, bottom:this.layout.bottom};
		return changed;
	}
	
	this.draw = function(renderstate){
		if (this.atDraw) this.atDraw(renderstate)

		if (this.visible){
			if (this.dirty != false || this.hasLayoutChanged()) {
				//if(this.matrixdirty) 
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
		else this.hideContent()
		//this.screen.device.redraw()
	}

	// give it keyboard focus
	this.focus = function(){
		this.screen.setFocus(this)
	}

	this.spawn = function (parent) {}

	this.hideProperty(Object.keys(self))

})
