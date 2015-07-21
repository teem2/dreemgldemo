define.browser(function(require, view){
	this.render = function(){return[
		view({x:3, y:30, w:300, h:300, 'bg.bgcolorfn':function(pos, tex){
			return mix('red', 'green', mesh.x)
		}}), 
		view({x:30, y:20, w:100, h:100, bgcolor:'red'})
		]
	}
})