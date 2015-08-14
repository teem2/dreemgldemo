// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(require, exports, self){
	
	this.pushClip = function( sprite){
		var previousdepth = this.clipStack.length;
		this.clipStack.push(sprite.boundingrect);		
		var gl = this.device.gl;
		
		gl.enable(gl.STENCIL_TEST);				
		gl.colorMask(true, true,true,true);
		gl.stencilFunc(gl.EQUAL, previousdepth, 0xFF);
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
	}
	
	this.translate = function(x,y){
		var m2 = mat4.T(x,y,0);
	//	this.matrix = mat4.mul(this.matrix, m2);
		this.viewmatrix = mat4.mul( m2, this.viewmatrix);
	}
	
	this.stopClipSetup = function(sprite){
		var gl = this.device.gl;
		var depth = this.clipStack.length

		//gl.colorMask(true,true,true,true);
	
		gl.stencilFunc(gl.EQUAL, depth, 0xFF);
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);	
	}
	
	this.popClip = function(sprite) {
		
		this.clipStack.pop();
		var previousdepth = this.clipStack.length;
		var gl = this.device.gl;
		
		//gl.enable(GL_STENCIL_TEST);		// should still be enabled!
		//gl.colorMask(gl.FALSE, gl.FALSE, gl.FALSE, gl.FALSE);
		gl.stencilFunc(gl.EQUAL, previousdepth + 1, 0xFF);
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);

		// this erases the current sprite from the stencilmap
		sprite.drawStencil(this);
		
		gl.colorMask(true,true,true,true);
		gl.stencilFunc(gl.EQUAL, previousdepth - 1, 0xFF);
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);			
	}
	
	this.clearcount = 0;
	this.debugrects = false;
	
	
	this.setupsubrect = function(device, x,y,w,h){
		
		this.device = device;
		
		this.clipStack = [];
		
		var screenw = device.main_frame.size[0];
		var screenh  = device.main_frame.size[1];
		
		y = (screenh/device.ratio  - y ) -h; 
		//		console.log("subrect:",x,y,x+w,y+h, screenw * device.ratio, screenh* device.ratio, device.ratio);
		
		this.uimode = true;
		this.matrix = mat4.identity();
		this.viewmatrix = mat4.ortho(0, screenw/device.ratio, 0, screenh/device.ratio, -100, 100);
		if (w  < screenw || h  < screenh){
			this.device.gl.enable(this.device.gl.SCISSOR_TEST);
			//debugtext(10,40,"scissored mode!", vec4("white"));
		}else{
			this.device.gl.disable(this.device.gl.SCISSOR_TEST);
			
		//	this.debugtext(10,40,"defauled to full mode because the area is too big", vec4("white"));
		}
		
		this.device.gl.scissor(x * device.ratio ,y * device.ratio  , w * device.ratio, h * device.ratio);
		if (this.debugrects){
		//this.device.clear(vec4(1,0.5+0.5*sin(this.clearcount++) ,0,1))
			this.device.clear(vec4(1,0.5+0.5*sin(this.clearcount++) ,0,1))
			this.device.gl.scissor(x* device.ratio+2,y* device.ratio+2  , w * device.ratio - 4, h * device.ratio-4);
			this.device.clear(vec4(1,0,0,1))
		}
		
		this.device.gl.viewport(0,0,screenw, screenh);//x* device.ratio, screenh- y, w * device.ratio, h * device.ratio)
		this.boundingrect = rect(x,y, w,h);
		this.boundrect = rect(x,y,x + w, y + h);
	}

	this.setup = function(device, viewportwidth, viewportheight, offx, offy){
		if (offx === undefined) offx = 0;
		if (offy === undefined) offy = 0;
		this.device = device;
		this.clipStack = [];
		this.device.gl.enable(this.device.gl.SCISSOR_TEST);
		if (viewportwidth === undefined) viewportwidth = device.size[0];
		if (viewportheight === undefined) viewportheight = device.size[1];
		
		this.uimode = true;
		this.matrix = mat4.identity();
		this.viewmatrix = mat4.ortho(0 + offx, device.size[0] + offx, 0 + offy, device.size[1] + offy, -100, 100);
		this.device.gl.scissor(0,0, viewportwidth * device.ratio, viewportheight * device.ratio);
		this.device.gl.viewport(0, 0, device.size[0] * device.ratio, device.size[1] * device.ratio)
		this.boundingrect = rect(0,0, device.size[0], device.size[1]);
	}
})
