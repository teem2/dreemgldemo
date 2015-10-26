//Pure JS based composition
define.class(function(composition, screens, screen, view, text, draggable){

	this.render = function(){ return [
		screens(
			screen({
				attribute_mousepos:{type:vec2, value:'${this.main.pos}'},
				name:'mobile',
				},
				view({
					name:'main',
					size: vec2(200, 200),
					bgcolor: vec4('blue'),
					is: draggable(),
					init: function(){
						// alright lets make this draggable. framerjs style
					}
				})
			),
			screen({name:'desktop',
				test: function(){
					console.log("test called on s2")
					return 20
				}},
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