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

	this.attribute("flex", {type: float, value: undefined});
	this.attribute("flexwrap", {type: String, value: "wrap"});	//'wrap', 'nowrap'
	this.attribute("flexdirection", {type: String, value: "row"});	//'column', 'row'
	this.attribute("justifycontent", {type:String, value: ""}) //	'flex-start', 'center', 'flex-end', 'space-between', 'space-around'
	this.attribute("alignitems", {type:String, value:"stretch"});  // 	'flex-start', 'center', 'flex-end', 'stretch'
	this.attribute("alignself", {type:String, value:"stretch"});  // 	'flex-start', 'center', 'flex-end', 'stretch'
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
	this.calculateBoundingRect = function(){
		console.log("replace me!");
	}
	this.attribute("clipping", {type:boolean, value:false})
	
	this.setDirty = function(value, rect){
		
		if (rect === undefined && this.screen) this.screen.addDirtyNode(this);
		
		if (value === true)
		{
			if(this.dirty === false) {			
				if (rect === undefined){					
					this.dirtyrect = this.calculateBoundingRect();					
				}else{
					this.dirtyrect = rect;
				}
				
				this.dirty = true
			}
			else{
				if (rect === undefined){					
					rect = this.calculateBoundingRect();					
				}
				if (this.dirtyrect){
				this.dirtyrect.top = Math.min(this.dirtyrect.top, rect.top);
				this.dirtyrect.bottom = Math.max(this.dirtyrect.bottom, rect.bottom);
				this.dirtyrect.left = Math.min(this.dirtyrect.left, rect.left);
				this.dirtyrect.right = Math.max(this.dirtyrect.right, rect.right);
				}else{
					this.dirtyrect = {left: rect.left, right:rect.right, top:rect.top, bottom:rect.bottom};
				}
			}
			if (this.parent) this.parent.setDirty(true, this.dirtyrect) 
		}
	}
})