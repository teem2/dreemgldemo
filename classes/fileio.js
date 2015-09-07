define.class(function(require, server){

	var nodehttp = require('$server/nodehttp')
	var fs = require('fs')
	var path = require('path')

	this.init = function(){
		
	}

	this.filechange = function(name){
		var filepath = path.join(define.expandVariables(define.$root), name)
		return new Promise(function(resolve){
			// lets wait for a  filechange, then resolve it
			var stat = JSON.stringify(fs.statSync(filepath))
			var myitv = setInterval(function mytimeout(){
				var newstat = JSON.stringify(fs.statSync(filepath))
				if(stat !== newstat){
					clearInterval(myitv)
					resolve(fs.readFileSync(filepath).toString())
				}
			}, 100)
		})
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
			var dir = fs.readdirSync(path.join(define.expandVariables(define.$root), name))
			return dir
		}
		catch(e){
			return []
		}
		// lets do a query
	}

	function readRecurDir(base, inname, ignoreset){
		var local = path.join(base, inname)
		var dir = fs.readdirSync(local)
		var out = {name:inname, collapsed:1, children:[]}
		for(var i = 0; i < dir.length;i++){
			var name = dir[i]
			var mypath = path.join(local, name)
			if(ignoreset){
				for(var j = 0; j < ignoreset.length; j++){
					var item = ignoreset[j]
					if(typeof item === 'string'){
						if(item == mypath)  break
					}
					else{
						if(mypath.match(item)) break
					}
				}
				if(j < ignoreset.length) continue
			}
			var stat = fs.statSync(mypath)
			if(stat.isDirectory()){
				out.children.push(readRecurDir(local, name, ignoreset))
			}
			else{
				out.children.push({name:name, size:stat.size})
			}
		}
		return out
	}

	this.readalldir = function(name, ignoreset){
		// lets read the directory and return it
		try{
			var rootval = define.expandVariables(define.$root)
			if(ignoreset) ignoreset = ignoreset.map(function(value){
				if(value.indexOf('@') == 0) return new RegExp(value.slice(1))
				return path.join(rootval, value)
			})
			return readRecurDir(rootval, name, ignoreset)
		}
		catch(e){
			return []
		}
		// lets do a query
	}
})