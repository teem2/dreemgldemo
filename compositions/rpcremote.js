//Pure JS based composition
define.class(function(composition, screens, screen, server, view, text, draggable){

	this.render = function(){ return [
		screens(
			screen({
				init:function(){
					console.log('hi!',this.rpc.server)
				},
				attribute_mousepos:{type:vec2, value:'${this.main.pos}'},
				name:'mobile',
				},
				view({
					name:'main',
					size:vec2(200, 200),
					bgcolor:vec4('yellow'),
					is:draggable()
				})
			),
			screen({name:'desktop'},
				view({
					size: vec2(200, 200),
					pos: '${this.rpc.screens.mobile.mousepos}',
					bgcolor: 'red',
					init: function(){
						console.log("screen2")
					}
				})
			)
		)
	]}
})