// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// view class

define.class(function(sprite, text, view){

	var testdata = {
		name:'node0',
		children:[
				{name:'node1',	children:[
						{name:'node1a'}
					]},
				{name:'node1',	children:[
						{name:'node1a'}
					]},
				{name:'node2' },
				{name:'node1',	children:[
						{name:'node1a'},
						{name:'node1',	children:[
							{name:'node1a',	children:[
									{name:'node1a',	children:[
											{name:'node1a'}
										]}
								]},{name:'oddnode'}
							]}
					]},
			]}

	function recur(node){
		var accum = 0
		// view
		// collapse button
		// title

		// collapsible subbox: 
		// recursive treeitmes
		var res = view({margin: 2, flexdirection:"column", bgcolor: "#304030" , tag:"treeitem container"}, text({ text:'- ' + node.name, margin: 2, height: 30,width: 100 , tag: "item label", bgcolor: "transparent" }));
		
		
		
		if (node.children && node.children.length > 0) {	
			var container = view({  bgcolor: "teal" , flexdirection: "column", margin: 5, padding: 5, tag: "subitem container"});
			res.children.push(container);
			container.children = [];
			
			for (a in node.children) {
				var subres = recur(node.children[a]);
				container.children.push(subres);
			}
		}

		return  res;	
	}
	
	function viewtree(node, prefix){
		console.log((prefix?prefix:"") + node.constructor.name + (node.tag?(" "+ node.tag):""));;
	var 	prefix = (prefix!=undefined)?prefix+"-": "";
		for(a in node.children)
		{
			viewtree(node.children[a], prefix);
		}
	}
	
	this.render = function(){
		// ok so how do we process the testdata
		// lets make a textnode
		var treeres = view({bgcolor: "blue", alignItems: "flex-start", flexdirection:"row", alignself: 'stretch', alignitems: 'stretch' },recur(testdata));;
		
		//viewtree(treeres,"");	
		
		
		return treeres;
	}
})