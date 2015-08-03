// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Parts copyright 2012 Google, Inc. All Rights Reserved. (APACHE 2.0 license)
define.class('$gl/glshader', function(require, exports, self){
	
	var GLTexture = require('$gl/gltexture')
	var fontParser = require('$parsers/fontparser')

	// our font blob
	this.font = fontParser(require('$fonts/code_font2_ascii.glf'))

	//this.has_guid = false

	// initial pixel and vertex shaders
	this.matrix = mat4.identity();
	this.position = "glyphy_mesh()"
	this.textcolor = vec4(0.9, 0.9, 0.9, 1);
	this.color = "glyphy_pixel()"//" * textcolor"

	// lets define a custom struct and subclass the array
	this.text = define.struct({
		pos:vec2,
		tex:vec2,
		tag:vec4,
	}).extend(function(exports, self){
		this.start_x = 0
		this.start_y = null
		this.text_x = 0
		this.text_y = 0
		this.add_x = 0
		this.add_y = 0

		this.font_size = 10
		this.line_spacing = 1.3
		this.italic_ness = 0
		// defines the line 
		this.cursor_spacing = 1.3
		this.cursor_sink = 0.32
		
		this.boldness = 0
		this.scaling = 0
		this.distance = 0
		this.gamma_adjust = vec3(1.2)
		this.outline = false
		this.debug = false
		this.contrast = 1.4
		this.outline_thickness = 4//:device.ratio
		
		this.subpixel_off = 1.0115
		this.subpixel_distance = 3.
		
		this.bgcolor = vec3('black')
		this.fgcolor = vec4('white')
		
		this.__defineGetter__('line_height', function(){
			return this.font_size * this.line_spacing
		})
		
		this.__defineGetter__('min_y', function(){
			return this.font_size * this.line_spacing
		})
		
		this.__defineGetter__('block_y', function(){
			return this.add_y - this.line_height + this.cursor_sink * this.font_size
		})
		
		this.clear = function(){
			this.text_w = 0
			this.text_h = 0
			this.add_x = this.start_x
			this.add_y = this.start_y === null? this.min_y:0
		}

		this.addGlyph = function(info, unicode){
			var x1 = this.add_x + this.font_size * info.min_x
			var x2 = this.add_x + this.font_size * info.max_x
			var y1 = this.add_y - this.font_size * info.min_y
			var y2 = this.add_y - this.font_size * info.max_y
			var italic = this.italic_ness * info.height * this.font_size
			if(this.font.baked){
				this.pushQuad(
					x1, y1, info.tmin_x, info.tmin_y, unicode, 0, 0, 0,
					x2, y1, info.tmax_x, info.tmin_y, unicode, 0, 0, 0,
					x1 + italic, y2, info.tmin_x, info.tmax_y, unicode, 0, 0, 0,
					x2 + italic, y2, info.tmax_x, info.tmax_y, unicode, 0, 0, 0
				)
			}
			else{
				var gx = ((info.atlas_x<<6) | info.nominal_w)<<1
				var gy = ((info.atlas_y<<6) | info.nominal_h)<<1
				
				this.pushQuad(
					x1, y1, gx, gy, unicode, 0, 0, 0,
					x2, y1, gx|1, gy, unicode, 0, 0, 0,
					x1 + italic, y2, gx, gy|1, unicode, 0, 0, 0,
					x2 + italic, y2, gx|1, gy|1, unicode, 0, 0, 0
				)
			}
			this.add_x += info.advance * this.font_size
			if(this.add_x > this.text_w) this.text_w = this.add_x
		}

		// lets add some strings
		this.add = function(string, x, y){
			if(x !== undefined) this.add_x = x 
			if(y !== undefined) this.add_y = y 
			var length = string.length
			// alright lets convert some text babeh!
			for(var i = 0; i < length; i++){
				var unicode = string.charCodeAt(i)
				var info = this.font.glyphs[unicode]
				if(!info) info = this.font.glyphs[32]
				// lets add some vertices
				this.addGlyph(info, unicode)
				if(unicode == 10){ // newline
					this.add_x = this.start_x
					this.add_y += this.font_size * this.line_spacing
				}
			}
			if(this.add_y > this.text_h) this.text_h = this.add_y	
		}

		this.__defineGetter__('char_count', function(){
			return this.quadLength()
		})
	})

	// for type information
	this.mesh = this.text.array()
	this.mesh.font = this.font
	this.font.texture = GLTexture.fromArray(this.font.tex_array, this.font.tex_geom[0], this.font.tex_geom[1])

	// this thing makes a new text array buffer
	this.newText = function(font, length){
		var buf = this.text.array() 
		// load the font
		// check if the font has a loaded texture
		buf.font = this.font
		return buf
	}

	this.subpixel = false

	this.atConstructor = function(){
		// lets check 
		if(this.font instanceof ArrayBuffer) this.font = fontParser(this.font)
		
		if(!this.mesh.font) this.mesh.font = this.font
		if(this.font.baked){
			this.glyphy_mesh = this.glyphy_mesh_sdf
			// load the sdf texture
			if(this.subpixel){
				this.glyphy_pixel = this.glyphy_sdf_draw_subpixel_5tap
			}
			else{
				this.glyphy_pixel = this.glyphy_sdf_draw
			}
		}
		else{
			// load the atlas
			this.glyphy_mesh = this.glyphy_mesh_atlas
			this.glyphy_pixel = this.glyphy_atlas_draw
		}
	}

	this.glyphy_mesh_sdf = function(){
		return mesh.pos * matrix
	}

	// glyphy shader library
	this.GLYPHY_INFINITY = '1e9'
	this.GLYPHY_EPSILON = '1e-5'
	this.GLYPHY_MAX_NUM_ENDPOINTS = '32'
	
	this.paint = function(p, dpx, dpy, m){
		if(mesh.tag.x == 32.) discard
		return vec4(-1.)
	}

	this.style = function(pos){
	}

	this.glyphy_arc_t = define.struct({
		p0:vec2,
		p1:vec2,
		d:float
	},'glyphy_arc_t')

	this.glyphy_arc_endpoint_t = define.struct({
		/* Second arc endpoint */
		p:vec2,
		/* Infinity if this endpoint does not form an arc with the previous
		 * endpoint.  Ie. a "move_to".  Test with glyphy_isinf().
		 * Arc depth otherwise.  */
		d:float
	},'glyphy_arc_endpoint_t')

	this.glyphy_arc_list_t = define.struct({
		/* Number of endpoints in the list.
		 * Will be zero if we're far away inside or outside, in which case side is set.
		 * Will be -1 if this arc-list encodes a single line, in which case line_* are set. */
		num_endpoints:int,

		/* If num_endpoints is zero, this specifies whether we are inside(-1)
		 * or outside(+1).  Otherwise we're unsure(0). */
		side:int,
		/* Offset to the arc-endpoints from the beginning of the glyph blob */
		offset:int,

		/* A single line is all we care about.  It's right here. */
		line_angle:float,
		line_distance:float /* From nominal glyph center */
	},'glyphy_arc_list_t')

	this.glyphy_isinf = function(v){
		return abs(v) >= GLYPHY_INFINITY * .5
	}

	this.glyphy_iszero = function(v){
		return abs(v) <= GLYPHY_EPSILON * 2.
	}

	this.glyphy_ortho = function(v){
		return vec2(-v.y, v.x)
	}

	this.glyphy_float_to_byte = function(v){
		return int(v *(256. - GLYPHY_EPSILON))
	}

	this.glyphy_vec4_to_bytes = function(v){
		return ivec4(v *(256. - GLYPHY_EPSILON))
	}

	this.glyphy_float_to_two_nimbles = function(v){
		var f = glyphy_float_to_byte(v)
		return ivec2(f / 16, int(mod(float(f), 16.)))
	}

	/* returns tan(2 * atan(d)) */
	this.glyphy_tan2atan = function( d){
		var a = (2. * d)
		var b = (1. - d * d)
		return a/b
	}

	this.glyphy_arc_endpoint_decode = function(v, nominal_size){
		var p =(vec2(glyphy_float_to_two_nimbles(v.a)) + v.gb) / 16.
		var d = v.r
		if(d == 0.) d = GLYPHY_INFINITY
		else d = float(glyphy_float_to_byte(d) - 128) * .5 / 127.

		return glyphy_arc_endpoint_t(p * vec2(nominal_size), d)
	}

	this.glyphy_arc_center = function(a){
		return mix(a.p0, a.p1, .5) +
		 glyphy_ortho(a.p1 - a.p0) /(2. * glyphy_tan2atan(a.d))
	}

	this.glyphy_arc_wedge_contains = function(a, p){
		var d2 = glyphy_tan2atan(a.d)
		return dot(p - a.p0,(a.p1 - a.p0) * mat2(1,  d2, -d2, 1)) >= 0. &&
		 dot(p - a.p1,(a.p1 - a.p0) * mat2(1, -d2,  d2, 1)) <= 0.
	}

	this.glyphy_arc_wedge_signed_dist_shallow = function(a, p){
		var v = normalize(a.p1 - a.p0)
		
		var line_d = dot(p - a.p0, glyphy_ortho(v))// * .1abs on sin(time.sec+p.x)

		if(a.d == 0.) 
			return line_d
		var d0 = dot((p - a.p0), v)
		if(d0 < 0.) 
			return sign(line_d) * distance(p, a.p0) 

		var d1 = dot((a.p1 - p), v)
		if(d1 < 0.) 
			return sign(line_d) * distance(p, a.p1)

		var d2 = d0 * d1
		var r = 2. * a.d * d2 
		r = r / d2
		if(r * line_d > 0.) 
			return sign(line_d) * min(abs(line_d + r), min(distance(p, a.p0), distance(p, a.p1)))
	
		return line_d + r
	}

	this.glyphy_arc_wedge_signed_dist = function(a, p){
		if(abs(a.d) <= .03) return glyphy_arc_wedge_signed_dist_shallow(a, p)
		var c = glyphy_arc_center(a)
		return sign(a.d) * (distance(a.p0, c) - distance(p, c))
	}

	this.glyphy_arc_extended_dist = function(a, p){
		/* Note: this doesn't handle points inside the wedge. */
		var m = mix(a.p0, a.p1, .5)
		var d2 = glyphy_tan2atan(a.d)
		if(dot(p - m, a.p1 - m) < 0.)
			return dot(p - a.p0, normalize((a.p1 - a.p0) * mat2(+d2, -1, +1, +d2)))
		else
			return dot(p - a.p1, normalize((a.p1 - a.p0) * mat2(-d2, -1, +1, -d2)))
	}

	this.glyphy_arc_list_offset = function(p, nominal_size){
		var cell = ivec2(clamp(floor(p), vec2(0.,0.), vec2(nominal_size - 1)))
		return cell.y * nominal_size.x + cell.x
	}

	this.glyphy_arc_list_decode = function(v, nominal_size){
		
		var l = glyphy_arc_list_t()
		var iv = glyphy_vec4_to_bytes(v)

		l.side = 0 /* unsure */

		if(iv.r == 0) { /* arc-list encoded */
			l.offset = (iv.g * 256) + iv.b
			l.num_endpoints = iv.a
			if(l.num_endpoints == 255) {
				l.num_endpoints = 0
				l.side = -1
			} 
			else if(l.num_endpoints == 0){
				l.side = 1
			}

		} 
		else { /* single line encoded */
			l.num_endpoints = -1
			l.line_distance = float(((iv.r - 128) * 256 + iv.g) - 0x4000) / float(0x1FFF)
											* max(float(nominal_size.x), float(nominal_size.y))
			l.line_angle = float(-((iv.b * 256 + iv.a) - 0x8000)) / float(0x7FFF) * 3.14159265358979
		}
		return l
	}

	this.glyphy_antialias = function(d){
		return smoothstep(-.75, +.75, d)
	}

	this.glyphy_arc_list = function(p, nominal_size, _atlas_pos){
		var cell_offset = glyphy_arc_list_offset(p, nominal_size)
		var arc_list_data = glyphy_atlas_lookup(cell_offset, _atlas_pos)
		return glyphy_arc_list_decode(arc_list_data, nominal_size)
	}

	this.glyphy_sdf = function(p, nominal_size, _atlas_pos){

		var arc_list = glyphy_arc_list(p, nominal_size, _atlas_pos)

		/* Short-circuits */
		if(arc_list.num_endpoints == 0) {
			/* far-away cell */
			return GLYPHY_INFINITY * float(arc_list.side)
		} 
		if(arc_list.num_endpoints == -1) {
			/* single-line */
			var angle = arc_list.line_angle 
			var n = vec2(cos(angle), sin(angle))
			return dot(p -(vec2(nominal_size) * .5), n) - arc_list.line_distance
		}

		var side = float(arc_list.side)
		var min_dist = GLYPHY_INFINITY
		var closest_arc = glyphy_arc_t()
		var endpoint = glyphy_arc_endpoint_t()
		var endpoint_prev = glyphy_arc_endpoint_decode(glyphy_atlas_lookup(arc_list.offset, _atlas_pos), nominal_size)
		
		for(var i = 1; i < GLYPHY_MAX_NUM_ENDPOINTS; i++){
			if(i >= arc_list.num_endpoints) {
				break
			}

			endpoint = glyphy_arc_endpoint_decode(glyphy_atlas_lookup(arc_list.offset + i, _atlas_pos), nominal_size)
			
			var a = glyphy_arc_t(endpoint_prev.p, endpoint.p, endpoint.d)
			a.p0 = endpoint_prev.p;
			a.p1 = endpoint.p;
			a.d = endpoint.d;

			endpoint_prev = endpoint
			
			if(!glyphy_isinf(a.d)){

				if(glyphy_arc_wedge_contains(a, p)) {
					var sdist = glyphy_arc_wedge_signed_dist(a, p)
					var udist = abs(sdist) * (1. - GLYPHY_EPSILON)
					if(udist <= min_dist) {
						min_dist = udist 
						
						side = sdist <= 0. ? -1. : +1.
					}
				} 
				else {
					var udist = min(distance(p, a.p0), distance(p, a.p1))
					if(udist < min_dist) {
						min_dist = udist
						side = 0. /* unsure */
						closest_arc = a
					}
					else if(side == 0. && udist == min_dist) {
						/* If this new distance is the same as the current minimum,
						* compare extended distances.  Take the sign from the arc
						* with larger extended distance. */
						var old_ext_dist = glyphy_arc_extended_dist(closest_arc, p)
						var new_ext_dist = glyphy_arc_extended_dist(a, p)

						var ext_dist = abs(new_ext_dist) <= abs(old_ext_dist) ?
							old_ext_dist : new_ext_dist

						//#ifdef GLYPHY_SDF_PSEUDO_DISTANCE
						/* For emboldening and stuff: */
						min_dist = abs(ext_dist)
						//#endif
						side = sign(ext_dist)
					}
				}
			}
		}

		if(side == 0.) {
			// Technically speaking this should not happen, but it does.  So try to fix it.
			var ext_dist = glyphy_arc_extended_dist(closest_arc, p)
			side = sign(ext_dist)
		}
		
		return min_dist * side
	}

	this.glyphy_point_dist = function(p, nominal_size, _atlas_pos){
		var arc_list = glyphy_arc_list(p, nominal_size, _atlas_pos)

		var side = float(arc_list.side)
		var min_dist = GLYPHY_INFINITY
		
		if(arc_list.num_endpoints == 0){
			return min_dist
		}
		var endpoint  = glyphy_arc_endpoint_t()
		var endpoint_prev = glyphy_arc_endpoint_decode(glyphy_atlas.lookup(arc_list.offset, _atlas_pos), nominal_size)
		for(var i = 1; i < GLYPHY_MAX_NUM_ENDPOINTS; i++) {
			if(i >= arc_list.num_endpoints) {
				break
			}
			endpoint = glyphy_arc_endpoint_decode(glyphy_atlas.lookup(arc_list.offset + i, _atlas_pos), nominal_size)
			if(glyphy_isinf(endpoint.d)) continue
			min_dist = min(min_dist, distance(p, endpoint.p))
		}
		return min_dist
	}

	this.glyph_vertex_transcode = function(v){
	  var g = ivec2 (v)
	  var corner = ivec2 (mod (v, 2.))
	  g /= 2
	  var nominal_size = ivec2 (mod (vec2(g), 64.))
	  return vec4(corner * nominal_size, g * 4)
	}

	this.glyphy_sdf_encode = function(value){
		var enc = .75-.25*value
		return vec4(enc,enc,enc,1.)
	}

	this.glyphy_sdf_decode = function(value){
		return ((.75-value.r)*4.) 
	}

	this.glyphy_sdf_generate = function(){
		var glyph = glyph_vertex_transcode(glyphy_coords)
		var nominal_size = (ivec2(mod(glyph.zw, 256.)) + 2) / 4
		var atlas_pos = ivec2(glyph.zw) / 256

		var p = glyph.xy
		return glyphy_sdf_encode(glyphy_sdf(p, nominal_size, atlas_pos))
	}

	this.glyphy_sdf_draw_subpixel_3tap = function(){

		var pos = mesh.tex
		/* isotropic antialiasing */
		var dpdx = dFdx(pos) // this should mark it pixel and redo the function with a new highmark
		var dpdy = dFdy(pos)
		var m = length(vec2(length(dpdx), length(dpdy))) * SQRT_1_2
		// screenspace length
		mesh.scaling = 500.*m 
		var fin_alpha = 1.
		var sub_delta = dpdx / mesh.subpixel_distance
		var exit = paint(p, dpdx, dpdy, m)
		if(exit.a>=0.){
			return exit
		}
		var distance = vec3(
			glyphy_sdf_decode(sdf_texture.sample(pos - sub_delta)),
			glyphy_sdf_decode(sdf_texture.sample(pos)),
			glyphy_sdf_decode(sdf_texture.sample(pos + sub_delta))
		)*0.003

		style(pos) // per pixel styling callback

		distance -= mesh.boldness / 300.
		distance = distance / m * mesh.contrast

		if(mesh.outline){
			distance = abs(distance) - mesh.outline_thickness
		}
		var col = mesh.bgcolor
		if(distance.g > 1. )
			discard

		var alpha = glyphy_antialias(-distance)
		if(m>mesh.subpixel_off){ // turn off subpixel at a certain size
			return vec4(u_color, alpha.g)
		}
		alpha = pow(alpha, mesh.gamma_adjust)

		var max_alpha = max(max(alpha.r,alpha.g),alpha.b) * fin_alpha
		if(max_alpha >0.2) max_alpha = 1.
		return vec4(mix(mesh.bgcolor, mesh.fgcolor, alpha), max_alpha)
	}

	// draw subpixel antialiased using SDF texture
	this.glyphy_sdf_draw_subpixel_5tap = function(){

		var pos = mesh.tex
		/* isotropic antialiasing */
		var dpdx = dFdx(pos) // this should mark it pixel and redo the function with a new highmark
		var dpdy = dFdy(pos)
		var m = min(length(vec2(length(dpdx), length(dpdy))) * SQRT_1_2, 0.03)
		// screenspace length
		mesh.scaling = 500.*m 
		var fin_alpha = 1.
		var sub_delta = dpdx / mesh.subpixel_distance

		var exit = paint(pos, dpdx, dpdy, m)
		if(exit.a>=0.){
			return exit
		}

		var v1 = glyphy_sdf_decode(mesh.font.texture.sample(pos - sub_delta*2.))
		var v2 = glyphy_sdf_decode(mesh.font.texture.sample(pos - sub_delta))
		var v3 = glyphy_sdf_decode(mesh.font.texture.sample(pos))
		var v4 = glyphy_sdf_decode(mesh.font.texture.sample(pos + sub_delta))
		var v5 = glyphy_sdf_decode(mesh.font.texture.sample(pos + sub_delta*2.))

		var distance = vec3(
			v1+v2+v3,
			v2+v3+v4,
			v3+v4+v5
		) * 0.001

		style(pos) // per pixel styling callback

		distance -= mesh.boldness / 300.
		distance = distance / m * mesh.contrast

		if(mesh.outline){
			distance = abs(distance) - mesh.outline_thickness
		}

		var col = mesh.bgcolor
		if(distance.g > 1. )
			discard

		var alpha = glyphy_antialias(-distance)
		if(m > mesh.subpixel_off){ // turn off subpixel at a certain size
			return vec4(mesh.fgcolor, alpha.g)
		}
		alpha = pow(alpha, mesh.gamma_adjust)
		var max_alpha = max(max(alpha.r,alpha.g),alpha.b) * fin_alpha
		if(max_alpha >0.2) max_alpha = 1.
		return vec4(mix(mesh.bgcolor, mesh.fgcolor, alpha), max_alpha)
	}
	// draw using SDF texture
	this.glyphy_sdf_draw = function(){
		var pos = mesh.tex
		/* isotropic antialiasing */
		var dpdx = dFdx(pos) // this should mark it pixel and redo the function with a new highmark
		var dpdy = dFdy(pos)
		var m = length(vec2(length(dpdx), length(dpdy))) * SQRT_1_2
		// screenspace length
		mesh.scaling = 500.*m 
		var dist_sample = mesh.font.texture.sample(pos)
		var gsdist = glyphy_sdf_decode(dist_sample)

		mesh.distance = gsdist * 0.003
		
		var exit = paint(pos, dpdx, dpdx, m)
		if(exit.a >= 0.){
			return exit
		}

		style(pos) // per pixel styling callback

		mesh.distance -= mesh.boldness / 300.
		mesh.distance = mesh.distance / m * mesh.contrast

		if(mesh.outline)
			mesh.distance = abs(mesh.distance) - mesh.outline_thickness

		if(mesh.distance > 1.)
			discard

		var alpha = glyphy_antialias(-mesh.distance)
		
		//if(u_gamma_adjust != 1.)
		var alpha3 = pow(vec3(alpha), mesh.gamma_adjust)
		
		return vec4(mesh.fgcolor.rgb, alpha3) 
	}

	this.glyphy_atlas_lookup = function(offset, _atlas_pos){
		var pos = (vec2(_atlas_pos.xy * mesh.font.item_geom +
			ivec2(mod(float(offset), mesh.font.item_geom_f.x), offset / mesh.font.item_geom.x)) +
			vec2(.5, .5)) / mesh.font.tex_geom_f

		return texture2D(mesh.font.texture, pos, {
			MIN_FILTER: 'NEAREST',
			MAG_FILTER: 'NEAREST',
			WRAP_S: 'CLAMP_TO_EDGE',
			WRAP_T: 'CLAMP_TO_EDGE'
		})
	}
	this.glyphy_mesh = 
	this.glyphy_mesh_atlas = function(){
		glyph = glyph_vertex_transcode(mesh.tex)
		return mesh.pos * matrix
	}
	// draw using atlas
	this.time = 0
	this.glyphy_pixel = 
	this.glyphy_atlas_draw = function(){
		//'trace'
		var nominal_size = (ivec2(mod(glyph.zw, 256.)) + 2) / 4
		var atlas_pos = ivec2(glyph.zw) / 256

		var pos = glyph.xy
		/* isotropic antialiasing */
		var dpdx = dFdx(pos) // this should mark it pixel and redo the function with a new highmark
		var dpdy = dFdy(pos)
		var m = length(vec2(length(dpdx), length(dpdy))) * SQRT_1_2

		mesh.distance = glyphy_sdf(pos, nominal_size, atlas_pos) //+ noise.noise3d(vec3(glyph.x, glyph.y, time))*0.6
		mesh.scaling = m

		//return mix(vec4(0.),'green',1.-mesh.distance)
		//mesh.outline = true
		//dump = mesh.distance
		var exit = paint(pos, dpdx, dpdx, m)
		if(exit.a >= 0.){
			return exit
		}
		style(glyph)
		
		mesh.distance -= mesh.boldness 
		//debug(mesh.distance)
		var sdist = mesh.distance / m * mesh.contrast

		if(mesh.outline){
			sdist = abs(sdist) - (mesh.outline_thickness)
		}

		if(sdist > 1.){
			discard
		}
		
		var alpha = glyphy_antialias(-sdist)
		
		
		if(mesh.gamma_adjust.r != 1.){
		//	alpha = pow(alpha, 1. / mesh.gamma_adjust.r)
		}
		
		return vec4(mesh.fgcolor.rgb, alpha * mesh.fgcolor.a)
	}
})