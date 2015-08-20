// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite, view, button, text){
	this.bgcolor = vec4("lightgray");
	this.click = function(){
		
	}
	this.render = function(){
		return button({text: this.text, fgcolor: "black", margin: 5, bgcolor:"transparent", click:this.click.bind(this) })
	}
})