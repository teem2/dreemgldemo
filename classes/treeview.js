// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// view class

define.class(function(sprite, text){

	var testdata = {
		name:'node0',
		children:[{
			name:'node1',
			children:[
				{name:'node1a'}
			]},{
			name:'node2'
			}
		]
	}

	function recur(node, ox, oy){
		var accum = 0
		return text({x:ox, y:20 + oy * 20, text:'- ' + node.name, position: "relative" },
			node.children && node.children.map(function(value, i){ return recur(value, ox+10, accum++);})
		)
	}

	this.render = function(){
		// ok so how do we process the testdata
		// lets make a textnode
		return recur(testdata, 0, 0)
	}
})