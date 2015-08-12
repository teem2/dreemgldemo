// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class('$base/nodeworker', function(require, exports, self){

	this.attribute("bgcolor", {type:vec4, value: "white"})
	this.attribute("src", {type:String, value: ""})
	this.attribute("bordercolor", {type:vec4, value: "black"})

	this.attribute("pos", {type:vec2, value:vec2(0,0)})
	this.attribute("x", {storage:'pos', index:0})
	this.attribute("y", {storage:'pos', index:1})
	this.attribute("left", {storage:'pos', index:0})
	this.attribute("top", {storage:'pos', index:1})

	this.attribute("size", {type:vec2, value:vec2(NaN, NaN)})

	function percentParser(key, value){
		var special_key = 'percent_'+key
		if(typeof value === 'string'){
			if(value === 'auto'){
				this[special_key] = value
				return 0
			}
			else if(value.indexOf('%') == value.length - 1){
				this[special_key] = value
				return 0
			}
		}
		return value
	}

	this.attribute("w", {storage:'size', index:0, parser:percentParser})
	this.attribute("h", {storage:'size', index:1, parser:percentParser})
	this.attribute("width", {storage:'size', index:0, parser:percentParser})
	this.attribute("height", {storage:'size', index:1, parser:percentParser})

	this.attribute("right", {type:float, value: NaN})
	this.attribute("bottom", {type:float, value: NaN})
	
	this.attribute("opacity", {type:float, value: 1.0})
	this.attribute("rotation", {type:float, value: 0})

	this.attribute("cornerradius", {type:vec4, value: vec4(4,4,4,4)})
	this.attribute("cornerradiustopleft", {storage:'cornerradius', index:0})
	this.attribute("cornerradiusbottomleft", {storage:'cornerradius', index:1})
	this.attribute("cornerradiusbottomright", {storage:'cornerradius', index:2})
	this.attribute("cornerradiustopright", {storage:'cornerradius', index:3})
	
	this.attribute('minsize', {type: vec2, value: vec2(0,0)})
	this.attribute("minwidth", {storage:'minsize', index:0})
	this.attribute("minheight", {storage:'minsize', index:1})
	this.attribute('maxsize', {type: vec2, value: vec2(NaN, NaN)})
	this.attribute("maxwidth", {storage:'maxsize', index:0})
	this.attribute("maxheight", {storage:'maxsize', index:1})

	this.attribute("margin", {type: vec4, value: vec4(0,0,0,0)})
	this.attribute("marginleft", {storage:'margin', index:0})
	this.attribute("margintop", {storage:'margin', index:1})
	this.attribute("marginright", {storage:'margin', index:2})
	this.attribute("marginbottom", {storage:'margin', index:3})

	this.attribute("padding", {type: vec4, value: vec4(0,0,0,0)})
	this.attribute("paddingleft", {storage:'padding', index:0})
	this.attribute("paddingtop", {storage:'padding', index:1})
	this.attribute("paddingright", {storage:'padding', index:2})
	this.attribute("paddingbottom", {storage:'padding', index:3})

	this.attribute("borderwidth", {type: vec4, value: vec4(0,0,0,0)});
	this.attribute("borderleftwidth", {storage:'borderwidth', index:0})
	this.attribute("bordertopwidth", {storage:'borderwidth', index:1})
	this.attribute("borderrightwidth", {storage:'borderwidth', index:2})
	this.attribute("borderbottomwidth", {storage:'borderwidth', index:3})

	this.attribute("flexdirection", {type: String, value: "row"});	//'column', 'row'
	this.attribute("justifycontent", {type:String, value: ""}) //	'flex-start', 'center', 'flex-end', 'space-between', 'space-around'
	this.attribute("alignitems", {type:String, value:"stretch"});  // 	'flex-start', 'center', 'flex-end', 'stretch'
	this.attribute("alignself", {type:String, value:"stretch"});  // 	'flex-start', 'center', 'flex-end', 'stretch'
	this.attribute("flex", {type: float, value: undefined});
	this.attribute("flexwrap", {type: String, value: "wrap"});	//'wrap', 'nowrap'
	this.attribute("position", {type: String, value: "relative" });	//'relative', 'absolute'

	this.attribute('text', {type:String, value: "" })
	this.attribute('fontsize', {type:float, value: 12});
	this.attribute('fgcolor', {type:vec4, value: vec4(1,1,1,1)});

	this.event("reinit")

	this.event("click")
	this.event("mouseout")
	this.event("mouseover")
	this.event("mousemove")
	this.event("mouseleftdown")
	this.event("mouseleftup")
	this.event("mouserightdown")
	this.event("mouserightup")
	this.event("scroll")
	this.event("keyup")
	this.event("keydown")
	this.event("keypress")
	this.event("keypaste")

	this.event("focusget")
	this.event("focuslost")
	
	this.attribute("clipping", {type:boolean, value:false})

	this.setDirty = function(value, rect){
		if (value === true && this.dirty === false) {
			
			if (rect === undefined){
					
					if (this.matrixdirty) this.recomputeMatrix();
					var x1 = 0;
					var x2 =  this.layout.width;
					var y1 = 0;
					var y2 = this.layout.height;
					console.log("layout: " , this.layout);
					var v1 = vec2(x1,y1);
					var v2 = vec2(x2,y1);
					var v3 = vec2(x2,y2);
					var v4 = vec2(x1,y2);
					
					console.log("vectors pre:", v1,v2,v3,v4);

					v1 = vec2.mul_mat4_t(v1, this.orientation.worldmatrix)
					v2 = vec2.mul_mat4_t(v2, this.orientation.worldmatrix)
					v3 = vec2.mul_mat4_t(v3, this.orientation.worldmatrix)
					v4 = vec2.mul_mat4_t(v4, this.orientation.worldmatrix)		
					
					console.log("vectors post:" , v1,v2,v3,v4);
					var minx = v1[0];
					var miny = v1[1];
					var maxx = v1[0];
					var maxy = v1[1];
					if (v2[0] < minx) minx = v2[0];else if (v2[0] > maxx) maxx = v2[0];
					if (v3[0] < minx) minx = v3[0];else if (v3[0] > maxx) maxx = v3[0];
					if (v4[0] < minx) minx = v4[0];else if (v4[0] > maxx) maxx = v4[0];
					
					if (v2[1] < miny) miny = v2[1];else if (v2[1] > maxy) maxy = v2[1];
					if (v3[1] < miny) miny = v3[1];else if (v3[1] > maxy) maxy = v3[1];
					if (v4[1] < miny) miny = v4[1];else if (v4[1] > maxy) maxy = v4[1];
					
					rect = {left: minx, top: miny, right: maxx, bottom: maxy};
					console.log(rect);
					
			}
			else{
				//console.log("got rect!", rect);
			}
			this.dirty = true
			if (this.parent !== undefined) this.parent.setDirty(true, rect) 
		}
	}
})