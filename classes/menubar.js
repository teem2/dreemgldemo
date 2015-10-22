// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(view, menuitem){
	// container class for menuitem instances
	this.bgcolor = vec4("lightgray" );	

	// render function passthrough
	this.render = function(){return this.instance_children;}
	
	var menubar  = this.constructor;
	
	// Basic usage example
	define.example(this, function BasicUsage(){
		return [
			menubar({}
				,menuitem({text:"Menu 1"}
					,menuitem({text:"Item 1"})
					,menuitem({text:"Item 2", enabled: false})
					,menuitem({text:"Item 3"})
				
				)
				,menuitem({text:"Menu 2" }
					,menuitem({text:"Item 4"})
					,menuitem({text:"Item 5", enabled: false})				
				)
				,menuitem({text:"Button on the bar" })

			)
		]
	
	})
})