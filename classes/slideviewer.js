// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(view, require){
	
	define.class(this, 'slide', function(view, text){
		this.cornerradius = vec4(10,10,10,10);
		this.borderwidth = 2;
		this.bgcolor ="white";
		this.flex = 1;
		this.padding= vec4(6);
		this.render = function(){
			return view({bg:{bgcolorfn:function(a,b){return vec4(1- a.y*0.4, 1- a.y*0.4,1- a.y*0.2,1);}}, cornerradius:vec4(10),flex:1,flexdirection:'column'}
				,text({margin:[10,10,10,10],fontsize:50,alignself:'center',text:this.title})
				,view({flex:1, bgcolor:"transparent", padding:vec4(10)},this.constructor_children)
			)
		}
	});

	// lets put an animation on x
	this.attribute('x', {motion:'inOutSine',duration:0.2})

	this.state('page')
	this.constructor.slide = this.slide
	
	this.slidewidth = 1024
	this.slidemargin = 10
	this.slideheight = 1024
	this.page = 0
	this.keydown = function(key){
		// alright we have a keydown!
		if(key.name == 'leftarrow'){
			// we need to animate to the left
			if(this.page >0) this.page --

			this.x = -this.page * (this.slidewidth + this.slidemargin * 2)
		}
		else if(key.name == 'rightarrow'){
			// animate to the right
			if(this.page < this.constructor_children.length-1)this.page++
			this.x =  -this.page *  (this.slidewidth + this.slidemargin * 2)
		}
	}

	// deny focus loss
	this.focuslost = function(){
		this.screen.setFocus(this)
	}

	this.init = function(){
		this.screen.setFocus(this)
		console.log(this.pos)
	}

	this.render = function(){
		// ok lets render all our slides using our container slide
		var count = 0
		return this.constructor_children.map(function(item){
			count++
			return this.slide({flexdirection:'column',width:this.slidewidth,margin:this.slidemargin,height:this.slideheight,title:item.slidetitle}, item)
		}.bind(this))
	}
})