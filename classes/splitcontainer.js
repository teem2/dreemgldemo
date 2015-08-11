// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite,  view){
	this.attribute("vertical", {type: Boolean, value: false});
	this.attribute("splitsize", {type: float, value: 10});
	
	this.splitter = view.extend(function(){
		this.bgcolor = vec4("red");
		this.attribute("vertical", {type: Boolean, value: false});
		this.attribute("splitsize", {type: float, value: 10});
		this.render = function(){
			if (this.vertical){
				this.size[0] = this.splitsize;
				this.size[1] = 1;
			}else{
				this.size[0] = 1;
				this.size[1] = this.splitsize;
			}
				
		}
		
	});
	
	this.render = function(){
		if (this.children.length > 1){
			this.newchildren = []
			this.newchildren.push(this.children[0]);
			for (var i = 1;i<this.children.length;i++){
				//this.newchildren.push(this.splitter({vertical: this.vertical, splitsize: this.splitsize}));
				this.newchildren.push(this.children[i]);
				//return newchildren;
			}
			this.children = [];
			return this.newchildren;
				
		}else{
			return []
		}
	}
});