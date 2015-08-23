// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Reactive renderer

define.class(function(require, exports, module){

	var Node = require('$base/node')

	module.exports = function renderer(new_version, old_version, globals, skip_old, wireinits){
		var init_wires = false
		if(!wireinits){
			wireinits = []
			init_wires = true
		}

		var object = new_version
		var old_children
		if(old_version){
			if(!skip_old && define.classHash(new_version.constructor) === define.classHash(old_version.constructor) && new_version.constructorPropsEqual(old_version)){
				// old_version is identical. lets reuse it.
				object = old_version
				old_children = object.children
				// but use new versions instance children
				old_version.instance_children = new_version.instance_children
			}
			else{ // we are going to use new_version. lets copy _state properties
				object = new_version
				
				if(new_version !== old_version){
					old_children = object.children
					for(var key in new_version._state){
						new_version[key] = old_version[key]
					}
					old_version.emit('destroy')
				}
			}
		}
		else old_children = new_version.children
		
		for(var key in globals){
			object[key] = globals[key]
		}

		object.connectWires(wireinits)
		
		// lets call init only when not already called
		if(!object._init) object.emit('init', 1)
		object.emit('reinit')

		// then call render

		// store the attribute dependencies
		object.atAttributeGet = function(key){
			// lets find out if we already have a listener on it
			if(!this.hasListenerName(key, '__atAttributeGet')){
				this[key] = function __atAttributeGet(){
					// we need to call re-render on this
					renderer(this, undefined, globals, true)
					this.setDirty(true)
					if(this.reLayout) this.reLayout()
				}
			}
		}
		object.children = object.render()
		object.atAttributeGet = undefined

		if(!Array.isArray(object.children) && object.children) object.children = [object.children]
		var new_children = object.children

		if(new_children) for(var i = 0; i < new_children.length; i++){
			var new_child = new_children[i]

			if(Array.isArray(new_child)){ // splice in the children
				var args = Array.prototype.slice.call(new_child)
				args.unshift(1)
				args.unshift(i)
				Array.prototype.splice.apply(new_children, args)
				i-- // hop back one i so we repeat
				continue
			}

			var old_child = undefined
			if(old_children){
				old_child = old_children[i]
				if(old_child) old_child.parent = object
			}
			new_child.parent = object
			// render new child
			new_child = new_children[i] = renderer(new_child, old_child, globals)
	
			// set the childs name
			var name = new_child.name || new_child.constructor.name
			if(name !== undefined && !(name in object)) object[name] = new_child
		}
		if(old_children) for(;i<old_children.length;i++){
			console.log('emitting destroy!')
			old_children[i].emitRecursive('destroy')
		}

		if(init_wires){
			for(var i = 0; i < wireinits.length; i++){
				wireinits[i]()
			}
		}

		return object
	}
/*
	// lets diff ourselves and children
	renderer.diff = function(new_version, old_version, globals){
		
		if(!old_version) return new_version
		
		// diff children set
		var new_children = newversion.children
		var old_children = oldversion.children

		// diff my children
		if(old_children){
			var i = 0
			if(new_children) for(; i < new_children.length; i++){
				renderer.diff(new_children[i], old_children[i], globals)
			}
			// clear out whatever is left
			if(old_children) for(; i < old_children.length; i++){
				var child = old_children[i]
				child.emit('destroy')
			}
		}
		// check if we changed class
		if(define.classHash(new_version.constructor) === define.classHash(old_version.constructor) && new_version.constructorPropsEqual(old_version)){
			old_version.children = new_children
			if(new_children) for(i = 0; i < new_children.length; i++) new_children[i].parent = other
			this.emit('destroy')
			if(globals) for(var key in globals){
				other[key] = globals[key]
			}
		
			return other
		}
		else{
			if(new_children) for(i = 0; i < new_children.length; i++) new_children[i].parent = this
		}
		
		if (this._state){
			for(var key in this._state){
				this[key] = other[key];
			}
		}
		
		other.emit('destroy')
		return this		
	}

	renderer.renderDiff = function(object, parent, previous, globals){

		// render our object
		renderer.render(object, parent, globals, function rerender(what){
			// lets rerender it
			var old = Object.create(what)
			old.children = what.children
			what.children = []

			renderer.render(what, what.parent, globals, rerender.bind(this))

			// lets diff them
			renderer.diff(what, old, globals)
			for(var i = 0; i < what.children.length; i++){
				what.children[i].parent = what
			}
			
			var wireinits = []
			renderer.connectWires(what, wireinits)
			renderer.fireInit(what)

			for(var i = 0; i < wireinits.length; i++){
				wireinits[i]()
			}
			what.setDirty(true)
			if (what.reLayout) what.reLayout()
			// do this?
			//what.screen.performLayout()
		}.bind(this))
		
		// diff it
		if(previous){
			object = renderer.diff(object, previous, globals)
		}

		var wireinits = []
		renderer.connectWires(object, wireinits)

		renderer.fireInit(object)

		for(var i = 0; i < wireinits.length; i++){
			wireinits[i]()
		}

		if(globals.screen.atLoad) globals.screen.atLoad()

		return object
	}



	renderer.render = function(object, parent, globals, rerender){
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

		if(!Array.isArray(object.children) && object.children) object.children = [object.children]
		//if(children) exports.mergeChildren(object, children)

		if(object.children) for(var i = 0; i < object.children.length; i++){
			var child = object.children[i]
			if(Array.isArray(child)){ // splice in the children
				var args = Array.prototype.slice.call(child)
				args.unshift(1)
				args.unshift(i)
				Array.prototype.splice.apply(object.children, args)
				i-- // hop back one i so we repeat
				continue
			}

			var name = child.name || child.constructor.classname
			if(name !== undefined && !(name in object)) object[name] = child

			this.render(child, object, globals, rerender)
		}

		if(globals.screen){
			if(!globals.screen.atRender){
				console.log("Main class is likely not a screen, please make it the first argument of your dependency class list")
			}
			globals.screen.atRender(object)
		}
	}

	renderer.defineGlobals = function(object, globals){
		for(var key in globals){
			Object.defineProperty(object, key, {writable:true, value:globals[key]})
		}
	}

	renderer.mergeChildren = function(object, children, globals){
		// splat in the children
		var objchildren = object.children
		if(!objchildren) object.children = objchildren = []
		if(Array.isArray(children)){
			objchildren.push.apply(object.children, children)
		}
		else objchildren.push(children)

		// merge name
		for(var i = 0; i < objchildren.length; i++){
			// create child name shortcut
			var child = objchildren[i]
			var name = child.name || child.constructor.classname
			if(name !== undefined && !(name in object)) object[name] = child
		}
	}


	renderer.connectWires = function(object, initarray){
		object.connectWires(initarray)
		if(object.children) for(var i = 0; i < object.children.length; i++){
			var child = object.children[i]
			this.connectWires(child, initarray)
		}
	}

	renderer.fireInit = function(node){

		if(!node._init){
			node.emit('init',1)
		}
		node.emit('reinit')

		if(node.children) for(var i = 0; i < node.children.length; i++){
			this.fireInit(node.children[i])
		}

		node.atAttributeGet = undefined
	}
	
	renderer.destroy = function(object, parent){
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
	}()*/

	module.exports.dump = function(node, depth){
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