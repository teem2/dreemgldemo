// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class('./sprite_base', function(require, exports, self){x
	self.atConstructor = function(){
	}

	self.render = function(){
		this.x
		this.y
		this.width
		this.height
		this.rotation
	}

	self.spawn = function(parent){
		this.dom_node = document.createElement('div')
		this.dom_node.style.backgroundColor = this.bgcolor
		this.dom_node.style.position = 'absolute'
		this.dom_node.style.left = this.x + 'px'
		this.dom_node.style.top = this.y + 'px'
		this.dom_node.style.width = this.width + 'px'
		this.dom_node.style.height = this.height + 'px'

		this.dom_node.onclick = function(){
			this.onclick.emit()
		}.bind(this)

		if(this.rotation) this.dom_node.style.transform = 'rotateZ('+this.rotation+'deg)'
		parent.dom_node.appendChild(this.dom_node)
	}
})