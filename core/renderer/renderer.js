// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Reactive renderer

define.class(function(require, exports){

	var Node = require('$base/node')
	
	exports.defineGlobals = function(object, globals){
		for(var key in globals){
			Object.defineProperty(object, key, {writable:true, value:globals[key]})
		}
	}

	exports.mergeChildren = function(object, children, globals){
		// splat in the children
		var objchildren = object.children
		if(!objchildren) object.children = objchildren = []
		if(Array.isArray(children))
			objchildren.push.apply(object.children, children)
		else objchildren.push(children)

		// merge name
		for(var i = 0; i < objchildren.length; i++){
			// create child name shortcut
			var child = objchildren[i]
			var name = child.name || child.constructor.classname
			if(name !== undefined && !(name in object)) object[name] = child
		}
	}

	exports.render = function(object, parent, globals, rerender){
		//console.log(object)

		// set up property binding values
		Object.defineProperty(object, 'parent', {writable:true, value:parent})

		exports.defineGlobals(object, globals)

		// store the attribute dependencies
		object.atAttributeGet = function(key){
			// if we use an attribute that has a property binding, try to initialize it now
			if(this.isWired(key)){
				//var inits = []
				//this.connectBinding(key, inits)
				//for(var i = 0; i < inits.length; i++) inits[i]()
			}
			this[key] = function(){
				rerender(this)
			}
		}

		// define children
		object.children = object.render(parent)
		object.atAttributeGet = undefined
			
		//if(children) exports.mergeChildren(object, children)

		if(object.children) for(var i = 0; i < object.children.length; i++){
			
			var child = object.children[i]

			var name = child.name || child.constructor.classname
			if(name !== undefined && !(name in object)) object[name] = child

			this.render(child, object, globals, rerender)
		}
	}

	exports.connectWires = function(object, initarray){
		object.connectWires(initarray)
		if(object.children) for(var i = 0; i < object.children.length; i++){
			var child = object.children[i]
			this.connectWires(child, initarray)
		}
	}

	exports.fireInit = function(node){

		if(!node._init){
			node.emit('init',1)
		}
		node.emit('reinit')

		if(node.children) for(var i = 0; i < node.children.length; i++){
			this.fireInit(node.children[i])
		}

		node.atAttributeGet = undefined
	}

	exports.destroy = function(object, parent){
		// tear down all listener structures
		var obj = object
		while(obj){
			// emit a destroy
			obj.ondestroy.emit()

			var listeners = obj._proplisten
			if(listeners){
				for(var i = 0;i < listeners.length; i++){
					listeners[i]()
				}
				obj._proplisten = undefined
			}
			for(var key in obj){
				var attr = obj['attr_' + key]
				if(attr && attr.owner == obj){
					attr.removeAllListeners()
				} 
			}
			if(obj.child){
				for(var i =0; i<obj.child.length; i++){
					this.destroy(obj.child[i], obj)
				}
			}
			obj = obj.outer
		}
	}

	exports.dump = function(node, depth){
		var ret = ''
		if(!depth) depth = ''
		ret += depth + node.name + ': ' + node.constructor.name
		var outer = node.outer
		while(outer){
			ret += " - " + outer.constructor.name
			outer = outer.outer
		}
		if(node.children) for(var i = 0; i<node.children.length; i++){
			ret += "\n"
			ret += this.dump(node.children[i], depth +'-')
		}
		return ret
	}
})