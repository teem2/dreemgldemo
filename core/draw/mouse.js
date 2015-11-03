// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(node){
	this.event('move')
	this.attribute('x', {type:float})
	this.attribute('y', {type:float})
	this.attribute('isdown', {type:int})
	this.attribute('left', {type:int})
	this.attribute('middle', {type:int})
	this.attribute('right', {type:int})
	this.attribute('click', {type:int})
	this.attribute('blurred', {type:int})
	this.attribute('dblclick', {type:int})
	this.attribute('clicker', {type:int})
	this.attribute('leftdown', {type:int})
	this.attribute('leftup', {type:int})
	this.attribute('rightdown', {type:int})
	this.attribute('rightup', {type:int})
	this.attribute('wheelx', {type:int})
	this.attribute('wheely', {type:int})

});