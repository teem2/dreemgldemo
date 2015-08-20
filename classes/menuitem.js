// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite, view, text){
	this.bgcolor = vec4("lightgray");
	this.render = function(){
		return [text({text: this.text, fgcolor: "black", margin: 5, bgcolor:"transparent" }), this.instance_children]
	}
})