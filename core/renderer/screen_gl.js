// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class('./screen_base', function (require, exports, self, baseclass) {
	var GLDevice = require('$gl/gldevice')
	var GLShader = require('$gl/glshader')
	var GLTexture = require('$gl/gltexture')
	var Sprite = require('./sprite_gl')
	var Text = require('./text_gl')
	var RenderState = require('./renderstate_gl')
	var FlexLayout = require('$lib/layout')
	
	//this.attribute('time', {type:float, value: 0});
	//this.attribute('moved', {type:boolean, value : true});

	this.dirty = true
 
	this.atConstructor = function(){}

	this.render = function(){
		//console.log("render");
	}

	this.renderstate = new RenderState();

	this.debug = true

	this.lastx = -1;
	this.lasty = -1;

	this.logDebug = function(value){
		console.log(value)
		document.title = value
	}

	this.drawDebug = function(){
		this.renderstate.setup(this.device, 2, 2);
		this.renderstate.translate(-this.mouse.x + 1, this.device.size[1] - (this.mouse.y) - 1);
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
		this.renderstate.setup(this.device, 2, 2);
		this.renderstate.translate(- this.mouse.x + 1, this.device.size[1] - (this.mouse.y) - 1);
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
		if (node && node.getWorldMatrix)
		{
			var M = node.getWorldMatrix()
			var M2 =mat4.ortho(0, this.device.main_frame.size[0], 0, this.device.main_frame.size[1], -100, 100);
			 var M3 = mat4.mul( M, M2);
			 var M3i = mat4.invert(M3)
			var R = vec2.mul_mat4_t(vec2(this.mouse.glx, this.mouse.gly), M3i)
			console.log(this.device.main_frame.size, R);
			
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

	this.drawColor = function(){
		this.renderstate.setup(this.device);
		this.orientation = {};
		
		this.orientation.worldmatrix = this.renderstate.matrix;
		this.invertedworldmatrix =  mat4.invert(this.orientation.worldmatrix)
		this.renderstate.debugmode = false;
		this.renderstate.drawmode = 0;
		this.device.clear(this.bgcolor)
		this.device.gl.clearStencil(0);
		//this.device.clear(this.device.gl.STENCIL_BUFFER_BIT);
		for (var i = 0; i < this.children.length; i++){
			this.children[i].draw(this.renderstate)
		}
	}

	this.readGuidTimeout = function(){
		var dt = Date.now()
		this.device.setTargetFrame(this.pic_tex)
		this.readGuid()
	}
	
	this.dumped = 1;	
	this.dumpLayout = function(node, styleorlayout, depth){
		if (this.dumped<=0) return;
		if (!depth) depth = "";
	//	if (depth === ""){
		
		console.log(depth, node.constructor.name,styleorlayout?node.style: node.layout);
//		}
		for (var i = 0; i < node.children.length; i++) {
			this.dumpLayout(node.children[i],styleorlayout, depth + " " );
		}
		if (depth ==="")  this.dumped --;
	}
	
	this.structuredumped = 1;	
	this.dumpStructure = function(node, depth){
		if (this.structuredumped<=0) return;
		if (!depth) depth = "";
	//	if (depth === ""){
		console.log(depth , node.constructor.name, node);
//		}
		for (var i = 0; i < node.children.length; i++) {
			this.dumpStructure(node.children[i], depth + " " );
		}
		if (depth ==="")  this.structuredumped --;
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
	//	 this.dumpLayout(this, true);

		FlexLayout.computeLayout(this);
		this.dumped = 1;	
	//	 this.dumpLayout(this, false);
		// this.dumpStructure(this);
	}

	this.draw = function (time) {
		this.draw_calls = 0
		var anim = this.doAnimation(time)
		
		this.performLayout();
//		var delta = Date.now()
		this.time = time// Date.now()
	//	console.log(this.time)		
		this.last_time = time
	
		if (this.debug === true) {
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
			this.dirty = false
			this.device.setTargetFrame()
			//for(var i = 0;i<20;i++)
			this.drawColor();
		}

		if(anim || this.hasListeners('time')){
			this.device.redraw()
		}
		//console.log(this.draw_calls, Date.now() - delta)
	}

	this.setDirty = function(value){
		if (this.dirty === false && value === true && this.device !== undefined){
			this.dirty = true
			this.device.redraw();
		}
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
			this.setDirty(true)
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

		this.initVars()

		this.bindInputs()
	}
})
