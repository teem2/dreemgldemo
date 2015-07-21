// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class('$base/nodeworker', function(require, exports, self){
	var AnimTrack = require('$animation/animtrack')

	self.init = function(){
		this.anims = {}
	}

	self.startMotion = function(obj, key, value){
		var config = obj.getAttributeConfig(key)
		var first = obj['_' + key]
		var trk = new AnimTrack(config, obj, key, first, value)
		var animkey = obj.interfaceguid + '_' + key
		this.anims[animkey] = trk
		obj.dirty = true
		return true
	}

	self.doAnimation = function(time){
		var hasanim = false
		for(var key in this.anims){
			var anim = this.anims[key]
			if(anim.start_time === undefined) anim.start_time = time
			var mytime = time - anim.start_time
			var value = anim.compute(mytime)

			if(value instanceof anim.End){
				delete this.anims[key] 
				//console.log(value.last_value)
				anim.obj.emit(anim.key, value.last_value)
			}
			else{
				anim.obj.emit(anim.key, value)
				if(!hasanim) hasanim = true
			}
		}
		return hasanim
	}

	self.hideProperty(Object.keys(self))

	self.attribute("bgcolor", {type:vec4, value: vec4(0,0,0.1,1)});
	self.attribute("width" , {type:float, value:1});
	self.attribute("height" , {type:float, value: 1});

	self.attribute("margin", {type: vec4, value: vec4(0,0,0,0)});
	self.attribute("marginleft,", {storage:'margin', index:0})
	self.attribute("margintop", {storage:'margin', index:1})
	self.attribute("marginright", {storage:'margin', index:2})
	self.attribute("marginbottom", {storage:'margin', index:3})

	self.attribute("padding", {type: vec4, value: vec4(0,0,0,0)});
	self.attribute("paddingleft,", {storage:'padding', index:0})
	self.attribute("paddingtop", {storage:'padding', index:1})
	self.attribute("paddingright", {storage:'padding', index:2})
	self.attribute("paddingbottom", {storage:'padding', index:3})

	self.attribute("borderwidth", {type: vec4, value: vec4(0,0,0,0)});
	self.attribute("borderleftwidth,", {storage:'borderwidth', index:0})
	self.attribute("bordertopwidth", {storage:'borderwidth', index:1})
	self.attribute("borderrightwidth", {storage:'borderwidth', index:2})
	self.attribute("borderbottomwidth", {storage:'borderwidth', index:3})

	self.attribute("flexDirection", {type: String, value: "row"});	//'column', 'row'
	self.attribute("justifyContent", {type:String, value: "flex-start"}) //	'flex-start', 'center', 'flex-end', 'space-between', 'space-around'
	self.attribute("alignItems", {type:String, value:"flex-start"});  // 	'flex-start', 'center', 'flex-end', 'stretch'
	self.attribute("alignSelf", {type:String, value:"flex-start"});  // 	'flex-start', 'center', 'flex-end', 'stretch'
	self.attribute("flex", {type: float, value: NaN});
	self.attribute("flexWrap", {type: String, value: ""});	//'wrap', 'nowrap'
	self.attribute("position", {type: String, value: "relative" });	//'relative', 'absolute'	
})