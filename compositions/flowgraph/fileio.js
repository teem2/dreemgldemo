define.class(function(require, server){

	var nodehttp = require('$server/nodehttp')
	var fs = require('fs')
	var path = require('path')

	this.init = function(){
		
	}

	this.readfile = function(name){
		try{
			return fs.readFileSync(path.join(define.expandVariables(define.$root), name)).toString()
		}
		catch(e){
			return null
		}
	}

	this.writefile = function(name, data){
		try{
			return fs.writeFileSync(path.join(define.expandVariables(define.$root), name), data)
		}
		catch(e){
			return null
		}
	}

	this.readdir = function(name){
		// lets read the directory and return it
		try{
			var dir = fs.readdirSync(define.expandVariables('$compositions/'+name))
			return dir
		}
		catch(e){
			return []
		}
		// lets do a query
	}
})