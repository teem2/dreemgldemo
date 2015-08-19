define.nodejsClass(function(require, server){

	var nodehttp = require('$server/nodehttp')
	var fs = require('fs')
	var RpcProxy = require('$rpc/rpcproxy')

	this.init = function(){
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