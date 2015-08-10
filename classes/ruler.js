// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, view){
	this.render = function(){
		var rulerres = view({bgcolor: "blue", flexdirection:"column", flex: 1, alignself:"stretch" });;		
		return rulerres;
	}
})