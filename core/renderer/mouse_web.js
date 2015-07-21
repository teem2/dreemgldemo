// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Mouse class

define.class('$base/node', function (require, exports, self){
	self.event('move')
	self.attribute('x', {type:float})
	self.attribute('y', {type:float})
	self.attribute('isdown', {type:int})
	self.attribute('left', {type:int})
	self.attribute('middle', {type:int})
	self.attribute('right', {type:int})
	self.attribute('click', {type:Object})
	self.attribute('dblclick', {type:Object})
	self.attribute('clicker', {type:int})
	self.attribute('leftdown', {type:int})
	self.attribute('leftup', {type:int})
	self.attribute('rightdown', {type:int})
	self.attribute('rightup', {type:int})
	
	self.ratio = 0

	self.activedown = 0;
		
	self.clickspeed = 350

	self.atConstructor = function(){
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

		window.addEventListener('dblclick', function(e){
			this.dblclick = 1
		}.bind(this))

		var click_count = 0

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

			this.clicker = this.click_count
			
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
