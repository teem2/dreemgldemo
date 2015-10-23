//Pure JS based composition
define.class(function(composition, screens, screen, view, text, draggable){

	this.render = function(){ return [
		screens(
			screen({
				attr_mousepos:{type:vec2},
				name:'mobile',
				},
				view({
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
					bgcolor: 'blue',
					init: function(){
						console.log("screen2")
					}
				})
			)
		)
	]}
})