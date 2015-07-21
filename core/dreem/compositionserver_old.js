// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// parse a color string into a [r,g,b] 0-1 float array

define.class(function(require){

	var path = require('path')
	var fs = require('fs')

	var ExternalApps = require('$server/externalapps')
	var BusServer = require('$rpc/busserver')
	var FileWatcher = require('$server/filewatcher')
	var HTMLParser = require('$parsers/htmlparser')
	var ScriptError = require('$parsers/scripterror')
	var dreem_compiler = require('$dreem/dreemcompiler')
	var legacy_support = 0

	this.atConstructor = function(
		args, //Object: Process arguments
		name, //String: name of the composition
		teemserver ){ //TeemServer: teem server object

		this.teemserver = teemserver
	 	this.args = args
		this.name = name

		this.busserver = new BusServer()
		this.watcher = new FileWatcher()
		this.watcher.atChange = function(){
			// lets reload this app
			this.reload()
		}.bind(this)

		this.components = {}
		// lets compile and run the dreem composition
		define.atRequire = function(filename){
			// ignore build output
			if(filename.indexOf(define.expandVariables('$build')) == 0){
				return
			}
			// lets output to the main watcher
			// process.stderr.write('\x0F!'+filename+'\n', function(){})
			this.watcher.watch(filename)
		}.bind(this)
		//
		this.reload()
	}

	// Shows error array and responds with notifications/opening editors
 	this.showErrors = function(
		errors, //Array: errors
		filepath, //String: path
		source){ //String: sourecode

		var w = 0
		if(!Array.isArray(errors)) errors = [errors]
		errors.forEach(function(err){
			err.expand(define.expandVariables(filepath), source)
			console.color("~br~ Error ~y~" + err.path + "~bg~" + (err.line!==undefined?":"+ err.line + (err.col?":" + err.col:""):"")+"~~ "+err.message+"\n")
			if(!err.path) w++
		})
		if(!errors[w]) return
		if(this.args['-notify']){
			ExternalApps.notify('Exception',errors[w].message)
		}
		if(this.args['-edit']){
			if(fs.existsSync(errors[w].path)){
				ExternalApps.editor(errors[w].path, errors[w].line, errors[w].col - 1)
			}
		}
	}

	// Called when any of the dependent files change for this composition
	this.atChange = function(){
	}

	// Destroys all objects maintained by the composition
	this.destroy = function(){
		if(this.myteem && this.myteem.destroy) this.myteem.destroy()
		this.myteem = undefined
	}

	this.parseDreSync = function(drefile, errors){
		// read our composition file
		try{
			var data = fs.readFileSync(define.expandVariables(drefile))
		}
		catch(e){
			errors.push(new ScriptError(e.toString()))
			return
		}
		// watch it
		this.watcher.watch(drefile)
		
		// and then showErrors
		var htmlParser = new HTMLParser()
		var source = data.toString()
		var jsobj = htmlParser.parse(source)

		// forward the parser errors 
		if(htmlParser.errors.length){
			var err = htmlParser.errors.map(function(e){
				errors.push(new ScriptError(e.message, e.where))
			})
		}

		jsobj.source = source

		return jsobj
	}

    this.lookupDep = function(classname, compname, errors){
		if(classname in this.local_classes){
			// lets scan the -project subdirectories
			return '$build/compositions.' + compname + '.dre.' + classname + '.js'
		}
		var extpath = define.expandVariables(define.$extlib)
		if(fs.existsSync(extpath)){
			try{
				var dir = fs.readdirSync(extpath)
				var paths = []
				dir.forEach(function(value){
					paths.push('$extlib/' + value)
					paths.push('$extlib/' + value + '/classes')
				})
			}
			catch(e){
				var paths = []
			}
		}
		else{
			var paths = []
		}

		paths.unshift('$classes')
		if(classname == 'node') paths.unshift('$base')

		for(var i = 0;i < paths.length; i++){
			var drefile = paths[i] + '/' + dreem_compiler.classnameToPath(classname) + '.dre'
			var jsfile =  paths[i] + '/' + dreem_compiler.classnameToPath(classname) + '.js'
			var ignore_watch = false
			if(fs.existsSync(define.expandVariables(drefile))){
				if(!this.compile_once[drefile]){
					// lets parse and compile this dre file
					var local_err = []
					var dre = this.parseDreSync(drefile, local_err)
					var root
					if(!dre.child){
						return ''
					}
					for(var j = 0; j < dre.child.length; j++){
						var tag = dre.child[j].tag
						if(tag == 'class' || tag == 'mixin') root = dre.child[j]
					}
					if(root && (!root.attr || !root.attr.legacy)){ // lets output this class
						jsfile = "$build/" + paths[i].replace(/\//g,'.').replace(/\$/g,'').toLowerCase()+'.'+ dreem_compiler.classnameToBuild(classname) + ".js"
						this.compile_once[drefile] = jsfile;
						this.compileAndWriteDreToJS(root, jsfile, null, local_err)
						ignore_watch = true
					}
					if(local_err.length){
						this.showErrors(local_err, drefile, dre.source)
					}
				}
				else jsfile = this.compile_once[drefile];
			}
			
			if(fs.existsSync(define.expandVariables(jsfile)))
			{
				if(!ignore_watch) this.watcher.watch(jsfile)
				return jsfile
			}
		}
		
		console.color("~br~Error~~ finding class " + classname + '\n')
    }

	this.makeLocalDeps = function(deps, compname, indent, errors){
		var out = ''
		for(var key in deps){
			if(deps[key] !== 1){
				var incpath = deps[key]
			}
			else{
				var incpath = this.lookupDep(key, compname, errors)
				this.classmap[key] = incpath
			}
			if(incpath){
				out += indent + 'var ' + dreem_compiler.classnameToJS(key) + ' = require("' + incpath + '")\n'
			}
		}
		if(out) return out +'\n'
		return out
    }

	this.compileAndWriteDreToJS = function(jsxml, filename, compname, errors){

		var js = dreem_compiler.compileClass(jsxml, errors)
		if(!js) return
		// write out our composition classes
		// ok we have resolve our loca
		var basepath = this.lookupDep(js.baseclass)
		var out = 'define.class("' + basepath + '", function(require, exports, self, Base){\n' 
		out += this.makeLocalDeps(js.deps, compname, '\t', errors)
		out += js.body + '\n})'
		try{
			fs.writeFileSync(define.expandVariables(filename), out)
		}
		catch(e){
			errors.push(new ScriptError(e.toString()))
		}
		return js.name
    }

	this.compileLocalClass = function(cls, errors){
		var classname = cls.attr && cls.attr.name || 'unknown'
		this.compileAndWriteDreToJS(cls, '$build/compositions.' + this.name + '.dre.' + classname + '.js' , this.name,  errors)
		this.local_classes[classname] = 1
	}
	/*
	this.reload = function(){
		console.color("~bg~Reloading~~ composition\n")
		this.destroy()

		var dir = fs.readdirSync(define.expandVariables('$compositions/' + this.name))
		var local_classes = this.local_classes = {}
		for(var i = 0; i<dir.length; i++){
			var clsname = dir[i].replace(/\.js$/, '')
			local_classes[clsname] = '$compositions/'+clsname
		}

		// lets fill 
		require.clearCache()

		// lets load up the teem server!
		var TeemServer = require('$compositions/' + this.name + '/index.js')
		new TeemServer()
	}*/

	// reload composition
	
	this.reload = function(){
		console.color("~bg~Reloading~~ composition\n")
		this.destroy()

		this.local_classes = {}
		this.compile_once = {}
		this.components = {}
		this.screens = {}
		this.modules = []
		this.classmap = {}
		
		// scan our EXTLIB for compositions firstƒ
		var filepath = '$compositions/' + this.name + '.dre'

		if(define.EXTLIB){
			var extpath = define.expandVariables(define.EXTLIB)
			if(fs.existsSync(extpath)){
				var dir = fs.readdirSync(extpath)
				for(var i = 0; i<dir.length; i++){
					var mypath = '$extlib/' + dir[i] + '/compositions/' + this.name + '.dre'
					if(fs.existsSync(define.expandVariables(mypath))){
						filepath = mypath
						break
					}
				}
			} 
		}

		var errors = []

		var dre = this.parseDreSync(filepath, errors)
		if(errors.length) return this.showErrors(errors, filepath, dre && dre.source)

		// lets walk the XML and spawn up our composition objects.
		var root
		for(var i = 0;i<dre.child.length; i++){
			if(dre.child[i].tag == 'composition') root = dre.child[i]
		}
		
		if(!root || root.tag != 'composition') return this.showErrors(new ScriptError('Root tag is not composition', root.pos), filepath, dre.source)

		for(var child_i = 0; child_i<root.child.length; child_i++){
			var child = root.child[child_i]
			// ok lets spawn up our tags into our local object pool.
			var tag = child.tag
			if(tag.charAt(0) == '$') continue

			// todo, remove local classes, compositions will be directories
			if(tag == 'classes'){ // generate local classes
				// lets compile our local classes
				if(child.child) for(var classes_i = 0; classes_i < child.child.length; classes_i++){
					this.compileLocalClass(child.child[classes_i], errors)
				}
				continue
			}
			
			// lets compile the JS
			var js = dreem_compiler.compileInstance(child, errors, '\t\t', this.compileLocalClass.bind(this))

			// ok now the instances..
			var out = 'define(function(require){\n' 
			out += this.makeLocalDeps(js.deps, this.name, '\t', errors)
			out += '\n\treturn function(){\n\t\treturn ' + js.body + '\n\t}\n'
			out += '})'

			if(js.tag === 'screens'){
				var component = "$build/compositions." + this.name + '.dre.screens.js' 
			}
			else{
				var collide = ''
				while(this.components[js.name + collide]){
					if(collide === '') collide = 1
					else collide++
				}
				js.name += collide
				this.components[js.name] = 1
				var component = "$build/compositions." + this.name +  '.dre.' + js.tag + '.' + js.name + '.js'
			}

			fs.writeFileSync(define.expandVariables(component), out)
		
			this.modules.push({
				jsxml:child,
				name: js.name,// the base name of the component
				path: component
			})

			// if we compile a screen, we need to compile the children in screens separate
			if(js.tag == 'screens'){
				if(child.child) for(var screen_i = 0; screen_i < child.child.length; screen_i++){
					var screen = child.child[screen_i]

					if(screen.tag !== 'screen') continue
					var sjs = dreem_compiler.compileInstance(screen, errors, '\t\t', this.compileLocalClass.bind(this))

					// ok now the instances..
					var out = 'define(function(require){\n' 
					out += this.makeLocalDeps(sjs.deps, this.name, '\t', errors)
					out += '\treturn function(){\n\t\treturn ' + sjs.body + '\n\t}\n'
					out += '})'

					var component = "$build/compositions." + this.name + '.dre.screens.' + sjs.name + '.js'
					fs.writeFileSync(define.expandVariables(component), out)

					this.screens[sjs.name] = screen
				}
			}

			if(errors.length) return this.showErrors(errors, filepath, dre.source)
		}

		// require our teem tag
		try{
			require.clearCache()
			var TeemServer = require('$dreem/teem_nodejs.js')
			this.myteem = new TeemServer(this.modules, this.busserver)
		}
		catch(e){
			console.error(e.stack + '\x0E')
		}
		// send a reload on the busserver
		//if(define.onMain) define.onMain(this.modules, this.busserver)
	}
	//*/
		
	this.loadHTML = function(title, boot){
		return '<html lang="en">\n'+
			' <head>\n'+
			'  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n'+
			'  <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">\n'+
			'  <meta name="apple-mobile-web-app-capable" content="yes">\n'+
			'  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'+	
			'  <meta name="format-detection" content="telephone=no">\n'+
			'  <title>' + title + '</title>\n'+
			'  <style>\n'+ 
			'    body {background-color:black;margin:0;padding:0;height:100%;overflow:hidden;}\n'+
			'   </style>'+
			'  <script type="text/javascript">\n'+
			'    window.define = {\n'+
			'	   $rendermode:"gl",\n'+
			'      main:["$base/math", "$dreem/teem_browser", "' + boot + '"],\n'+
			'      atMain:function(require, modules){\n'+
			'		 define.global(require(modules[0]))\n'+
			'		 var Teem = require(modules[1])\n'+
			'        new Teem(require(modules[2]))\n'+
			'      }\n'+
			'    }\n'+
			'  </script>\n'+
			'  <script type="text/javascript" src="/define.js"></script>\n'+
			' </head>\n'+
			' <body>\n'+
			' </body>\n'+
			'</html>\n'
	}
/*
	this.loadHTML2 = function(){
		return '<html lang="en">\n' +
			' <head>\n' +
			'  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n' +
			'  <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">\n'+
			'  <meta name="apple-mobile-web-app-capable" content="yes">\n' +
			'  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n' +	
			'  <meta name="format-detection" content="telephone=no">\n' +
			'  <title>' + this.title + '</title>\n' +
			'  <style>\n' + 
			'    body {background-color:black;margin:0;padding:0;height:100%;overflow:hidden;}\n' +
			'   </style>' +
			'   <script type="text/javascript">\n' +
			'     window.define = {\n' +
			'	    $rendermode: "gl",\n' +
			'		local_classes: ' + JSON.stringify(this.local_classes) + '\n' +
			'       main: ["$base/math", "$compositions/' + this.name + '/index"],\n' +
			'       atMain: function(require, modules){\n' +
			'         define.global(require(modules[0]))\n' +
			'         var Teem = require(modules[1])\n' +
			'         new Teem()\n' +
			'      }\n' +
			'    }\n' +
			'  </script>\n' +
			'  <script type="text/javascript" src="/define.js"></script>\n'+
			' </head>\n'+
			' <body>\n'+
			' </body>\n'+
			'</html>\n'
	}
*/
	this.request = function(req, res){
		var app = req.url.split('/')[2] || 'browser'
		// ok lets serve our Composition device 

		if(req.method == 'POST'){
			// lets do an RPC call
			var buf = ''
			req.on('data', function(data){buf += data.toString()})
			req.on('end', function(){
				try{
					var json = JSON.parse(buf)
					this.myteem.postAPI(json, {send:function(msg){
						res.writeHead(200, {"Content-Type":"text/json"})
						res.write(JSON.stringify(msg))
						res.end()
					}})
				}
				catch(e){
					res.writeHead(500, {"Content-Type": "text/html"})
					res.write('FAIL')
					res.end()
					return
				}
			}.bind(this))
			return
		}

		/*()
		if(app == 'dali'){
			var stream = fs.createReadStream(define.expandVariables('$build/compositions.' + this.name + '.dre.screens.dali.dali.js'))
			res.writeHead(200, {"Content-Type": "text/html"})
			stream.pipe(res)
			return
		}*/

		var header = {
			"Cache-control": "max-age=0",
			"Content-Type": "text/html"
		}
		var screen = this.screens[app]
		var html = this.loadHTML(screen.attr && screen.attr.title || this.name, '$build/compositions.' + this.name + '.dre.screens.' + app + '.js')

		res.writeHead(200, header)
		res.write(html)
		res.end()
	}
})