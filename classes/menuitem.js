// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite, view, button, text,screenoverlay){
	this.bgcolor = vec4("lightgray");

	this.menuclick = function(){
		// ok now we have to do a modal view of our instance_children
		if(this.select){
			this.select()
			this.screen.closeModal()
			return
		}
		var br = this.getBoundingRect();
		this.screen.openModal(
			view({x:br.left, y:br.bottom, miss:function(){
				this.screen.closeModal(-1)
			}, position:'absolute', flexdirection:'column'},
			screenoverlay({x: -br.left}), 
			this.instance_children)
		)
	}

	this.render = function(){
		return button({borderwidth: 0, padding: 4,labelactivecolor: vec4("#303000"), bordercolor:"transparent" , click:this.menuclick.bind(this), buttoncolor1:vec4(1,1,1,0.0),buttoncolor2:vec4(1,1,1,0.0),pressedcolor1:vec4(0,0,0,0.14), pressedcolor2:vec4(0,0,0,0.05),  hovercolor1:vec4(1,1,1,0.3),  hovercolor2:vec4(1,1,1,0.3), cornerradius: 0, text: this.text, fgcolor: "black", margin: 0, bgcolor:"transparent"})
		//return button({text: this.text, fgcolor: "black", margin: 5, bgcolor:"transparent", click:this.myclick.bind(this) })
	}
})