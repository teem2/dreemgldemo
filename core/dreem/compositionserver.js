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
		teemserver){ //TeemServer: teem server object

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

	// Called when any of the dependent files change for this composition
	this.atChange = function(){
	}

	// Destroys all objects maintained by the composition
	this.destroy = function(){
		if(this.myteem && this.myteem.destroy) this.myteem.destroy()
		this.myteem = undefined
	}

	this.reload = function(){
		console.color("~bg~Reloading~~ composition\n")
		this.destroy()

		var dir = fs.readdirSync(define.expandVariables('$classes'))
		var system_classes = this.system_classes = {}
		for(var i = 0; i<dir.length; i++){
			var clsname = dir[i].replace(/\.js$/, '')
			system_classes[clsname] = '$classes/'+clsname
		}

		// lets fill 
		require.clearCache()

		// ok, we will need to compute the local classes thing
		define.system_classes = system_classes

		// lets scan for the composition name in our external
		// compositions directory
		this.index_mapped =
		this.index_real = '$compositions/' +this.name + '/index.js'

		var ext_real =  '$external/' + this.name + '/index.js'
		var ext_mapped = '/_external_/' + this.name + '/index.js'

		if(fs.existsSync(define.expandVariables(ext_real))){
			this.index_mapped = ext_mapped
			this.index_real = ext_real
		}

		// lets load up the teem nodejs part
		var TeemServer = require(this.index_real)
		
		this.teem = new TeemServer(this.busserver)
	}

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
			'    .unselectable{\n'+
			' 		-webkit-user-select: none;\n'+
  			'		-moz-user-select: none;\n'+
  			'		-user-select: none;\n'+
  			'    }\n'+
			'    body {background-color:black;margin:0;padding:0;height:100%;overflow:hidden;}\n'+
			'  </style>'+
			'  <script type="text/javascript">\n'+
			'    window.define = {\n'+
			'	   $rendermode:"gl",\n'+
			'      system_classes:' + JSON.stringify(this.system_classes) + ',\n' + 
			'      main:["$base/math", "' + boot + '"],\n'+
			'      atMain:function(require, modules){\n'+
			'		 define.global(require(modules[0]))\n'+
			'		 var TeemClient = require(modules[1])\n'+
			'        define.rootTeemClient = new TeemClient(define.rootTeemClient)\n'+
			'      }\n'+
			'    }\n'+
			'  </script>\n'+
			'  <script type="text/javascript" src="/define.js"></script>\n'+
			' </head>\n'+
			' <body class="unselectable">\n'+
			' </body>\n'+
			'</html>\n'
	}

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

		var header = {
			"Cache-control": "max-age=0",
			"Content-Type": "text/html"
		}
		//var screen = this.screens[app]
		var html = this.loadHTML(this.name, this.index_mapped)
		res.writeHead(200, header)
		res.write(html)
		res.end()
	}
})