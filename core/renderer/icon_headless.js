// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Node worker baseclass

define.class('$renderer/sprite_base', function(require, exports, self){
	var node = require('$base/node')
	exports.nest('Bg', node.extend())
	exports.nest('Fg', node.extend())

	this.atConstructor = function(){
	}

	this.render = function(){
	}

	this.spawn = function(parent){
	}
})