// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// view class

define.class(function(sprite, text, view){

	var testdata = {
		name:'node 0',
		children:[
				{name:'node 0-0',	children:[
						{name:'node 0-0-0 '}
					]},
				{name:'node 0-1',	children:[
						{name:'node 0-1-0'}
					]},
				{name:'node 0-2' },
				{name:'node 0-3',	children:[
						{name:'node 0-3-0'},
						{name:'node 0-3-1',	children:[
							{name:'node 0-3-1-0',	children:[
									{name:'node 0-3-1-0-0', children:[
											{name:'node1a'}
										]}
								]},
								{name:'oddnode WTF IS WRONG WITH YOU'}
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
		
		var res = view({ flexdirection:"column", margin: 0, padding: 0, bgcolor: "transparent" , tag:"treeitem container"}, text({ text:'- ' + node.name, height: 20,width: 100 , tag: "item label", bgcolor: "transparent" , fgcolor: "black"}));
		
		
		if (node.children && node.children.length > 0) {	
			var container = view({  bgcolor: "transparent" , flexdirection: "column", paddingleft: 10, tag: "subitem container"});
			res.children.push(container);
			container.children = [];
			
			for (var a in node.children) 
			{				
				container.children.push(recur(node.children[a]));
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
		var treeres = view({bordercolor: "gray", cornerradius:0, borderwidth:2,padding: 4, bgcolor: "#e0e0e0", flexdirection:"column", flex: 1, alignself:"stretch"  },recur(testdata));;
		
		//viewtree(treeres,"");	
		
		
		return treeres;
	}
})