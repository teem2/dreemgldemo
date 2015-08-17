// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// ruler class

define.class(function(sprite,  view){
	this.attribute("vertical", {type: Boolean, value: true});
	this.attribute("firstnode", {type: int, value: 0});
	this.attribute("splitsize", {type: float, value: 8});
	this.attribute("minimalchildsize", {type: float, value: 20});
	this.attribute("splittercolor", {type: vec4, value: vec4("#404050")});
	this.attribute("hovercolor", {type: vec4, value: vec4("#5050a0")});
	this.attribute("activecolor", {type: vec4, value: vec4("#7070a0")});
	this.flex = 1.0;
	this.flexdirection = this.vertical?"column":"row" ;
	this.position = "relative" ;
	this.borderwidth =1;
	this.bordercolor = vec4("#303060");
	
	this.vertical = function(){
		this.flexdirection = this.vertical?"column":"row" ;
	}
	
	
	this.splitter = view.extend(function(){
		this.bgcolor = vec4("red");
		this.alignitem = "stretch";
		this.attribute("vertical", {type: Boolean, value: false});
		this.attribute("splitsize", {type: float, value: 10});
		this.attribute("splittercolor", {type: vec4, value: vec4("#404050")});
		this.attribute("hovercolor", {type: vec4, value: vec4("#5050a0")});
		this.attribute("activecolor", {type: vec4, value: vec4("#7070a0")});
		this.bg.color1 = vec4("red");
		this.bg.bgcolorfn = function(A,B){return color1;};
		this.pressed = 0;
		this.hovered = 0;

		this.mouseover  = function(){
			this.hovered++;
			this.setDirty(true);
		}

		this.mouseout  = function(){
			this.hovered--;
			this.setDirty(true);
		}

		this.mouseleftdown = function(){
			this.pressed++;
			this.dragstart = {x: this.mouse.x, y:this.mouse.y};
			this.mousemove = function(a){				
				var dx = this.mouse.x - this.dragstart.x;
				var dy = this.mouse.y - this.dragstart.y;

				this.dragstart.x = this.mouse.x;
				this.dragstart.y = this.mouse.y;

				var leftnode = this.parent.children[this.firstnode];
				var rightnode = this.parent.children[this.firstnode+2];

				var f1 = leftnode.flex;
				var f2 = rightnode.flex;

				var totf = f1 + f2;

				if (this.vertical){
					var h1 = leftnode.layout.height;
					var h2 = rightnode.layout.height;
					var hadd = h1 + h2;	
					h1 += dy;
					h2 -= dy;
					if (h1 < this.parent.minimalchildsize || h2 < this.parent.minimalchildsize) return;
					var f1n = h1 / (hadd);
					var f2n = h2 / (hadd);					
					leftnode.flex = f1n * totf;
					rightnode.flex = f2n* totf;
				}else{					
					var w1 = leftnode.layout.width;
					var w2 = rightnode.layout.width;
					var wadd = w1 + w2;
					w1 += dx;
					w2 -= dx;
					if (w1 < this.parent.minimalchildsize || w2 < this.parent.minimalchildsize) return;
					var f1n = w1 / (wadd);
					var f2n = w2 / (wadd);
					leftnode.flex = f1n* totf;
					rightnode.flex = f2n* totf;
				}
				this.setDirty(true);
			}.bind(this);

			this.setDirty(true);
		}

		this.mouseleftup = function(){
			this.pressed--;
			this.mousemove = function(){};
			this.setDirty(true);			
		}

		this.atDraw = function(){
			if (this.hovered > 0){
				if (this.pressed > 0){
					this.bg.color1 = this.activecolor;
				}else{
					this.bg.color1 = this.hovercolor;
				}
			}else{
				this.bg.color1 = this.splittercolor;
			}
		}

		this.render = function(){
			if (this.vertical){
				this.height = this.splitsize;
				this.width = NaN;
			}else{
				this.width = this.splitsize;;
				this.height = NaN;
			}				
		}		
	});
	
	this.render = function(){		
		if (this.instance_children.length > 1){
			this.newchildren = []
			this.newchildren.push(view({clipping: true, flex: 1},this.instance_children[0]));
	//		if (!this.instance_children[0].flex) this.instance_children[0].flex =1;
			for (var i = 1;i<this.instance_children.length;i++){
//				if (!this.instance_children[i].flex) this.instance_children[i].flex =1;
				this.newchildren.push(this.splitter({vertical: this.vertical,firstnode: (i-1)*2, splitsize: this.splitsize, splittercolor: this.splittercolor, hovercolor: this.hovercolor, activecolor: this.activecolor}));
				this.newchildren.push(view({clipping: true, flex: 1 },this.instance_children[i]));				
			}
			this.children = [];
			return this.newchildren;
		}else{
			return this.instance_children;
		}
	}
});