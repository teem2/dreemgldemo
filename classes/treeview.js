// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// view class

define.class(function(sprite, text, view, button){

	var testdata = {
		name:'Root Node',
		children:[
				{name:'Child 1',	children:[
						{name:'node 0-0-0 '}
					]},
				{name:'Child 2',	children:[
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
								{name:'node with an earlier parent'}
							]}
					]},
			]}
			
	var itemheading = view.extend(function itemheading(){
		this.attribute("text", {type:String, value:""});
		
		this.render = function(){
			return [view({"bg.bgcolorfn": function(a,b){return vec4(vec3(1.-a.y/19.), 1.0)} ,flex:1},text({text: this.text, bgcolor: "transparent", fgcolor: "black"}))];
		}
	})
	var treeitem = view.extend(function (){
		this.flex = 1.0;
		
		
		this.attribute("text", {type:String, value:""});
		this.attribute("collapsed", {type:Boolean, value:false});
		this.attribute("bgcolor", {type:vec4, value:vec4("transparent")});
		this.attribute("fgcolor", {type:vec4, value:vec4("black")});
		this.attribute("fontsize", {type:float, value:12});
		this.flexdirection = "row" ;
		this.position = "relative";
		this.toggle = function(){
			if (!this.item.collapsed) this.item.collapsed = true;else this.item.collapsed = false;
			this.collapsed = this.item.collapsed;
			this.setDirty(true);
			
			console.log(this.item.name);
		};
		this.bgcolor = vec4("transparent");
		this.atConstructor = function(){
			//console.log("init!", this);
			console.log (this.item)
			if (!this.item.collapsed) this.item.collapsed = false;
		//	this.text = this.item.name;
		}
		this.count =0;
		this.render = function(){	
		
			this.collapsed;
			console.log("rendering", this.count++, this.item.name);		
			return [view({flexdirection:"column", flex:1},
							[itemheading({click: this.toggle.bind(this), text:this.item.name }),
								(this.item.collapsed==false)?
								view({bgcolor:"transparent",flexdirection:"row" },
											view({width:1,marginleft: 10,marginright: 10, bgcolor: "#c0c0c0" }), 
											view({bgcolor:"transparent",  flexdirection:"column" , flex:1},
													this.item.children?
													this.item.children.map(function(m){return treeitem({item: m})})
													:[]
													))
											:[]
										])];	
		}
	});
	
	
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
		return [treeitem({item:testdata})]
	}
})