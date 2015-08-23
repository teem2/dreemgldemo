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
		var last_children
		var cleanup
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
		else last_children = object.children
		
		for(var key in globals){
			object[key] = globals[key]
		}

		object.connectWires(wireinits)
		
		// lets call init only when not already called
		if(!object._init && (object.oninit || object._listen_init)){
			object.emit('init', 1)
		}
		if(object.onreinit || object._listen_onreinit)
			object.emit('reinit')

		// then call render
		function __atAttributeGet(){
			// we need to call re-render on this
			renderer(this, undefined, globals, true)
			this.setDirty(true)
			if(this.reLayout) this.reLayout()
		}

		// store the attribute dependencies
		object.atAttributeGet = function(key){
			// lets find out if we already have a listener on it
			if(!this.hasListenerName(key, '__atAttributeGet')){
				this.addListener(key, __atAttributeGet)
			}
		}

		object.reRender = __atAttributeGet
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
			new_child = new_children[i] = renderer(new_child, old_child, globals, false, wireinits)
	
			// set the childs name
			var name = new_child.name || new_child.constructor.name
			if(name !== undefined && !(name in object)) object[name] = new_child
		}
		if(old_children) for(;i<old_children.length;i++){
			old_children[i].emitRecursive('destroy')
		}
		if(last_children) for(var i = 0; i < last_children.length; i++){
			var last_child = last_children[i]
			if(new_children.indexOf(last_child) === -1){
				last_child.emitRecursive('destroy')
			}
		}

		if(init_wires){
			for(var i = 0; i < wireinits.length; i++){
				wireinits[i]()
			}
		}

		return object
	}

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