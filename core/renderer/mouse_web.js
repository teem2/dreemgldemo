// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Mouse class

define.class('$base/node', function (require, exports, self){
	this.event('move')
	this.attribute('x', {type:float})
	this.attribute('y', {type:float})
	this.attribute('isdown', {type:int})
	this.attribute('left', {type:int})
	this.attribute('middle', {type:int})
	this.attribute('right', {type:int})
	this.attribute('click', {type:Object})
	this.attribute('blurred', {type:int})
	this.attribute('dblclick', {type:Object})
	this.attribute('clicker', {type:int})
	this.attribute('leftdown', {type:int})
	this.attribute('leftup', {type:int})
	this.attribute('rightdown', {type:int})
	this.attribute('rightup', {type:int})
	
	this.ratio = 0
	
	this.activedown = 0;
		
	this.clickspeed = 350

	this.atConstructor = function(){
		x = 0
		y = 0
		if(this.ratio == 0) this.ratio = window.devicePixelRatio

		document.ontouchmove = function(e){
			e.preventDefault()
		}
		// allright we need to figure out how we send back the mouse events to the worker
		// are we going to send a vec2? or something else
		window.addEventListener('click', function(e){
			this.click = 1
		}.bind(this))

		window.addEventListener('blur', function(e){
			this.blurred =1;
		}.bind(this))

		window.addEventListener('dblclick', function(e){
			this.dblclick = 1
		}.bind(this))

		var click_count = 0

		this.resetClicker = function(){
			click_count = 0
		}

		window.addEventListener('mousedown', function(e){
			var now = Date.now()
			if (this.activedown == 0){
				//document.body.setCapture();
			}
			this.activedown++;
			if(this.last_click !== undefined && now - this.last_click < this.clickspeed){
				click_count ++
			}
			else click_count = 1
			this.last_click = now

			this.clicker = click_count

			this.x = e.pageX// / this.ratio//* window.devicePixelRatio
			this.y = e.pageY// / this.ratio//* window.devicePixelRatio

			if(e.button === 0 ) this.cancapture = 1, this.left = 1, this.leftdown = 1
			if(e.button === 1 ) this.cancapture = 3, this.middle = 1
			if(e.button === 2 ) this.cancapture = 2, this.right = 1, this.rightdown = 1
			this.isdown = 1
		}.bind(this))

		window.addEventListener('mouseup', function(e){
			this.activedown--;
			if (this.activedown == 0){
				//document.body.releaseCapture();
			}

			this.x = e.pageX// / this.ratio//* window.devicePixelRatio
			this.y = e.pageY// / this.ratio //* window.devicePixelRatio
			this.cancapture = 0
			if(e.button === 0) this.left = 0, this.leftup = 1
			if(e.button === 1) this.middle = 0
			if(e.button === 2) this.right = 0, this.rightup = 1
			this.isdown = 0
		}.bind(this))

		window.addEventListener('mousemove', function(e){
			//last_click = undefined
			//if(layer) hit = layer.hitTest2D(e.pageX * ratio, e.pageY * ratio)
			this.x = e.pageX// / this.ratio//* window.devicePixelRatio
			this.y = e.pageY// / this.ratio//* window.devicePixelRatio
			this.move = 1
		}.bind(this))
	}
})
