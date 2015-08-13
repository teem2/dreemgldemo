// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Node class provides JSONML and attributes (events)

define.class(function(require, constructor){

	var Node = constructor

	var OneJSParser =  require('$parsers/onejsparser')
	var WiredWalker = require('$parsers/wiredwalker')

	var onejsparser = new OneJSParser()
	onejsparser.parser_cache = {}
	var wiredwalker = new WiredWalker()
	
	this._atConstructor = function(){
		// store the args for future reference
		var args = this.constructor_args = Array.prototype.slice.call(arguments)
		this.instance_children = []
		this.initFromConstructorArgs(args)
	}

	this.initFromConstructorArgs = function(args){
		var off = 0
		for(var i = 0; i < args.length; i++){
			var arg = args[i]
			if(typeof arg === 'object' && Object.getPrototypeOf(arg) === Object.prototype){
				this.initFromConstructorProps(arg)
				continue
			}
			if(typeof arg === 'function'){
				var prop = {}; prop[arg.name] = arg
				this.initFromConstructorProps(prop)
				continue
			}
			if(typeof arg === 'string' && i === 0){
				off = 1
				this.name = arg
				continue
			}
			if(typeof arg === 'number'){
				var o = i - off
				if(o === 0) this.x = arg
				else if(o === 1) this.y = arg
				else if(o === 2) this.w = arg
				else if(o === 3) this.h = arg
				continue
			}
			if(arg && arg.struct){
				var o = i - off
				if(o === 0) this.pos = arg
				if(o === 1) this.size = arg
				else this.bgcolor = arg
				continue
			}

			if(Array.isArray(arg)){
				this.initFromConstructorArgs(arg)
			}
			else if(arg !== undefined && typeof arg === 'object'){
				this.instance_children.push(arg)
				var name = arg.name || arg.constructor && arg.constructor.classname
				if(name !== undefined && !(name in this)) this[name] = arg
			}
		}		
	}

	this.initFromConstructorProps = function(obj){

		for(var key in obj){
			var prop = obj[key]
			var tgt = this
			var type = 0
		
			if(!this.constructor_props) this.constructor_props = {}
			this.constructor_props[key] = prop

			if(key.indexOf('attr_') === 0) key = key.slice(5), type = 1
			else if(key.indexOf('set_') === 0) key = key.slice(4), type = 2
			else if(key.indexOf('get_') === 0) key = key.slice(4), type = 3
			else if(key.indexOf('handle_') === 0) key = key.slice(7), type = 4

			var idx = key.indexOf('.')
			if(idx !== -1){
				tgt = this[key.slice(0,idx)]
				key = key.slice(idx + 1)
			}

			if(type === 1){
				tgt.attribute(key, prop)
			}
			else if(type === 2){
				if(!tgt.isAttribute(key)) tgt.attribute(key, {type:float})
				tgt['_set_' + key] = prop
			}
			else if(type === 3){
				if(!tgt.isAttribute(key)) tgt.attribute(key, {type:float})
				tgt['_get_' + key] = prop
			}
			else if(type === 4){
				if(!tgt.isAttribute(key)) tgt.attribute(key, {type:Object})
				tgt['on' + key] = prop
			}
			else tgt[key] = prop
		}
	}

	// render this node
	this.render = function(){
		return this.instance_children
	}

	// Mixes in another class
	this.mixin = function(){
		for(var i = 0; i < arguments.length; i++){
			var obj = arguments[i]
			if(typeof obj == 'function') obj = obj.prototype
			for(var key in obj){
				// copy over getters and setters
				if(obj.__lookupGetter__(key) || obj.__lookupSetter__(key)){
					// lets copy over this thing

				}
				else{
					// other
					this[key] = obj[key]
				}
			}
		}	
	}

	// finds overload of property me on key
	this.overloads = function(key, me){
		var proto = this
		var next
		while(proto){
			if(proto.hasOwnProperty(key)){
				var val = proto[key]
				if(next && val !== me) return val
				if(val === me) next = 1
			}
			proto = Object.getPrototypeOf(proto)
		}
	}

	// calls super (not super efficient)
	this.super = function(args){
		if(arguments.length == 0 || !args) throw new Error('Please pass the arguments object as first argument into call to super')
		// fetch the function
		var me = args.callee || args
		var fnargs = args
		// someone passed in replacement arguments
		if( arguments.length > 1 ) fnargs = Array.prototype.slice.call( arguments, 1 )
		// look up function name
		var name = me.__supername__
		if( name !== undefined ){ // we can find our overload directly
			var fn = this.overloads(name, me)
			if(fn && typeof fn == 'function') return fn.apply(this, fnargs)
		} 
		else { // we have to find our overload in the entire keyspace
			for(var key in this) if(!this.__lookupGetter__(key)){
				fn = this.overloads(key, me)
				if(fn && typeof fn == 'function') {
					me.__supername__ = key // store it for next time
					return fn.apply( this, fnargs )
				}
			}
		}
	}
	
	// hide a property
	this.hideProperty = function(){
		for(var i = 0; i<arguments.length; i++){
			var arg = arguments[i]
			if(Array.isArray(arg)){
				for(var j = 0; j<arg.length; j++){
					Object.defineProperty(this, arg[j],{enumerable:false, configurable:true, writeable:true})
				}
			}
			else{
				Object.defineProperty(this, arg,{enumerable:false, configurable:true, writeable:true})
			}
		}
	}

	// check if property is an attribute
	this.isAttribute = function(key){
		var setter = this.__lookupSetter__(key)
		if(setter !== undefined && setter.isAttribute) return true
		else return false
	}

	this.getAttributeConfig = function(key){
		return this['_cfg_' + key]
	}

	this.isWired = function(key){
		var wiredfn_key = '_wiredfn_' + key
		return wiredfn_key in this
	}
	
	this.wiredCall = function(key){
		var wiredcl_key = '_wiredcl_' + key
		return this[wiredcl_key]
	}

	// define a property to be an attribute
	this.event = function(key){
		this.attribute(key, {type:Object})
	}

	this.parse = function(key, value){

	}

	this.emit = function(key, value){
		var on_key = 'on' + key
		var listen_key = '_listen_' + key

		if(value !== undefined) this['_' + key] = value

		var proto = this
		var stack

		while(on_key in proto){
			if(proto.hasOwnProperty(on_key)) (stack || (stack = [])).push(proto[on_key])
			proto = Object.getPrototypeOf(proto)
		}

		if(stack !== undefined) for(var j = stack.length - 1; j >=0; j--){
			stack[j].call(this, value)
		}

		var proto = this
		while(listen_key in proto){
			if(proto.hasOwnProperty(listen_key)){
				var listeners = proto[listen_key]
				for(var j = 0; j < listeners.length; j++){
					listeners[j].call(this, value)
				}
			}
			proto = Object.getPrototypeOf(proto)
		}
	}

	this.addListener = function(key, cb){
		var listen_key = '_listen_' + key
		if(!this.hasOwnProperty(listen_key)) this[listen_key] = []
		this[listen_key].push(cb)
	}

	this.removeListener = function(key, cb){
		var listen_key = '_listen_' + key
		if(!this.hasOwnProperty(listen_key)) return
		var cbs = this[listen_key]
		if(cbs){
			if(cb){
				var idx = cbs.indexOf(cb)
				if(idx !== -1) cbs.splice(idx,1)
			}
			else{
				cbs.length = 0
			}
		}
	}

	this.hasListeners = function(key){
		var listen_key = '_listen_' + key
		var on_key = 'on' + key
		if(on_key in this || listen_key in this) return true
		return false
	}

	this.removeAllListeners = function(){
		var keys = Object.keys(this)
		for(var i = 0; i < keys.length; i++){
			var key = keys[i]
			if(key.indexOf('_listen_') === 0){
				this[key] = undefined
			}
		}
	}

	this.setAttribute = function(key, value){
		this[key] = value
	}

	this.attribute = function(key, config){
		// lets create an attribute
		var value_key = '_' + key
		var on_key = 'on' + key
		var listen_key = '_listen_' + key
		var wiredfn_key = '_wiredfn_' + key
		var config_key = '_cfg_' + key 
		var get_key = '_get_' + key
		var set_key = '_set_' + key

		if(this.isAttribute(key)){ // extend the config
			var obj = this[config_key] = Object.create(this[config_key])
			for(var prop in config){
				obj[prop] = config[prop]
			}
			return
		}

		var init_value = this[key] || config.value
		if(init_value !== undefined && init_value !== null){
			if(typeof init_value === 'function') this[init_value.isWired? wiredfn_key: on_key] = init_value
			else this[value_key] = config.type(init_value)
		}
		this[config_key] = config
		
		if(config.wired) this[wiredfn_key] = config.wired

		var setter
		var getter
		// define attribute gettersetters
		if(config.storage){
			var storage_key = '_' + config.storage
			
			setter = function(value){
				if(this[set_key] !== undefined) value = this[set_key](value)
				if(typeof value === 'function') return this[value.isWired? wiredfn_key: on_key] = value

				if(!this.hasOwnProperty(storage_key)){
					var store = this[storage_key]
					store = this[storage_key] = store.struct(store)
				}
				else{
					store = this[storage_key]
				}
				var config = this[config_key]
				if(config.motion && this.startMotion(key, value)) return

				this[value_key] = store[config.index] = value

				this.emit(config.storage, store)

				if(this.atAttributeSet !== undefined) this.atAttributeSet(key, value)
				if(on_key in this || listen_key in this) this.emit(key, value)
			}

			this.addListener(config.storage, function(value){
				var myval = this[value_key] = value[config.index]
				if(on_key in this || listen_key in this)  this.emit(key, myval)
			})
			// initialize value
			this[value_key] = this[storage_key][config.index]
		}
		else if(config.type.primitive){
			setter = function(value){
				if(this[set_key] !== undefined) value = this[set_key](value)
				if(typeof value === 'function') return this[value.isWired? wiredfn_key: on_key] = value

				var config = this[config_key]
				value = config.type(value)

				if(config.motion  && this.startMotion(key, value)) return

				this[value_key] = config.type(value)
				
				if(this.atAttributeSet !== undefined) this.atAttributeSet(key, value)
				if(on_key in this || listen_key in this)  this.emit(key, value)
			}
		}
		else{
			setter = function(value){
				if(this[set_key] !== undefined) value = this[set_key](value)
				if(typeof value === 'function') return this[value.isWired? wiredfn_key: on_key] = value
				
				var config = this[config_key]

				value = config.type(value)

				if(config.motion && this.startMotion(key, value)) return
				
				this[value_key] = value

				if(this.atAttributeSet !== undefined) this.atAttributeSet(key, value)
				if(on_key in this || listen_key in this)  this.emit(key, value)
			}
		}
		
		setter.isAttribute = true
		Object.defineProperty(this, key, {
			configurable:true,
			enumerable:true,
			get: function(){
				if(this.atAttributeGet !== undefined) this.atAttributeGet(key)
				var getter = this[get_key]
				if(getter !== undefined) return getter()
				// lets check if we need to map our stored type
				return this[value_key]
			},
			set: setter
		})
	}

	this.connectWiredAttribute = function(key, initarray){
		var wiredfn_key = '_wiredfn_' + key
		var wiredcl_key = '_wiredcl_' + key
		var wiredfn = this[wiredfn_key]

		var ast = onejsparser.parse(wiredfn.toString())
		var state = wiredwalker.newState()

		wiredwalker.expand(ast, null, state)

		var bindcall = function(){
			var deps = bindcall.deps
			if(deps && !bindcall.initialized){
				bindcall.initialized = true
				for(var i = 0; i < deps.length; i++) deps[i]()
			}
			this[key] = this[wiredfn_key].call(this)
		}.bind(this)

		this[wiredcl_key] = bindcall

		for(var j = 0; j < state.references.length; j++){
			var ref = state.references[j]
			var obj = {'this':this}
			for(var k = 0; k < ref.length; k++){

				var part = ref[k]
				if(k === ref.length - 1){
					// lets add a listener 
					if(!obj.isAttribute(part)){
						console.log("Attribute does not exist: "+ref.join('.')+" in wiring " + this[wiredfn_key].toString())
						continue
					}
					obj.addListener(part, bindcall)

					if(obj.isWired(part) && !obj.wiredCall(part)){
						obj.connectWiredAttribute(part)
						if(!bindcall.deps) bindcall.deps = []
						bindcall.deps.push(obj.wiredCall(part))
					}
				}
				else{
					var newobj = obj[part]

					if(!newobj){
						if(obj === this){ // lets make an alias on this, scan the parent chain
							while(obj){
								if(part in obj){
									if(part in this) console.log("Aliasing error with "+part)
									//console.log("ALIASING" + part, this)
									obj = this[part] = obj[part]
									break
								}
								obj = obj.parent
								if(obj === obj.parent) obj = undefined
							}
						}
					}	
					else obj = newobj
					if(!obj) console.log('Cannot find part ' + part + ' in ' + ref.join('.') + ' in propertybind', this)
				}
			}
		}
		if(initarray) initarray.push(bindcall)
	}

	this.connectWires = function(initarray, depth){
		var immediate = false
		if(!initarray) initarray = [], immediate = true

		for(key in this) if(key.indexOf('_wiredfn_') === 0){
			this.connectWiredAttribute(key.slice(9), initarray)
		}
		// lets initialize bindings on all nested classes
		var nested = this.constructor.nested
		if(nested) for(var name in nested){
			var nest = this[name.toLowerCase()]
			if(nest.connectWires){
				nest.connectWires(initarray, depth)
			}
		}
		if(immediate === true){
			for(var i = 0; i < initarray.length; i++){
				initarray[i]()
			}
		}
	}

	this.disconnectWires = function(){
	}

	this.startMotion = function(key, value){
		if(!this.screen) return false 
		return this.screen.startMotion(this, key, value)
	}

	this.constructorPropsEqual = function(other){
		var str = ''
		var my_prop = this.constructor_props
		var other_prop = other.constructor_props
		if(!my_prop && other_prop) return false
		if(!other_prop && my_prop) return false
		if(!other_prop && !my_prop) return true
		for(var key in my_prop){
			var arg1 = my_prop[key]
			var arg2 = other_prop[key]

			if(typeof arg1 !== typeof arg2) return false
			
			if(typeof arg1 == 'function'){
				if(arg1.toString() !== arg2.toString()) return false
			}
			else if(typeof arg1 === 'object'){
				if(arg1.struct){
					if(arg1.length !== arg2.length) return false
					for(var i = 0; i < arg1.length; i++){
						if(arg1[i] !== arg2[i]) return false
					}
				}
				else if(arg1 !== arg2) return false
			}
			else{
				if(arg1 !== arg2) return false
			}
		}
		return true
	}

	// lets diff ourselves and children
	this.diff = function(other, globals){
		if(!other) return this

		// diff children set
		var my_children = this.children
		var other_children = other.children

		// diff my children
		if(other_children){
			var i = 0
			if(my_children) for(; i < my_children.length; i++){
				my_children[i] = my_children[i].diff(other_children[i], globals)
			}
			// clear out whatever is left
			if(other_children) for(; i < other_children.length; i++){
				var child = other_children[i]
				child.emit('destroy')
			}
		}
		// check if we changed class
		if(define.classHash(this.constructor) === define.classHash(other.constructor) && this.constructorPropsEqual(other)){
			other.children = my_children
			if(my_children) for(i = 0; i < my_children.length; i++) my_children[i].parent = other
			this.emit('destroy')
			if(globals) for(var key in globals){
				other[key] = globals[key]
			}
			return other
		}
		else{
			if(my_children) for(i = 0; i < my_children.length; i++) my_children[i].parent = this
		}

		other.emit('destroy')
		return this		
	}

	this.hideProperty(Object.keys(this))

	// always define an init event
	this.event("init")

	// and a destroy event
	this.event("destroy")
})