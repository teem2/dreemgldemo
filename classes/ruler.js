// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite, text, view){
	
	this.vertical = false;
	this.from = 100;
	this.to = 200;
	this.offset = 20;
	
	this.ruler = function(){
		var dist =(mesh.x *	width) - offset;
		if (dist > 0.){ 
			if(floor(mod(dist  ,100.) ) < 1.) {
				return vec4(0.8,0.8,0.8,1);	
			}else{
				if (mesh.y >0.5 && floor(mod(dist ,10.) ) < 1.) {
					return vec4(0.75,0.75,0.75,1.0);
				}
			}
		}
		return bgcolor;
	}
	
	this.vruler = function(){
		var dist =(mesh.y *	height) - offset;
		if (dist > 0.)	{ 		
			if (floor(mod(dist ,100.) ) < 1.) {
				return vec4(0.8,0.8,0.8,1);
			}else{
				if (mesh.x >0.5 && floor(mod(dist ,10.) ) < 1.) {
					return vec4(0.75,0.75,0.75,1.0);
				}
			}
		}
		return bgcolor;
	}

		this.bgcolor = "#8080b0";
			this.flexdirection ="column";
		this.alignself = "stretch" ;
	
	this.render = function(){
		if (this.vertical == false){
			this.bg.color = this.ruler;
		this.bg.offset = this.offset;			
	
						
			var rulerres = [
				text({position: "absolute", text: this.from.toString(),width:100,height:20, bgcolor:"transparent", left: this.from+this.offset})
				,text({position: "absolute", text: this.to.toString(),width:100,height:20, bgcolor:"transparent", left: this.to+this.offset})	
				]			
				
			return rulerres;
		}
		else{
			this.bg.color = this.vruler;
		this.bg.offset = this.offset;			
	
			var rulerres = [
				text({rotation: -90, bgcolor:"transparent",width: 100, height: 20,position: "absolute", text: this.from.toString(), left:-45,top: this.from+this.offset})
				,text({rotation: -90, bgcolor:"transparent",width: 100, height: 20,position: "absolute", text: this.to.toString(), left:-45,top: this.to+this.offset})
				]
		return rulerres;
		}
	}
})