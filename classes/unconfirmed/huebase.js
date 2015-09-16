// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Huebase API

define.class('$base/node', function(require, exports, self){
	var RpcMulti = require("$rpc/rpcmulti")

	try{
		var Hue = define.huebaseOnce || (define.huebaseOnce = require("node-hue-api"))
		var HueApi = Hue.HueApi;
		var LightState = Hue.lightState;
		var SerialPort = serialPortModule.SerialPort
	}
	catch(e){}
	
	var displayResult = function(result){
		//console.log("result: " + JSON.stringify(result, null, 2));
	}

	var displayError = function(err) {
		//console.error("" + err);
	}
	
	function RGB2HSL(rgb){
		var r = rgb[0]
		var g = rgb[1]
		var b = rgb[2]
	    var max = Math.max(r, g, b), min = Math.min(r, g, b)
	    var h, s, l = (max + min) / 2

	    if(max == min){
	        h = s = 0 // achromatic
	    } else {
	        var d = max - min
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
	        switch(max){
	            case r: h = (g - b) / d + (g < b ? 6 : 0); break
	            case g: h = (b - r) / d + 2; break
	            case b: h = (r - g) / d + 4; break
	        }
	        h /= 6
	    }
	    return [h, s, l]
	}
	
	self.setLightHSL = function(id, h,s,l){
		if (this.apiObject == undefined|| id == 0) 
		{
			return;
		}
		var state  =  LightState.create();
		this.apiObject.setLightState(id, state.on().transitiontime(0).hsl(h,s,l)).fail(displayError).done();
		delete state;
	}
	
	self.setLightRGB = function(id, RGB){
	//console.log(id, r,g,b);
		var hsl = RGB2HSL(RGB)
		if (this.apiObject == undefined || id == 0) {
			return;
		}
		var state  =  LightState.create();
		
		if (RGB[0] == 0 && RGB[1] == 0 && RGB[2] == 0)
		{
			this.apiObject.setLightState(id, state.off().transitiontime(0)).fail(displayError).done();
		}
		else
		{
			hsl[0] *= 359;
			hsl[1] *= 100;
			hsl[2] *= 100;
			this.apiObject.setLightState(id, state.on().transitiontime(0).bri(255).hsl(Math.round(hsl[0]),Math.round(hsl[1]),Math.round(hsl[2]))).fail(displayError).done();
		}
	}
	
	self.init = function(){
		console.color('~by~H~~~br~u~~~bb~e~~ system started!\n')
		// lets add all huelight children as an array, this will put up the rpc interfaces

		for(var i = 0; i < this.child.length; i++){
			var child = this.child[i]
			child.parent = this;
			
			if(!this.lights) this.lights = RpcMulti.createFromObject(child, node)
			this.lights.push(child)
			 
			this[child.name] = child;
			
			child.on_init.emit();
		}
		

		if(!LightState) return
		Hue.nupnpSearch(function(err, result){
				for(r in result){
				//console.log("found " + this.id + " at address " + result[r].ipaddress);
				if (result[r].id == this.id){
					console.log("found " + this.id + " at address " + result[r].ipaddress);
					if (this.username != undefined){
						var state = LightState.create();
						this.apiObject = new HueApi(result[r].ipaddress, this.username);
						this.apiObject.searchForNewLights().then(displayResult).fail(displayError).done();
						this.apiObject.lights().then(function(results){
							for(a in results.lights){
								for(var i = 0; i < this.child.length; i++){
									var child = this.child[i]
									if (child.lightname == results.lights[a].name){	
										console.color('~yb~found huelight: ~~' + child.lightname + '\n'); 
										
										child.hueID = results.lights[a].id;
									}										
								}

							}
						}.bind(this)).fail(displayError).done()					
						// ok now we want to 'define' the set, not just create it
						// what is the api
					}
				}
			}
		}.bind(this))
	}
})