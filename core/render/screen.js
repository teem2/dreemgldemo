// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
define.class(function(view, require) {
	
	var Text = require('./text')
	var FlexLayout = require('$lib/layout')

	var render = require('$render/render')

	this.atConstructor = function(){
	}

	this.init = function (previous) {
		if(previous){
		}
		else{
		}
	}

	// close top level modal view.
	// <value> the return value for the promise of the modal. 
	this.closeModal = function(value){
		if(this.modal && this.modal.resolve)
			return this.modal.resolve(value)
	}
	
	// show a modal view.
	this.openModal = function(object){
	// <object> a constructor function for a set of visual elements. Works the same as the render function.
		return new Promise(function(resolve, reject){
			render(object, undefined, this.globals)
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

	// check if a given node is available for interaction in the current modal chain.
	// <node> the node to be checked.
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
})
