//Pure JS based composition
define.class(function(composition, screens, screen, server, view, text, draggable){

	this.render = function(){ return [
		server({
			attribute_test:{type:int, value:10},
			dosomething:function(){
				console.log("dosomething called on server")
				this.test = 40
			}

		}),
		screens(
			screen({
				init:function(){
					this.rpc.server.test = function(value){
						console.log("Got server attribute!"+value)
					}
					this.rpc.server.dosomething()
				},
				attribute_mousepos:{type:vec2, value:'${this.main.pos}'},
				name:'mobile',
				},
				view({
					name:'main',
					size: vec2(200, 200),
					bgcolor: vec4('yellow'),
					is: draggable()
				})
			),
			screen({name:'desktop'},
				view({
					size: vec2(200, 200),
					pos: '${this.rpc.screens.mobile.mousepos}',
					bgcolor: 'red',
					init: function(){
						console.log("screen2", this.rpc.server.test)
					}
				})
			)
		)
	]}
})