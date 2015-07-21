// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Sprite class

define.class('$base/nodeworker', function(require, exports, self){

	self.attribute("bgcolor", {type:vec4, value: "white"})
	self.attribute("src", {type:String, value: ""})
	self.attribute("bordercolor", {type:vec4, value: "black"})

	self.attribute("pos", {type:vec2, value:vec2(0,0)})
	self.attribute("x", {storage:'pos', index:0})
	self.attribute("y", {storage:'pos', index:1})
	self.attribute("left", {storage:'pos', index:0})
	self.attribute("top", {storage:'pos', index:1})

	self.attribute("size", {type:vec2, value:vec2(0,0)})

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

	self.attribute("w", {storage:'size', index:0, parser:percentParser})
	self.attribute("h", {storage:'size', index:1, parser:percentParser})
	self.attribute("width", {storage:'size', index:0, parser:percentParser})
	self.attribute("height", {storage:'size', index:1, parser:percentParser})

	self.attribute("right", {type:float, value: NaN})
	self.attribute("bottom", {type:float, value: NaN})
	
	self.attribute("opacity", {type:float, value: 1.0})
	self.attribute("rotation", {type:float, value: 0})

	self.attribute("cornerradius", {type:vec4, value: vec4(4,4,4,4)})
	self.attribute("cornerradiustopleft", {storage:'cornerradius', index:0})
	self.attribute("cornerradiusbottomleft", {storage:'cornerradius', index:1})
	self.attribute("cornerradiusbottomright", {storage:'cornerradius', index:2})
	self.attribute("cornerradiustopright", {storage:'cornerradius', index:3})
	
	self.attribute('minsize', {type: vec2, value: vec2(0,0)})
	self.attribute("minwidth", {storage:'minsize', index:0})
	self.attribute("minheight", {storage:'minsize', index:1})
	self.attribute('maxsize', {type: vec2, value: vec2(NaN, NaN)})
	self.attribute("maxwidth", {storage:'maxsize', index:0})
	self.attribute("maxheight", {storage:'maxsize', index:1})

	self.attribute("margin", {type: vec4, value: vec4(0,0,0,0)})
	self.attribute("marginleft,", {storage:'margin', index:0})
	self.attribute("margintop", {storage:'margin', index:1})
	self.attribute("marginright", {storage:'margin', index:2})
	self.attribute("marginbottom", {storage:'margin', index:3})

	self.attribute("padding", {type: vec4, value: vec4(0,0,0,0)})
	self.attribute("paddingleft,", {storage:'padding', index:0})
	self.attribute("paddingtop", {storage:'padding', index:1})
	self.attribute("paddingright", {storage:'padding', index:2})
	self.attribute("paddingbottom", {storage:'padding', index:3})

	self.attribute("borderwidth", {type: vec4, value: vec4(0,0,0,0)});
	self.attribute("borderleftwidth,", {storage:'borderwidth', index:0})
	self.attribute("bordertopwidth", {storage:'borderwidth', index:1})
	self.attribute("borderrightwidth", {storage:'borderwidth', index:2})
	self.attribute("borderbottomwidth", {storage:'borderwidth', index:3})

	self.attribute("flexdirection", {type: String, value: "row"});	//'column', 'row'
	self.attribute("justifycontent", {type:String, value: ""}) //	'flex-start', 'center', 'flex-end', 'space-between', 'space-around'
	self.attribute("alignitems", {type:String, value:"stretch"});  // 	'flex-start', 'center', 'flex-end', 'stretch'
	self.attribute("alignself", {type:String, value:""});  // 	'flex-start', 'center', 'flex-end', 'stretch'
	self.attribute("flex", {type: float, value: NaN});
	self.attribute("flexwrap", {type: String, value: ""});	//'wrap', 'nowrap'
	self.attribute("position", {type: String, value: "absolute" });	//'relative', 'absolute'

	self.attribute('text', {type:String, value: "" })
	self.attribute('fontsize', {type:float, value: 12});
	self.attribute('fgcolor', {type:vec4, value: vec4(1,1,1,1)});

	self.event("click")
	self.event("mousedown")
	self.event("mouseout")
	self.event("mouseover")
	self.event("mousemove")
	self.event("mouseup")
	self.event("scroll")
	
	self.attribute("clipping", {type:boolean, value:false})

	self.setDirty = function(value){
		if (value === true && this.dirty === false) {
			this.dirty = true
			if (this.parent !== undefined) this.parent.setDirty(true) 
		}
	}
})