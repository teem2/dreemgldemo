define.browserClass(function(require, view, text){
	
		
		this.attribute("subtexts", {type: int, value: 10});
		this.bg.basecolor = vec3(1,0,1);
		this.bg.coord = vec2(0,0);
		this.bg.tex = require("$textures/test.png");
		this.margin = 4;
		this.bg.color = function(){
			return vec4(0.1*tex.sample(mesh.xy+  vec2(sin(coord.x/width + mesh.y*20)*0.2, sin(coord.y/height )*0.2)).rgb, 1.0);
		}
		
		this.flexdirection = "column" 
		
		this.mouseleftdown = function(){
			console.log("thing clicked!");
		}
		
		this.mousemove = function(coord){
			this.bg.coord = coord;
			this.setDirty();
		}
		
		this.render = function()
		{
			
			
			var newchildren = [];
			for (var i =0 ;i<this.subtexts;i++)
			{
				newchildren.push(text({margin: i, text:"TADAA:" + i, bgcolor:"transparent"}));
				if (this.instance_children.length > 0 && i < this.instance_children.length)
				{
					newchildren.push(this.instance_children[i % this.instance_children.length]);
				}
			
			}
			return newchildren;
		}
	});
	