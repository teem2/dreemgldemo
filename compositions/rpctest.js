//Pure JS based composition
define.class(function(composition, screens, screen, view, text){

	var fileio = define.class(function fileio(server){
		
		this.attribute('bla', {type:String, value:'test'})

		this.init = function(){
			console.log("Server loaded up!")
		}

		this.hello = function(){
			console.log("Received hello call!")
			console.log('calling s1')
			this.rpc.screens.s1.test().then(function(result){
				console.log('s1 returned '+result)
			})
			return 30
		}
	})

	this.render = function(){ return [
		fileio({name:'fileio'}),
		screens(
			screen({
				name:'s1', 
				test:function(){
					console.log("test called on s1!")
					return 10
				}},
				view({
					size: vec2(200,200),
					bgcolor: vec4('red'),
					init: function(){
						console.log("calling test on s2")
						this.rpc.screens.s2.test().then(function(result){
							console.log("s2 returned " + result)
						})
						console.log("calling fileio")
						this.rpc.fileio.hello().then(function(result){
							console.log('fileio returned '+result)
						})
						
					}
				})
			),
			screen({name:'s2',
				test:function(){
					console.log("test called on s2")
					return 20
				}},
				view({
					size: vec2(200,200),
					bgcolor: 'blue',
					init: function(){
						console.log("screen2")
					}
				})
			)
		)
	]}
})