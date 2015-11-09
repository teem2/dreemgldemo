// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
define.class(function(view, require) {
	
	var FlexLayout = require('$lib/layout')
	var Render = require('$base/render')
	
	this.attribute('locationhash', {type:Object})

	this.bg = undefined

	this.mode = '2D'
	this.dirty = true
	this.flex = 0
	this.flexdirection = "column"
	
	this.atConstructor = function(){
	}

	this.init = function (previous) {
		// ok. lets bind inputs
		this.modal_stack = []
		this.focus_view = undefined
		this.mouse_view = undefined
		this.mouse_capture = undefined
		this.keyboard = this.device.keyboard
		this.mouse = this.device.mouse 
		this.touch = this.device.touch
		this.bindInputs()
	}

	this.remapMouse = function(node){
		
	}

	this.bindInputs = function(){
		this.keyboard.down = function(v){
			if(!this.focus_view) return
			if(!this.inModalChain(this.focus_view)) return
			this.focus_view.emit('keydown', v)
		}.bind(this)

		this.keyboard.up = function(v){
			if(!this.focus_view) return
			if(!this.inModalChain(this.focus_view)) return
			this.focus_view.emit('keyup', v)
		}.bind(this)

		this.keyboard.press = function(v){
			// lets reroute it to the element that has focus
			if(!this.focus_view) return
			if(!this.inModalChain(this.focus_view)) return
			this.focus_view.emit('keypress', v)
		}.bind(this)

		this.keyboard.paste = function(v){
			// lets reroute it to the element that has focus
			if(!this.focus_view) return
			if(!this.inModalChain(this.focus_view)) return
			this.focus_view.emit('keypaste', v)
		}.bind(this)

		this.mouse.move = function(){
			// ok so. lets query the renderer for the view thats under the mouse
			if(!this.mouse_capture){
				this.device.pickScreen(this.mouse.x, this.mouse.y).then(function(view){
					// result!
					//console.log(view.name)
					// ah so. we might need to do mouseover/mouseout
					if(this.mouse_view !== view){
						if(this.mouse_view) this.mouse_view.emit('mouseout', this.remapMouse(this.mouse_view))
						this.mouse_view = view
						this.mouse_view.emit('mouseover', this.remapMouse(this.mouse_view))
					}
					if(view) view.emit('mousemove', this.remapMouse(view))

				}.bind(this))
			}
		}.bind(this)

		this.mouse.leftdown = function(){
			
			if (this.mouse_capture === false) {
				this.mouse_capture = this.mouse_view
			} 
			// lets give this thing focus
			if (this.mouse_view){
				if(this.inModalChain(this.mouse_view)){
					this.setFocus(this.mouse_view)
					this.mouse_view.emit('mouseleftdown', this.remapMouse(this.mouse_view))
				}
				else if(this.modal){
					this.modal_miss = true
					this.modal.emit('miss', this.remapMouse(this.mouse_view))
				}
			} 
		}.bind(this)

		this.mouse.leftup = function(){ 
			if (this.mouse_view && this.inModalChain(this.mouse_view)) this.mouse_view.emit('mouseleftup', this.remapMouse(this.mouse_view))
			this.mouse_capture = false
		}.bind(this)
		/*
		this.mouse.click = function () {
			if(this.modal_miss){
				this.modal_miss = false
				return
			}
			if (this.lastmouseguid > 0) {
				if (this.uieventdebug){
					console.log(" clicked: " + this.guidmap[this.lastmouseguid].constructor.name);
				}
				var overnode = this.guidmap[this.lastmouseguid];
				if (this.inModalChain(overnode) && overnode && overnode.emit) overnode.emit('click')
			}
		}.bind(this)

		this.mouse.dblclick = function () {
			if(this.modal_miss){
				this.modal_miss = false
				return
			}			
			if (this.lastmouseguid > 0) {
				if (this.uieventdebug){
					console.log(" clicked: " + this.guidmap[this.lastmouseguid].constructor.name);
				}
				var overnode = this.guidmap[this.lastmouseguid];
				if (this.inModalChain(overnode) && overnode && overnode.emit) overnode.emit('dblclick')
			}
		}.bind(this)

		this.mouse.wheelx = function(){
			var overnode = this.guidmap[this.lastmouseguid]
			if(overnode && this.inModalChain(overnode)){
				while(overnode){
					if(overnode.hasListeners('mousewheelx')){
						overnode.emit('mousewheelx', this.mouse.wheelx)
						break
					}
					overnode = overnode.parent
				}
			}
		}.bind(this)

		this.mouse.wheely = function(){
			var overnode = this.guidmap[this.lastmouseguid]
			if(overnode && this.inModalChain(overnode)){
				while(overnode){
					if(overnode.hasListeners('mousewheely')){
						overnode.emit('mousewheely', this.mouse.wheely)
						break
					}
					overnode = overnode.parent
				}
			}
		}.bind(this)	
		*/
	}



	// Focus handling


	this.setFocus = function(view){
		if(this.focus_view !== view){
			var old = this.focus_view
			this.focus_view = view
			if(old) old.emit('focuslost')
			view.emit('focusget')
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


	// Modal handling


	this.inModalChain = function(node){
		if(!this.modal_stack.length) return true
		var last = this.modal_stack[this.modal_stack.length - 1]
		// lets check if any parent of node hits last
		var obj = node
		while(obj){
			if(obj === last) return true
			obj = obj.parent
		}
		return false
	}
	
	this.closeModal = function(value){
		if(this.modal && this.modal.resolve)
			return this.modal.resolve(value)
	}
	
	this.openModal = function(object){
		return new Promise(function(resolve, reject){
			Render.process(object, undefined, this.globals)
			object.parent = this
			this.children.push(object)
			this.modal_stack.push(object)
			this.modal = object

			object.resolve = function(value, rej){
				// lets close the modal window
				var id = this.screen.children.indexOf(this)
				this.screen.children.splice(id, 1)

				if(rej) reject(value)
				else resolve(value)

				var modal_stack = this.screen.modal_stack
				modal_stack.pop()
				this.screen.modal = modal_stack[modal_stack.length - 1]
				
				this.setDirty()
				this.emitRecursive("destroy")
				this.screen.setDirty(true)
			}

			object.reject = function(value){
				this.resolve(value, true)
			}

			object.reLayout()
			object.setDirty(true)
		}.bind(this))
	}



	// Location hash


	this.decodeLocationHash = function(){
		// lets split it on & into a=b pairs, 
		var obj = {}
		var parts = location.hash.slice(1).split(/\&/)
		for(var i = 0; i < parts.length; i++){
			var part = parts[i]
			var kv = part.split(/=/)
			if(kv.length === 1) obj[kv[0]] = true
			else{
				obj[kv[0]] = kv[1]
			}
		}
		this.locationhash = obj
	}

	// dont fire this one
	this.locationhash = function(obj){
		var str = ''
		for(var key in obj){
			var value = obj[key]
			if(str.length) str += '&'
			if(value === true) str += key
			else str += key + '=' + value
		}
		location.hash = '#' + str
	}

})
