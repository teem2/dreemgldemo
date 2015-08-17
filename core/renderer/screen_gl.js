// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class('./screen_base', function (require, exports, self, baseclass) {
	var GLDevice = require('$gl/gldevice')
	var GLShader = require('$gl/glshader')
	var GLTexture = require('$gl/gltexture')
	var GLText = require('$gl/gltext')

	var Sprite = require('./sprite_gl')
	var Text = require('./text_gl')
	var RenderState = require('./renderstate_gl')
	var FlexLayout = require('$lib/layout')

	var renderer = require('$renderer/renderer')
	
	this.dirty = true
	this.totaldirtyrect = {};
	this.dirtyrectset = false;
	this.debugshader = false
	this.debug = false;
	this.showdebugtext = true;
	
	this.lastx = -1;
	this.lasty = -1;

	this.renderstate = new RenderState();	
	this.atConstructor = function(){}

	// show a modal view.
	this.modal = function(){
		return new Promise(function(resolve, reject){
			
		})
	}
	
	this.debuglabels = []
	this.frameconsolecounter = 0;
	

	this.frameconsoletext = function(text, color){
		if (color === undefined) color = vec4("white");
		this.debugtext(10, this.frameconsolecounter * 14, text, color);
		this.frameconsolecounter++;
	}
	
	this.debugtext = function(x,y,text,color){
		if (color === undefined) color = vec4("white");
		this.debuglabels.push({x:x, y:y, text:text, color: color});	
	}

	this.logDebug = function(value){
		console.log(value)
		document.title = value
	}

	this.drawDebug = function(){
		this.renderstate.setup(this.device, 2, 2,-this.mouse.x + 1, this.device.size[1] - (this.mouse.y) - 1);
		//this.renderstate.translate(-this.mouse.x + 1, this.device.size[1] - (this.mouse.y) - 1);
		this.renderstate.drawmode = 2;
		this.renderstate.debugtypes = []
		this.device.clear(vec4(0.5, 0.5, 0.5, 1))
		this.device.gl.clearStencil(0);

		for (var i = 0; i < this.children.length; i++) {
			this.children[i].draw(this.renderstate)
		}
		this.device.gl.readPixels(1 * this.device.ratio, 1 * this.device.ratio, 1, 1, this.device.gl.RGBA, this.device.gl.UNSIGNED_BYTE, this.buf);
		// lets decode the types
		var type = this.renderstate.debugtypes[0]
		if (type) {
			if (this.buf[0] == 127 && this.buf[1] == 127 && this.buf[2] == 127) {
				this.logDebug('no debug')
			} 
			else {
				if (type == 'int') {
					var i = this.buf[2] < 128 ? -this.buf[0] : this.buf[0]// + this.buf[1]*255
						if (this.buf[1])
							i += this.buf[1] * 256
							this.logDebug(i)
				}
				if (type == 'float') {
					var i = this.buf[2] < 128 ? -this.buf[0] / 255 : this.buf[0] / 255 // + this.buf[1]*255
						if (this.buf[1])
							i += this.buf[1]
							this.logDebug(i)
				}
				if (type == 'vec2') {
					this.logDebug('(' + this.buf[0] / 255 + ',' + this.buf[1] / 255 + ')')
				}
				if (type == 'ivec2') {
					this.logDebug('(' + this.buf[0] + ',' + this.buf[1] + ')')
				}
				if (type == 'vec3') {
					this.logDebug('(' + this.buf[0] / 255 + ',' + this.buf[1] / 255 + ',' + this.buf[2] / 255 + ')')
				}
				if (type == 'ivec3') {
					this.logDebug('(' + this.buf[0] + ',' + this.buf[1] + ',' + this.buf[2] + ')')
				}
			}
		}
	}

	this.drawGuid = function(){
		this.renderstate.setup(this.device, 2, 2, this.mouse.x - 1, -this.device.size[1] + (this.mouse.y) + 1);
		//this.renderstate.translate(- this.mouse.x + 1, this.device.size[1] - (this.mouse.y) - 1);
		this.renderstate.drawmode = 1;

		this.device.clear(vec4(0, 0, 0, 1))
		this.device.gl.clearStencil(0);
		//this.device.clear(this.device.gl.STENCIL_BUFFER_BIT);
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].draw(this.renderstate)
		}
	}

	this.readGuid = function(){
		//return
		//return
		this.device.gl.readPixels(1 * this.device.ratio, 1 * this.device.ratio, 1, 1, this.device.gl.RGBA, this.device.gl.UNSIGNED_BYTE, this.buf);
		var id = this.buf[0] + (this.buf[1] << 8) + (this.buf[2] << 16);
		this.lastidundermouse = id;

		if (this.mousecapture !== false) {
			id = this.mousecapture;
		}

		this.setguid(id);
	}

	this.remapMouse = function(node){
		if (node && node.getWorldMatrix){
			var M = node.getWorldMatrix()
			var screenw = this.device.main_frame.size[0] / this.device.main_frame.ratio;
			var screenh = this.device.main_frame.size[1] / this.device.main_frame.ratio;
			var M2 =mat4.ortho(0, screenw, 0, screenh, -100, 100);
			var M3 = mat4.mul( M, M2);
			var M3i = mat4.invert(M3)
			var R = vec2.mul_mat4_t(vec2(this.mouse.glx, this.mouse.gly), M3i)
			return R
		}
	}

	this.setguid = function(id){
		
		var screenw = this.device.main_frame.size[0]/ this.device.main_frame.ratio;
		var screenh = this.device.main_frame.size[1]/ this.device.main_frame.ratio;
		
		this.mouse.glx = (this.mouse.x/(screenw/2))-1;
		this.mouse.gly = -(this.mouse.y/(screenh/2)-1);
				
		//var R = vec2.mul_mat4_t(vec2(this.mouse.glx, this.mouse.gly), this.invertedworldmatrix);

		if(id != this.lastmouseguid || this.mouse.x != this.lastx || this.mouse.y != this.lasty){
			//this.frameconsoletext("new mouseguid:" + id + "  " + (this.mousecapture?"captured":"noncaptured"), vec4("white"));
		
			this.lastx = this.mouse.x
			this.lasty = this.mouse.y
			
			var overnode = this.guidmap[id]
			if (overnode && overnode.hasListeners){
				if(overnode.hasListeners('mousemove')){
					overnode.emit('mousemove', this.remapMouse(overnode))
				}
			}
		}

		if(id != this.lastmouseguid){

			var overnode = 	this.guidmap[this.lastmouseguid];
			if (overnode && overnode.emit) overnode.emit('mouseout')

			if (this.uieventdebug){
				$$("mouseout: " + this.guidmap[this.lastmouseguid].constructor.name + "(" + this.lastmouseguid + ")")
			}
			if (this.uieventdebug){
				$$("mouseenter: " + this.guidmap[id].constructor.name + "(" + id + ")")
			}

			if (this.guidmap[id]) this.guidmap[id].emit('mouseover')
			this.lastmouseguid = id
		}
	}

	this.hasDirtyRect = function()
	{
		return this.dirtyrectset;
	}

	this.drawColorFrames = 0;
	this.drawColor = function(){
		this.drawColorFrames++;
		var clippedrect = false;
		var donesetup = false;
		
			var devw = (this.device.size[0] * this.device.ratio)
					var devh = (this.device.size[1] * this.device.ratio)
				
				
		var w = devw;
			var h = devh;
			var x = 0;
			var y =	0;
			
			
		if (this.hasDirtyRect()){
		w = this.totaldirtyrect.right - this.totaldirtyrect.left;
			 h = this.totaldirtyrect.bottom - this.totaldirtyrect.top;
			 x = this.totaldirtyrect.left;
			 y =	this.totaldirtyrect.top;
			if (isNaN(w) || isNaN(h)  ){
			//	console.log("Nans?", this.totaldirtyrect, h, w)
			//	this.debugtext(0,0,"Full screen repaint: " + this.drawColorFrames);
			}
			else{
					//console.log("should clip:", this.totaldirtyrect);
					this.renderstate.setup(this.device);
					clippedrect = true;
					
					//this.renderstate.viewmatrix = mat4.ortho(x, x + w, y+h,y,	 -100, 100);
					//this.device.gl.scissor(0,0, viewportwidth * device.ratio, viewportheight * device.ratio);
					//this.device.gl.viewport(this.totaldirtyrect.left;, devh -h, w, h)
		
		
					donesetup = true;
					
					this.debugrectshader.viewmatrix = this.renderstate.viewmatrix;
					this.debugrectshader.matrix = mat4.identity();
					this.debugrectshader.frame = this.renderstate.frame;
				
					this.debugrectshader.bgcolor = vec4("black");
					
			//		this.renderstate.pushClipRect(rect(0,0,0,0));
					
					this.debugrectshader.width = w;
					this.debugrectshader.height = h;
					this.debugrectshader.x = this.totaldirtyrect.left;
					this.debugrectshader.y = this.totaldirtyrect.top;
					
					this.debugrectshader.draw(this.device);
				
					this.renderstate.cliprect =  rect(this.totaldirtyrect.left,this.totaldirtyrect.top,this.totaldirtyrect.left+ w,this.totaldirtyrect.top+ h);;
				
				//	this.renderstate.stopClipSetup();
					
			//		this.device.gl.enable(this.device.gl.STENCIL_TEST);	
					
				
					//this.debugrectshader.draw(this.device);									
					//this.renderstate.setupsubrect(this.device, this.totaldirtyrect.left, this.totaldirtyrect.top, w,h);
					//donesetup = true;
			}
		}
		
		if (donesetup == false)
		{
				this.renderstate.setup(this.device);
				this.device.gl.clearStencil(0);

		}
		this.orientation = {};
		this.orientation.worldmatrix = mat4();
		this.invertedworldmatrix =  mat4.invert(this.orientation.worldmatrix)
		this.renderstate.debugmode = false;
		this.renderstate.drawmode = 0;
		if (clippedrect)
		{
			this.device.gl.enable(this.device.gl.SCISSOR_TEST);
			this.device.gl.scissor(x, devh -  y -h,w,h);
		}
		this.device.clear(this.bgcolor)
//		this.device.clear(vec4(sin(this.renderstate.frame), 0,0,1));
		
		if (clippedrect)
		{
//			this.device.gl.disable(this.device.gl.SCISSOR_TEST);
		}

		for (var i = 0; i < this.children.length; i++){
			this.children[i].draw(this.renderstate)
		}
			if (clippedrect)
		{
			this.device.gl.disable(this.device.gl.SCISSOR_TEST);
		}

		if (clippedrect) this.renderstate.popClip();
		if (this.debug && this.debuglabels.length > 0 ){
				this.renderstate.setup(this.device);
		
			this.device.gl.clearStencil(0);
			if (this.renderstate.scissor) this.device.gl.disable(this.device.gl.SCISSOR_TEST);
			
			this.debugtextshader.viewmatrix = this.renderstate.viewmatrix;
				
				if( this.showdebugtext == true){
					
				for (var a in this.debuglabels){
					var label = this.debuglabels[a];
					var textbuf = this.debugtextshader.newText()
					textbuf.font_size = 12;
					textbuf.fgcolor = label.color;
					textbuf.bgcolor = label.color;
					textbuf.clear()
					textbuf.add(label.text)
				
					var ofx = [-1, 0, 1,-1,1,-1,0,1,0];
					var ofy = [-1,-1,-1, 0,0,1,1,1,0];
					this.debugtextshader.mesh = textbuf;
					this.debugtextshader.bgcolor = vec4("white");
					this.debugtextshader.fgcolor =vec4("black");

					for (var i =0 ;i<9;i++)
					{
						var t = mat4.identity();
						mat4.translate(t, vec3(label.x + ofx[i], label.y + ofy[i] + 10, 0), t);
						mat4.transpose(t,t);
						this.debugtextshader.matrix = t;
						if (i == 8) this.debugtextshader.fgcolor = label.color;									
						this.debugtextshader.draw(this.device);
					}					
				}
			}
			this.debuglabels = [];
			//this.frameconsolecounter = 0;
		}
	}

	this.readGuidTimeout = function(){
		var dt = Date.now()
		this.device.setTargetFrame(this.pic_tex)
		this.readGuid()
	}
	
	this.computeBoundingRects = function (node)
	{
			if (node.getBoundingRect) node.getBoundingRect(true);
			for(a in node.children){
				this.computeBoundingRects(node.children[a]);
			}
	
	}
	
	this.performLayout = function(){
		this._width = this.device.main_frame.size[0]/ this.device.main_frame.ratio;
		this._height = this.device.main_frame.size[1]/ this.device.main_frame.ratio;
		this.size = [this._width, this._height];
		this.pos = [0,0];
		this.flexdirection = "column" ;
		
		this._top = 0;
		this._left =0;
		this._right = this._width;
		this._bottom = this._height;
		
		FlexLayout.fillNodes(this);	
		FlexLayout.computeLayout(this);
		this.computeBoundingRects(this);
		for(a in this.dirtyNodes)
		{
			this.addDirtyRect(this.dirtyNodes[a].getBoundingRect());
		}
		this.dirtyNodes = [];
	}

	this.draw = function (time) {
		this.draw_calls = 0
		var anim = this.doAnimation(time)
		
		this.performLayout();
//		var delta = Date.now()
		this.time = time// Date.now()
	//	console.log(this.time)		
		this.last_time = time
	
		if (this.debugshader === true) {
			if (!this.debug_tex.frame_buf) this.debug_tex.allocRenderTarget(this.device)
			this.device.setTargetFrame(this.debug_tex)
			this.drawDebug()
		}

		if (this.moved === true){//} || this.dirty === true) {
			this.moved = false
			if (!this.pic_tex.frame_buf) this.pic_tex.allocRenderTarget(this.device)
			this.device.setTargetFrame(this.pic_tex)
			this.drawGuid()
			// make sure reading the texture is delayed otherwise framerate is destroyed
			this.readGuidTimeout()
			//setTimeout(this.readGuidTimeout, 0)
		}
		
		if (this.dirty === true) {
			this.device.setTargetFrame()
			//for(var i = 0;i<20;i++)
			this.drawColor();
			this.dirty = false
			this.totaldirtyrect = {};
			this.dirtyrectset = false;
			
		}

		if(anim || this.hasListeners('time')){
			this.device.redraw()
		}
		//console.log(this.draw_calls, Date.now() - delta)
	}
	
	this.dirtyNodes = [];
	
	this.addDirtyNode =function(node){
		this.addDirtyRect(node.getBoundingRect());
		this.dirtyNodes.push(node);	
	}
	
	this.addDirtyRect = function(rect){				
		// round to visible pixels.. round up.
		rect.bottom = Math.ceil(rect.bottom);
		rect.right = Math.ceil(rect.right);
		rect.left = Math.floor(rect.left);
		rect.top = Math.floor(rect.top);
		var w = rect.right - rect.left;
		var h = rect.bottom - rect.top;
		
		if (w == 0 || h == 0) {
			//zero area rect;	
			return;
		}
		
		if (isNaN(w) || isNaN(h)) {
			console.log("NaN?");
			return;
		}
		if (this.debug){
			//this.debugtext(rect.left, rect.top, rect.left + " " +rect.top +  " " + rect. right + " "+  rect.bottom, vec4("white") );	
		}
		
		if (this.dirtyrectset){	
//			console.log("adding to existing dirtyrect: ", rect);	
			this.totaldirtyrect.top = Math.min(this.totaldirtyrect.top, rect.top);
			this.totaldirtyrect.bottom = Math.max(this.totaldirtyrect.bottom, rect.bottom);
			this.totaldirtyrect.left = Math.min(this.totaldirtyrect.left, rect.left);
			this.totaldirtyrect.right = Math.max(this.totaldirtyrect.right, rect.right);
		}else{
		//	console.log("replacing existing dirtyrect: ", rect);	
			this.totaldirtyrect = rect;
		}
		this.dirtyrectset = true;
	}
	
	this.bubbleDirty = function(){
		this.dirty = true;
		this.moved = true;
		this.device.redraw();
	}

	this.setDirty = function(){
		this.bubbleDirty();
//		this.device.redraw();
	}

	this.onmoved = function(value){
		if (value === true && this.device !== undefined){
			this.device.redraw();
		}
		return value;
	}

	this.click = function(){
		if (this.lastmouseguid > 0) {
			if (this.uieventdebug){
				console.log(" clicked: " + this.guidmap[this.lastmouseguid].constructor.name);
			}
			var overnode = this.guidmap[this.lastmouseguid];
			if (overnode && overnode.emit) overnode.emit('click')
		}
	}

	this.diff = function(other, globals){
		// if we diff well get a complete new one..
		baseclass.prototype.diff.call(this, other, globals)
		
		for(i = 0; i < this.children.length; i++) this.children[i].parent = this
		// alright now lets copy over the settings

		this._init = 1

		this.pic_tex = other.pic_tex
		this.debug_tex = other.debug_tex
		this.device = other.device
		this.buf = other.buf
		this.mouse = other.mouse
		this.keyboard = other.keyboard
		this.debugtextshader = other.debugtextshader;
		this.debugrectshader = other.debugrectshader;
		this.initVars()
		this.bindInputs()

		return this
	}

	this.setFocus = function(object){
		if(this.focus_object !== object){
			if(this.focus_object) this.focus_object.emit('focuslost')
			this.focus_object = object
			object.emit('focusget')
		}
	}

	this.focusNext = function(obj){
		// continue the childwalk.
		var screen = this, found 
		function findnext(node, find){
			for(var i = 0; i < node.children.length; i++){
				var obj = node.children[i]
				if(obj === find){
					found = true
				}
				else if(obj.tabstop && found){
					screen.setFocus(obj)
					return true
				}
				if(findnext(obj, find)) return true
			}
		}
		
		if(!findnext(this, obj)){
			found = true
			findnext(this)
		}
	}

	this.focusPrev = function(obj){
		var screen = this, last
		function findprev(node, find){
			for(var i = 0; i < node.children.length; i++){
				var obj = node.children[i]
				if(find && obj === find){
					if(last){
						screen.setFocus(last)
						return true
					}
				}
				else if(obj.tabstop){
					last = obj
				}
				if(findprev(obj, find)) return true
			}
		}
		if(!findprev(this, obj)){
			findprev(this)
			if(last) screen.setFocus(last)
		}
	}

	this.bindInputs = function(){

		this.keyboard.down = function(v){
			if(!this.focus_object) return
			this.focus_object.emit('keydown', v)
		}.bind(this)

		this.keyboard.up = function(v){
			if(!this.focus_object) return
			this.focus_object.emit('keyup', v)
		}.bind(this)

		this.keyboard.press = function(v){
			// lets reroute it to the element that has focus
			if(!this.focus_object) return
			this.focus_object.emit('keypress', v)
		}.bind(this)

		this.keyboard.paste = function(v){
			// lets reroute it to the element that has focus
			if(!this.focus_object) return
			this.focus_object.emit('keypaste', v)
		}.bind(this)

		this.mouse.move = function () {
			if (this.mousecapture){
				this.setguid (this.lastmouseguid);
			}
			else{
				this.moved = true;
				this.screen.device.redraw()
			}
		}.bind(this)

		this.mouse.leftdown = function(){
			if (this.mousecapture === false) {
				this.mousecapture = this.lastmouseguid;
				this.mousecapturecount = 1;
			} 
			else {
				this.mousecapturecount++;
			}
			var overnode = this.guidmap[this.lastmouseguid]
			// lets give this thing focus

			if (overnode && overnode.emit){
				this.setFocus(overnode)
				overnode.emit('mouseleftdown', this.remapMouse(overnode))
			} 
		}.bind(this)

		this.mouse.leftup = function(){ 
			this.mousecapturecount--;
			var overnode = this.guidmap[this.lastmouseguid]
			if (overnode && overnode.emit) overnode.emit('mouseleftup')
			if (this.mousecapturecount === 0) {
				this.mousecapture = false;
				this.setguid(this.lastidundermouse);
			}
		}.bind(this)

		this.mouse.click = function () {
			this.click();
		}.bind(this)

		this.device.atResize = function(){
			this.setDirty()
		}.bind(this)

		this.device.atRedraw = function (time) {
			this.draw(time / 1000.)
		}.bind(this)
	}

	this.initVars = function(){
		this.guidmap = {};
		this.guidmap[0] = this;
		this.mousecapture = false;
		this.mousecapturecount = false;
		this.lastmouseguid = 0;
		this.lastidundermouse = 0;
		this.effectiveguid = 0;
		this.interfaceguid = 0;
		this.readGuidTimeout = this.readGuidTimeout.bind(this)
	}

	this.init = function (parent) {
		this.pic_tex = GLTexture.rgba_depth_stencil(16, 16)
		this.debug_tex = GLTexture.rgba_depth_stencil(16, 16)	
		this.buf = new Uint8Array(4);
		this.device = new GLDevice()
		this.debugtextshader = new GLText();
		this.debugtextshader.has_guid = false;
		this.debugrectshader = new GLShader();
		this.debugrectshader.has_guid = false;
		
		this.debugrectshader.bgcolor = vec4(0.6,0.6,1.0,0.07);
		this.debugrectshader.x = 10;
		this.debugrectshader.y = 10;
		this.debugrectshader.width = 100;
		this.debugrectshader.frame = 0;
		this.debugrectshader.height = 100;
		this.debugrectshader.color = function(){return bgcolor + sin(frame + mesh.x)*vec4(0,1,0,0) + mesh.y * vec4(0,0,1,0) + mesh.x * vec4(1,0,0,0);;};
		this.debugrectshader.mesh = vec2.array();
		this.debugrectshader.mesh.length = 0;
		this.debugrectshader.mesh.pushQuad(0,0,1,0,0,1,1,1);
		this.debugrectshader.viewmatrix = mat4;
		this.debugrectshader.matrix = mat4;
		
		this.debugrectshader.position = function(){return (vec2(mesh.x * width, mesh.y*height)  + vec2(x,y))* matrix * viewmatrix};

		this.initVars()

		this.bindInputs()
	}
})
