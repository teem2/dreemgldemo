// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(node){
	this.atConstructor = function(){}
	
	this.event('start')
	this.event('end')
	this.event('cancel')
	this.event('leave')
	this.event('move')
	this.attribute('x',{type:int})
	this.attribute('y',{type:int})
	this.attribute('x1',{type:int})
	this.attribute('y1',{type:int})
	this.attribute('x2',{type:int})
	this.attribute('y2',{type:int})
	this.attribute('x3',{type:int})
	this.attribute('y3',{type:int})
	this.attribute('x4',{type:int})
	this.attribute('y4',{type:int})
	this.attribute('fingers',{type:int})
});