// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(view, require){
	
	define.class(this, 'slide', function(view, text){
		this.render = function(){
			return view({}, text({fontsize:50,text:this.title}),this.constructor_children)
		}

	});

	this.constructor.slide = this.slide

	this.keydown = function(key){
		// alright we have a keydown!
		if(key.name == 'leftarrow'){
			// we need to animate to the left
		}
		else if(key.name == 'rightarrow'){
			// animate to the right
		}
	}

	// deny focus loss
	this.focuslost = function(){
		this.screen.setFocus(this)
	}

	this.init = function(){
		this.screen.setFocus(this)
	}

	this.render = function(){
		// ok lets render all our slides using our container slide
		var count = 0
		return this.constructor_children.map(function(item){
			count++
			return this.slide({width:1024,margin:10,height:1024,title:item.slidetitle}, item)
		}.bind(this))
	}
})