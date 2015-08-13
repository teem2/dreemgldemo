// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(require, view){
	
	this.flex = 1;
	this.flexdirection = "column" ;
	this.alignitem = "stretch";
	this.alignself = "stretch"; 
	this.bgcolor = vec4("#d0d0d0");
	this.bg.bgcolorfn = function(a,b){
		if (floor(mod(a.x * width,50. )) == 0. ||floor(mod(a.y * height,50. )) == 0.)	{
		return mix(bgcolor, vec4(1.0), 0.5);
		}
		if (floor(mod(a.x * width,10. )) == 0. ||floor(mod(a.y * height,10. )) == 0.)	{
		return mix(bgcolor, vec4(1.0), 0.2);
		}
		return bgcolor;
	}
	this.init = function(){

		// we need to map 'screen' to something else
		define.atLookupClass = function(cls){
			if(cls === 'screen'){ // remap our screen class
				return '$renderer/screen_edit'	
			}
			return define.lookupClass(cls)
		}

		require.async('/compositions/' + this.composition + '/index.js').then(function(TeemClient){
			define.atLookupClass = define.lookupClass
			// alright lets load this thing up
			this.sub_teem = new TeemClient(undefined, this)
			this.sub_teem.screen.flex=1;
			this.sub_teem.screen.alignself="stretch";
			
			this.children = [this.sub_teem.screen]

			this.setDirty(true)
		}.bind(this))
	}

	this.atDraw = function(){
		// alright now we need to draw the things in our sub_teem
		// screen.
		if(!this.sub_teem) return

	}
})