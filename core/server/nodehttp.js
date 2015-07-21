// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// promisified node http api

define(function(require, exports, module){
	var http = require('http')
	var url = require('url')
	
	exports.get = function nodehttp(httpurl){
		return new Promise(function(resolve, reject){
			var myurl = url.parse(httpurl)

			http.get({
				host: myurl.hostname,
				port: myurl.port,
				path: myurl.path
			}, 
			function(res){
				var data = ''
				res.on('data', function(buf){ data += buf })
				res.on('end', function(){
					// write it and restart it.
					resolve(data)
				})
				res.on('error', function(error){
					reject(error)
				})
			})
		})
	}
})