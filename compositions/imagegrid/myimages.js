
define.browserClass(function(require, view, view){
	
	var json = require('$compositions/dynagrid/top_movies.json')

	var myview = view.extend(function(){
		this.bg.bgcolorfn = function(pos, dist){
			//return 'red'
			var aspect = texture.size.y / texture.size.x
			var center = (1. - aspect) * .5
			var sam = vec2(pos.x * aspect, pos.y)
			var col = texture.sample(sam)

			if(sam.x < 0. || sam.x > 1.){
				return vec4(0.)//return 'red'
			}
			return col
		}
	})
	
	this.flexwrap = "wrap" ;
	this.flexdirection = "row";	
	this.flex = 1;
	this.render = function(){
		var tiles = []
		var results = json.searchResponse.results
		for(var i = 0; i < 40; i++){
			var imgs = results[i].movie.images
			var img = imgs[imgs.length-1]
			tiles.push(
				myview({
					margin: 10, 
					w:100,h:100,bgimage:img.url
				})
			)
		}
		return tiles
	}
})