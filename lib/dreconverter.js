// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Dreem compiler processes .dre xml into JS

define(function(require, exports){
	
	var HTMLParser = require('$parsers/htmlparser')
	var ScriptError = require('$parsers/scripterror')
	var AstWalker = require('$parsers/astwalker')
	var math = require('$base/math')
	// lets inherit from AcornSerializer
	var astWalker = new AstWalker(require('$parsers/acorndef'))

	exports.charPos = function(source, line, col){
		var myline = 0, mycol = 0
		for(var i = 0; i < source.length; i++, mycol++){
			if(source.charCodeAt(i) == 10) myline++, mycol = 0
			if(myline > line) return i
			if(myline == line && col == mycol) return i
		}
		return -1
	}
	
	/* Supported languages, these are lazily loaded */
	exports.languages = {
		js:{
			compiler: require('$lib/acorn'),
			compile: function(string, args, deps){
				// this returns a compiled function or an error
				var head = 'function __parsetest__(' + args.join(',') + '){'
				var src = head + string + '}'
				try{ // we parse it just for errors
					var ast = this.compiler.parse(src)
					// lets register if we have awaits,
					// ifso replace em with yields.
					var awaits = []
					astWalker.AwaitExpression = function(node){
						awaits.push(node)
					}
					astWalker.Identifier = function(node, parent){
						if(parent.type === 'CallExpression' && parent.callee === node){
							if(!(node.name in math) && node.name !== 'value'){
								deps[node.name] = 1
							}
						}
					}
					astWalker.walk(ast)
				}
				catch(e){
					var at = exports.charPos(src, e.loc && e.loc.line - 1, e.loc && e.loc.column + 1)
					return new ScriptError(e.message, at - head.length)
				}
				// lets check if we have AwaitExpressions and replace those with yield

				return {
					code:string
				}
			}
		},
		coffee:{
			compiler: require('$lib/coffee-script'),
			compile: function(string, args){
				// compile the code
				try{
					var out = this.compiler.compile(string)
				}
				catch(e){ // we have an exception. throw it back
					return new ScriptError(e.message, exports.charPos(string, e.location && e.location.first_line, e.location && e.location.first_column))
				}
				// lets return the blob without the function headers
				return {
					code:out.split('\n').slice(1,-2).join('\n')
				}
			}
		}
	}

	/* Concats all the childnodes of a jsonxml node*/
	exports.concatCode = function(node){
		var out = ''
		var children = node.child
		if(!children || !children.length) return ''
		for(var i = 0; i<children.length;i++){
			var child = children[i]
			if(child.tag == '$text') out += child.value
			if(child.tag == '$cdata') out += child.value
		}
		return out
	}

	exports.default_deps = {
	}

	exports.classnameToJS = function(name){
		return name.replace(/-/g,'_')
	}

	exports.classnameToPath = function(name){
		return name.replace(/-/g,'/')
	}

	exports.classnameToBuild = function(name){
		return name.replace(/-/g,'.')
	}

	var attr_skip = {name:1, extends:1, with:1}

	exports.xmlToCode = function(value){
		if(value === undefined) return
		if(value === 'true' || value === 'false' || parseFloat(value) == value) return  value
		if(value.indexOf('vec2(') == 0 && value.match(/vec2\((?:\s*,\s*?[\.\d]+){1,2}\)/)){
			return value
		}
		if(value.indexOf('vec3(') == 0 && value.match(/vec3\((?:\s*,\s*?[\.\d]+){1,3}\)/)){
			return value
		}
		if(value.indexOf('vec4(') == 0 && value.match(/vec4\((?:\s*,\s*?[\.\d]+){1,4}\)/)){
			return value
		}
		if(value.charCodeAt(0) === 36 && value.charCodeAt(1) === 123){
			return "function(){return " + value.slice(2) + ".wired"
		}
		return '"' + String(value).replace(/"/g,'\\"') + '"'
	}

	exports.nameToKey = function(name){
		if(name.indexOf('.') !== -1){
			return '"' + name + '"'
		}
		return name
	}

	exports.compileAttributeConfig = function(attr){
		var config = ''
		for(var key in attr) if(key !== 'name'){
			var value = attr[key]
			if(config) config += ','
			if(key === 'type') config += 'type:' + value
			else config += key + ':' + this.xmlToCode(value)
		}
		return config
	}

	exports.compileClass = function(node, errors){

		var body = ''
		var deps = Object.create(this.default_deps)
		if(node.tag !== 'class' && node.tag !== 'mixin'){
			errors.push(new ScriptError('compileClass on non class', node.pos))
			return
		}

		// ok lets iterate the class children
		var clsname = node.attr && node.attr.name
		if(!clsname){
			errors.push(new ScriptError('Class has no name ', node.pos))
			return
		}

		var language = 'js'
		if (node.attr && node.attr.type) language = node.attr.type

		// lets fetch our base class
		var baseclass = 'node'
		deps['node'] = 1
		if(node.attr && node.attr.extends){
			if(node.attr.extends.indexOf(',') != -1){
				errors.push(new ScriptError('Cant use multiple baseclasses ',  node.pos))
				return
			}
			baseclass = node.attr.extends
			deps[baseclass] = 1
		}

		//body += //exports.classnameToJS(baseclass) + '.extend("' + clsname + '", function(){\n'

		if(node.attr && node.attr.with){
			node.attr.with.split(/,\s*|\s+/).forEach(function(cls){
				deps[cls] = 1
				body += '\tself.mixin('+exports.classnameToJS(cls)+')\n'
				return
			})
		}

		if(node.attr) for(var key in node.attr) if(!(key in attr_skip)){
			body += '\tself.' + key + ' = ' + this.xmlToCode(node.attr[key]) + '\n'
		}

		// ok lets compile a dreem class to a module
		var render = []
		if (node.child) for (var i = 0; i < node.child.length; i++) {
			var child = node.child[i]
			if (child.tag == 'attribute' || child.tag == 'method' || child.tag == 'handler' || child.tag == 'getter' || child.tag == 'setter'){
				var attrnameset = child.attr && (child.attr.name || child.attr.event)

				var attrnames = attrnameset.split( /,\s*|\s+/ )
				for(var j = 0; j < attrnames.length; j++){
					var attrname = attrnames[j]
					if(!attrname){
						errors.push(new ScriptError('Attribute has no name ', child.pos))
						return
					}
					if(child.tag === 'attribute'){
						var config = this.compileAttributeConfig(child.attr)
						if(attrname.indexOf('.') !== -1){
							var split = attrname.split('.')
							body += '\tself.'+split[0]+'.attribute("' + split[1] + '", {' +config+ '})\n'
						}
						else body += '\tself.attribute("' + attrname + '", {' +config+ '})\n'
					}
					else if(child.tag === 'event'){
						
					}
					else{
						var fn = this.compileMethod(child, node, language, errors, '\t', deps)
						if(!fn) continue
						if(errors.length) return
						var args = fn.args
						if(!args && child.tag == 'setter') args = ['value']
						body += '\tself.' + attrname +' = function(' + args.join(', ') + '){' + fn.body + '}\n'
					}
				}
			}
			else if(child.tag == 'require'){
				if(!child.attr || !child.attr.name){
					errors.push(new ScriptError('Require has no name', child.pos))
				}
				if(!child.attr || !child.attr.src){
					errors.push(new ScriptError('Require has no src attribute ', child.pos))
				}
				deps[child.attr.name] = child.attr.src || child.attr.href
			}
			else if(child.tag.charAt(0) != '$'){ // its our render-node
				var inst = this.compileInstance(child, errors, '\t\t\t')
				for(var key in inst.deps) deps[key] = 1
				render.push(inst.body)
			}
		}
		if(render.length){
			body += '\tself.render = function(){\n'
			if(render.length > 1){
				body += '\t\treturn [\n'
				for(var i = 0; i<render.length;i++){
					if(i) body += ',\n'
					body += '\t\t\t' + render[i]
				}
				body += '\n\t\t]\n'
			}
			else body += '\t\treturn ' + render[0] +'\n'
			body += '\t}\n'
		}



		return {
			baseclass:baseclass,
			name:clsname,
			deps:deps,
			body:body
		}
	}

	exports.compileMethod = function(node, parent, language, errors, indent, deps){
		language = language || 'js'

		if(node.attr && node.attr.type) language = node.attr.type
		
		// lets on-demand load the language
		var langproc = this.languages[language]
		if(!langproc){
			errors.push(new ScriptError('Unknown language used ' + language, node.pos))
			return {errors:errors}
		}

		// give the method a unique but human readable name
		var name = node.tag + '_' + (node.attr && node.attr.name) + '_' + node.pos + '_' + language
		if(parent && (parent.tag == 'class' || parent.tag == 'mixin')) name = (parent.attr && parent.attr.name) + '_' + name
		name = exports.classnameToJS(name)

		//node.method_id = output.methods.length
		var lang = this.languages[language]
		var args = node.attr && node.attr.args ? node.attr.args.split(/,\s*|\s+/): []
		var compiled = lang.compile(this.concatCode(node), args, deps)

		if(compiled instanceof ScriptError){ // the compiler returned an error
			compiled.where += node.child[0].pos
			errors.push(compiled)
			return
		}

		// lets re-indent this thing.
		var lines = compiled.code.split('\n')
		
		// lets scan for the shortest indentation which is not \n
		var shortest = Infinity
		for(var i = 0;i<lines.length;i++){
			var m = lines[i].match(/^( |\t)+/g)
			if(m && m[0].length){
				m = m[0]
				var len = m.length
				if(m.charCodeAt(0) == 32){
					// replace by tabs, just because.
					if(len&1) len ++ // use tabstop of 2 to fix up spaces
					len = len / 2
					lines[i] = Array(len + 1).join('\t') + lines[i].slice(m.length)
				}
				if(len < shortest && lines[i] !== '\n') shortest = len
			}
		}
		if(shortest != Infinity){
			for(var i = 0;i<lines.length;i++){
				if(i> 0 || lines[0].length !== 0)
					lines[i] = indent + lines[i].slice(shortest).replace(/( |\t)+$/g,'')
			}
			compiled.code = lines.join('\n')
		}

		return {
			name: name,
			args: args,
			await: compiled.await,
			body: compiled.code
		}
	}

	exports.compileInstance = function(node, errors, indent, onLocalClass){

		var deps = Object.create(this.default_deps)
		
		var walk = function(node, parent, indent, depth){
			deps[node.tag] = 1
			var myindent = indent + '\t'
			var props = '' 
			var children = ''

			if(node.attr) for(var key in node.attr){
				var value = node.attr[key]
				if(props) props += ',\n' + myindent
				else props = '{\n' + myindent
				props += this.nameToKey(key) + ':' + this.xmlToCode(value)
			}

			if (node.child) for (var i = 0; i < node.child.length; i++) {
				var child = node.child[i]
				
				if (child.tag == 'class' || child.tag == 'mixin') {
					// lets output a local class 
					if(onLocalClass) onLocalClass(child, errors)
					else errors.push(new ScriptError('Cant support class in this location', node.pos))
				}
				else if (child.tag == 'method' || child.tag == 'handler' || child.tag == 'getter' || child.tag == 'setter'){
					var fn = this.compileMethod(child, parent, 'js', errors, indent + '\t')
					if(!fn) continue
					if(!child.attr || (!child.attr.name && !child.attr.event)){
						errors.push(new ScriptError('code tag has no name', child.pos))
						continue
					}
					var attrnameset = child.attr.name || child.attr.event
					
					var attrnames = attrnameset.split(/,\s*|\s+/)
					for(var j = 0; j < attrnames.length; j++){
						var attrname = attrnames[j]

						if(props) props += ',\n' + myindent
						else props = '{\n' + myindent
						var pre = '', post = ''
						if(child.tag == 'getter') attrname = 'get_' + attrname
						else if(child.tag == 'setter') attrname = 'set_' + attrname

						if(child.tag == 'handler') attrname = 'handle_' + attrname
						props += this.nameToKey(attrname) + ': function(' + fn.args.join(', ') + '){' + fn.body + '}' 
					}
				}
				else if(child.tag == 'attribute'){
					if(!child.attr || !child.attr.name){
						errors.push(new ScriptError('attribute tag has no name', child.pos))
						continue
					}
					var config = exports.compileAttributeConfig(child.attr)
					if(props) props += ',\n' + myindent
					props += this.nameToKey('attr_' + child.attr.name) + ': {'  + config + '}'
 				} 
				else if(child.tag == 'require'){
					if(!child.attr || !child.attr.name){
						errors.push(new ScriptError('Require has no name', child.pos))
					}
					if(!child.attr || !child.attr.src){
						errors.push(new ScriptError('Require has no src attribute ', child.pos))
					}
					deps[child.attr.name] = child.attr.src || child.attr.href
				}
				else if(child.tag.charAt(0) != '$'){
					if(children) children += ',\n' + myindent
					else children = '\n' + myindent
					children += walk(child, node, myindent, depth + 1)
				}
			}
			var out = exports.classnameToJS(node.tag) + '('

			if(props){
				if(!children) out += props+'\n'+indent+'}'
				else out += props+'\n'+myindent+'}'
			}

			if(children){
				if(props) out += ','
				out += children
			}
			if (children){
				out += '\n' + indent
			}

			out += ')'

			return out

		}.bind(this)

		// Walk JSON
		var body =  walk(node, null, indent || '', 0)

		return {
			tag: node.tag,
			name: node.attr && node.attr.name || node.tag,
			deps: deps,
			body: body
		}
	}
})