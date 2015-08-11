// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// view class

define.class(function(sprite, text, view, button){

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
	
	var treeitem = view.extend(function(){
		this.flex = 1.0;
		this.attribute("text", {type:String, value:""});
		this.attribute("fontsize", {type:float, value:12});
		this.flexdirection = "row" ;
		this.position = "relative";
		this.render = function(){
			return [button({text: ">", margin: 3, padding:3, fontsize: this.fontsize }), text({text:this.text, bgcolor: this.bgcolor, fgcolor: this.fgcolor, fontsize: this.fontsize})];
		}
		
	});
	
	function recur(node){
		var accum = 0
		// view
		// collapse button
		// title

		// collapsible subbox: 
		// recursive treeitmes
		
		var res = view({ flexdirection:"column", margin: 0, padding: 0, bgcolor: "transparent" , tag:"treeitem container"}, treeitem({ fontsize: 16,text: node.name, flex:1, tag: "item label", bgcolor: "transparent" , fgcolor: "black"}));
		
		if (node.children && node.children.length > 0) {	
			var container = view({  bgcolor: "transparent" , flexdirection: "column", paddingleft: 10, tag: "subitem container"});
			res.children.push(container);
			
			container.children = [];
			
			for (var a in node.children) {				
				container.children.push(recur(node.children[a]));
			}
		}
		return  res;	
	}
	
	function viewtree(node, prefix){
		console.log((prefix?prefix:"") + node.constructor.name + (node.tag?(" "+ node.tag):""));;
		var prefix = (prefix!=undefined)?prefix+"-": "";
		for(a in node.children){
			viewtree(node.children[a], prefix);
		}
	}
	
	this.bordercolor= vec4("gray");
	this.cornerradius=0;
	this.borderwidth=2;
	this.padding= 4;
	this.bgcolor = vec4("white");
	
	this.bggradient = function(a,b){
		return mix(bgcolor, bgcolor *0.8, a.y *a.y);
	}
	
	this.bg.bgcolorfn= this.bggradient;
	this.flexdirection="column";
	this.flex= 1;
	this.alignself="stretch" ;
	
	this.render = function(){
		// ok so how do we process the testdata
		// lets make a textnode
		var treeres =recur(testdata);
		
		//viewtree(treeres,"");	
		
		
		return treeres;
	}
})