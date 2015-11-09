// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class( function(node, require){
	var Animate = require('$base/animate')
	var FlexLayout = require('$lib/layout')

	// store the device shader on drawdevice
	var Shader = this.Shader = require('$draw/$drawmode/shader$drawmode')

	this.attribute("pos", {type:vec2, value:vec2(0,0)})
	this.attribute("x", {storage:'pos', index:0})
	this.attribute("y", {storage:'pos', index:1})
	this.attribute("left", {storage:'pos', index:0})
	this.attribute("top", {storage:'pos', index:1})

	this.attribute("bgcolor", {type:vec4, value: vec4(0,0,0.1,1)})
	this.attribute("clearcolor", {type:vec4, value: vec4('transparent')})

	this.attribute("size", {type:vec2, value:vec2(NaN, NaN)})

	this.attribute("w", {storage:'size', index:0})
	this.attribute("h", {storage:'size', index:1})
	this.attribute("width", {storage:'size', index:0})
	this.attribute("height", {storage:'size', index:1})

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

	this.attribute("scale", {type: vec3, value: vec3(1)})
	this.attribute("rotate", {type: vec3, value: vec3(0)})
	this.attribute("translate", {type: vec3, value: vec3(0)})

	this.attribute("borderwidth", {type: vec4, value: vec4(0,0,0,0)})
	this.attribute("borderradius", {type: vec4, value: vec4(0,0,0,0)})
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

	this.attribute("mode", {type:Enum('','2D','3D'), value:''})
	
	this.attribute("model", {type: Object})
	this.state('model')

	this.modelmatrix = mat4.identity()
	this.totalmatrix = mat4.identity()
	this.viewmatrix = mat4.identity()
	this.layermatrix = mat4.identity()

	this.init = function(){
		this.anims = {}
		this.shader_list = []
		this.modelmatrix = mat4.identity()
		this.totalmatrix = mat4.identity()
		this.layermatrix = mat4.identity()
		this.atInit()
	}

	this.atInit = function(){
		for(var key in this.shaders){
			var shader = this[key]
			this.shader_list.push(this[key+'shader'] = new shader())
		}
		if(this._mode){
			// give it a blendshader
			this.blendshader = new this.blend()
		}
	}

	this.atInnerClass = function(name, inner){
		if(inner === undefined){ // someone is trying to remove this class
			if(this.shaders[name]){
				if(!this.hasOwnProperty('shaders')) this.shaders = Object.create(this.shaders || {})
				this.shaders[name] = undefined
			}	
			return		
		}
		if(inner.prototype instanceof Shader){
			if(!this.hasOwnProperty('shaders')) this.shaders = Object.create(this.shaders || {})
			if(!inner.prototype.omit_from_shader_list){
				this.shaders[name] = inner
			}
		}
	}

	// when do we call this?..
	this.updateShaders = function(){
		// lets call update on our shaders
		var shadername
		// we can wire up the shader 
		if(!this._shaderswired){
			this.atAttributeGet = function(attrname){
				// monitor attribute wires for geometry
			}.bind(this)
		}
		var shaders = this.shader_list
		for(var i = 0; i < shaders.length; i ++){
			var shader = shaders[i]			
			shader.update()
		}
		if(!this._shaderswired){
			this._shaderswired = true
			this.atAttributeGet = undefined
		}
	}

	this.updateMatrices = function(parentmatrix){

		// compute TSRT matrix
		if(this.layout){
			var s = this._scale
			var r = this._rotate
			var t0 = this.layout.left, t1 = this.layout.top, t2 = 0
			if (this._position === "absolute"){
				t0 = this._pos[0]
				t1 = this._pos[1]
			}
			var hw = ( this.layout.width !== undefined? this.layout.width: this._size[0] ) / 2
			var hh = ( this.layout.height !== undefined ? this.layout.height: this._size[1]) / 2
			mat4.TSRT(-hw, -hh, 0, s[0], s[1], s[2], r[0], r[1], r[2], t0 + hw * s[0], t1 + hh * s[1], t2, this.modelmatrix);
		}
		else{
			var s = this._scale
			var r = this._rotate
			var t = this._translate
			var hw = this._size[0] / 2
			var hh = this._size[1] / 2
			mat4.TSRT(-hw, -hh, 0, s[0], s[1], s[2], 0, 0, r[2], t[0] + hw * s[0], t[1] + hh * s[1], t[2], this.modelmatrix);
		}

		// do the matrix mul
		if(this._mode){
			//mat4.identity(this.totalmatrix)
			//this.layermatrix = mat4.identity()
			if(parentmatrix) mat4.mat4_mul_mat4(parentmatrix, this.modelmatrix, this.layermatrix)
			else this.layermatrix = this.modelmatrix
		}
		else{
			if(parentmatrix) mat4.mat4_mul_mat4(parentmatrix, this.modelmatrix, this.totalmatrix)
		}

		var children = this.children
		for(var i = 0; i < children.length; i++){
			children[i].updateMatrices(this.totalmatrix)
		}
	}

	this.doLayout = function(width, height){
		FlexLayout.fillNodes(this)
		var layouted = FlexLayout.computeLayout(this)
		// recursively update matrices?
		this.updateMatrices()
	}

	this.update = this.updateShaders

	// rounded corner shader
	define.class(this, 'bg', this.Shader, function(){

		this.vertexstruct = define.struct({
			pos: vec2,
			angle: float,
			radmult: vec4,
			uv:vec2
		})

		this.mesh = this.vertexstruct.array()
	
		this.has_pick = true
		this.depth_test = ""

		// matrix and viewmatrix should be referenced on view
		this.opacity = 0.0
		this.draw_type = "TRIANGLE_FAN"
		this.color_blend = 'src_alpha * src_color + (1 - src_alpha) * dst_color'
  
		this.update = function(){

			var view = this.view
			var width = view.layout?view.layout.width:view.width
			var height = view.layout?view.layout.height:view.height
			var radius = view.borderradius

			var mesh = this.mesh = this.vertexstruct.array()

			if (vec4.equals(radius, vec4(0,0,0,0))) {
				mesh.push([width/2,height/2], 0, [1,0,0,0], 0.5,0.5)
				mesh.push([0,0], 0, [1,0,0,0], 0,0)
				mesh.push([width,0], 0, [1,0,0,0], 1,0)
				mesh.push([width,height], 0, [1,0,0,0], 1,1)
				mesh.push([0,height], 0, [1,0,0,0], 0,1)
				mesh.push([0,0], 0, [1,0,0,0], 0,0)
			}
			else{
				var pidiv = 10
				this.mesh.push([width/2,height/2], 0, [0,0,0,0], 0.5,0.5)
				
				for(var p = 0;p<PI/2;p+= PI/pidiv) this.mesh.push(vec2(radius[0] ,radius[0]), p, vec4(1,0,0,0), 1,0)	
				for(var p = 0;p<PI/2;p+= PI/pidiv) this.mesh.push(vec2(width - radius[1], radius[1]), p + PI/2, vec4(0,1,0,0), 1,0)
				for(var p = 0;p<PI/2;p+= PI/pidiv) this.mesh.push(vec2(width - radius[2], height - radius[2]), p + PI, vec4(0,0,1,0), 1,1)
				for(var p = 0;p<PI/2;p+= PI/pidiv) this.mesh.push(vec2(radius[3], height - radius[3]), p + PI + PI/2, vec4(0,0,0,1), 0,1)
				
				this.mesh.push(vec2( radius[0] ,radius[0]), 0, vec4(1,0,0,0), 1,0)
			}	
		}

		this.color = function(){
			return view.bgcolor
		}

		this.position = function(){
			var pos = mesh.pos.xy
			var ca = cos(mesh.angle + PI)
			var sa = sin(mesh.angle + PI)
			
			var rad  = (mesh.radmult.x * view.borderradius.x + mesh.radmult.y * view.borderradius.y + mesh.radmult.z * view.borderradius.z + mesh.radmult.w * view.borderradius.w)
			pos.x += ca * rad
			pos.y += sa * rad
			
			uv = vec2(pos.x/view.width,  pos.y/view.height)
			
			sized = vec2(pos.x, pos.y)
			return vec4(sized.x, sized.y, 0, 1) * view.totalmatrix * view.viewmatrix
		}
	})

	// the blending shader
	define.class(this, 'blend', this.Shader, function(){
		this.omit_from_shader_list = true
		this.texture = Shader.prototype.Texture.fromType('rgba_depth_stencil')
		this.mesh = vec2.array()
		this.mesh.pushQuad(0,0, 0,1, 1,0, 1,1)
		this.width = 0
		this.height = 0

		this.color = function(){
			return texture.sample(mesh.xy)
		}

		this.position = function(){
			return vec4( mesh.x * width, mesh.y * height, 0, 1) * view.layermatrix * view.viewmatrix
		}
	})
	/*
	// rounded corner border shader
	define.class(this, 'border', this.Shader, function(){
		this.vertexstruct = define.struct({
			pos: vec2,
			angle: float,
			radmult: vec4,			
			uv:vec2
		})
		
		this.matrix = mat4.identity()
		this.viewmatrix = mat4.identity()

		this.mesh = this.vertexstruct.array()

		this.width = 0.0
		this.height = 0.0

		this.bordercolor = vec4("black")
		this.borderwidth = 0.0
		this.borderradius = vec4(0.0)

		this.has_guid = true

		this.geomradius = vec4(0)
		this.geomwidth = 0
		this.geomheight = 0
		this.geomborder = 0

		this.draw_type = "TRIANGLE_STRIP"

		this.update = function(view){
			// copy over view properties
			var width = this._width = view._size[0]
			var height = this._height= view._size[1]
			var borderradius = this._borderradius = view._borderradius
			var borderwidth = this._borderwidth = view._bordewrwidth

			if (borderwidth != this.geomborder || this.geomheight != height || this.geomwidth != width || vec4.equals(radius, this.geomradius) == false){
				
				this.geomborder  = borderwidth;
				this._radius = radius;
				this._borderwidth = borderwidth;


				this.geomradius = radius;
				this.geomheight = height;
				this.geomwidth = width;
			}
		}
		
		this.buildGeometry = function(width, height){
			
			//this.mesh.clear();
			this.mesh = this.vertexstruct.array();
			
			var scale0 = (Math.max(0, this._radius[0]-this._borderwidth[0]))/this._radius[0];
			var scale1 = (Math.max(0, this._radius[1]-this._borderwidth[0]))/this._radius[1];
			var scale2 = (Math.max(0, this._radius[2]-this._borderwidth[0]))/this._radius[2];
			var scale3 = (Math.max(0, this._radius[3]-this._borderwidth[0]))/this._radius[3];
			
			var pidiv = 20;
				
			for(var p = 0; p < PI / 2; p += PI / pidiv){
				this.mesh.push(vec2( this._radius[0] ,this._radius[0]), p, vec4(1,0,0,0), 1,0);
				this.mesh.push(vec2( this._radius[0] ,this._radius[0]), p, vec4(scale0,0,0,0), 1,0);
			}
			
			for(var p = 0;p<PI/2;p+= PI/pidiv){
				this.mesh.push(vec2(width-this._radius[1],this._radius[1]), p + PI/2, vec4(0,1,0,0), 1,0);
				this.mesh.push(vec2(width-this._radius[1],this._radius[1]), p + PI/2, vec4(0,scale1,0,0), 1,0);
			}
			for(var p = 0;p<PI/2;p+= PI/pidiv){
				this.mesh.push(vec2(width-this._radius[2],height-this._radius[2]), p + PI, vec4(0,0,1,0), 1,1);
				this.mesh.push(vec2(width-this._radius[2],height-this._radius[2]), p + PI, vec4(0,0,scale2,0), 1,1);
			}
			for(var p = 0;p<PI/2;p+= PI/pidiv){
				this.mesh.push(vec2(this._radius[3],height-this._radius[3]), p + PI + PI/2, vec4(0,0,0,1), 0,1);
				this.mesh.push(vec2(this._radius[3],height-this._radius[3]), p + PI + PI/2, vec4(0,0,0,scale3), 0,1);
			}				
			this.mesh.push(vec2( this._radius[0] ,this._radius[0]), 0, vec4(1,0,0,0), 1,0);
			this.mesh.push(vec2( this._radius[0] ,this._radius[0]), 0, vec4(scale0,0,0,0), 1,0);
		
		}
		this.color = function(){return bordercolor;};
		this.position = function(){
			var pos = mesh.pos.xy;
			var ca = cos(mesh.angle + PI);
			var sa = sin(mesh.angle+PI);
			
			var rad  = dot(mesh.radmult, radius);
			pos.x += ca * rad;
			pos.y += sa * rad;
			
			uv = vec2(pos.x/width,  pos.y/height);
			
			sized = vec2(pos.x, pos.y)
			return vec4(sized.x, sized.y, 0, 1) * matrix * viewmatrix
		}
	})
*/

	this.startMotion = function(obj, key, value){
		var config = obj.getAttributeConfig(key)
		var first = obj['_' + key]
		var trk = new Animate(config, obj, key, first, value)
		var animkey = obj.interfaceguid + '_' + key
		this.anims[animkey] = trk
		obj.setDirty(true)
		return true
	}

	this.doAnimation = function(time){
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
				anim.obj.setDirty(true)
			}
			else{
				anim.obj.emit(anim.key, value)
				anim.obj.setDirty(true)
				if(!hasanim) hasanim = true
			}
		}

		return hasanim
	}


})