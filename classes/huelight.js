// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Philips HueLight API

define.class('$base/node', function(require, exports, self){
	var RpcProxy = require("$rpc/rpcproxy")
	var colorparse = require("$parsers/colorparser.js");

	Object.defineProperty(this, 'subRpcDef',{
		value:function(){ 
			return {
				kind:'single', 
				self: RpcProxy.createRpcDef(this, Object.getPrototypeOf(exports))
			}
		}
	})
	
	self.init = function(){
		console.color('~bg~H~~~by~u~~~br~e~~ object started on server\n')	
		this.hueID = 0
		this.color = "black"
	}
	
	self.attribute("color", {type: "string"} )	
	self.color = function(newcol){
		var RGB = colorparse(newcol)
		if (this.parent) this.parent.setLightRGB(this.hueID, RGB)
	}
			
	self.powerOn = function(){
		console.log("YESS", this.parent)
		return "I POWERED ON!"
	}
})