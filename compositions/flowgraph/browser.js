define.browserClass(function(require,screen, node, cadgrid, menubar,screenoverlay,scrollcontainer,menuitem, view, edit, text, icon, treeview, ruler, foldcontainer,button, splitcontainer, scrollbar, editlayout){	

	this.title = "Flowgraph Builder"

	var container = node.extend(function(){

	

		this.atConstructor = function(){
			this.undo_stack = []
			this.redo_stack = []
			this.connected_objects = []
			this.data = this.constructor_props
		}

		this.atAttributeAssign = function(obj, key){
			for(var i = 0; i < this.connected_objects.length; i++){
				var co = this.connected_objects[i];
				if (co.obj === obj) return;
			}
			this.connected_objects.push({obj:obj, key:key})
			
		}

		this.fork = function(callback){
			this.undo_stack.push(JSON.stringify(this.data))
			this.redo_stack.length = 0
			callback(this.data)
			this.notifyAssignedAttributes();
		}

		// cause objects that have us assigned to reload
		this.notifyAssignedAttributes = function(){
			for(var i = 0; i < this.connected_objects.length; i++){
				var o = this.connected_objects[i]
				o.obj[o.key] = this
			}
		}
		
		
		function recursiveCleanup(node){
			if (typeof(node) === "object"){
				if  (node.____struct){
					var lookup  = define.typemap.types[node.____struct] ;
					return lookup.apply(null, node.data);
				}
				else{
					for(key in node){
						node[key] = recursiveCleanup(node[key]);
					}				
				}
			}
			
			return node;
		}
		this.JSONParse = function(stringdata){
			var data = JSON.parse(stringdata)
			recursiveCleanup(data);
			return data;
		}
		
		this.undo = function(){
			if(!this.undo_stack.length) return
			this.redo_stack.push(JSON.stringify(this.data))
			this.data = this.JSONParse(this.undo_stack.pop());
			this.notifyAssignedAttributes();
		}

		this.redo = function(){
			if(!this.redo_stack.length) return
			this.undo_stack.push(JSON.stringify(this.data))
			this.data = this.JSONParse(this.redo_stack.pop())
			this.notifyAssignedAttributes();
		}
	})

	var dataset = container({
		screens:[
			{name: "Browser", basecolor: vec4("#ffff60"), linkables:[
				{name:"dataset", type: "list", input: true},
				{name:"spacing", type: "float", input: true},
				{name:"scale", type: "float", input: true},
				{name:"color", type: "vec4", input: true}
			]},
			{name: "Remote", basecolor: vec4("#9090ff"), linkables:[
				{name:"xslider", type: "float", input: false},
				{name:"yslider", type: "float", input: false},
				{name:"title", type: "string", input: true},
				{name:"color", type: "vec4", input: true}
			]},
			{name: "TV", basecolor: vec4("#ff6060"),linkables:[]},
			{name: "Phone", basecolor: vec4("#90df90"),linkables:[]}		
		],
		connections:[
			{to: {node:"Browser", attribute: "spacing"}, from:{node:"Remote", attribute: "xslider"}},
			{to: {node:"Browser", attribute: "scale"}, from:{node:"Remote", attribute: "yslider"}}		
		]
	})

	var connector = view.extend(function connector(){
	})

	var blokjesgrid = cadgrid.extend(function blokjesgrid(){
		this.attribute("dataset", {type: Object, value: {}});
		this.render = function(){
			return this.dataset.data.screens.map(function(d,i){
				return blokje({x:(d.x!==undefined)?d.x:20 + i *30 , y:(d.y!==undefined)?d.y:20 + i *30 , name: d.name, basecolor: d.basecolor? d.basecolor:vec4("purple") });
			})
		}
	})
	
	var blokje = view.extend(function blokje(){

		this.position = "absolute" ;
		this.attribute("basecolor", {type: vec4, value: "green"});

		this.mouseleftdown = function(){
			this.start = {mousex:this.mouse.x, mousey:this.mouse.y,startx: this.x, starty: this.y}
			this.mousemove = function(){
				var dx = this.mouse.x - this.start.mousex;
				var dy = this.mouse.y - this.start.mousey;
				
				this.pos = vec2(this.start.startx + dx, this.start.starty + dy);
			
			}
		}
		
		this.mouseleftup = function(){
			this.mousemove = function(){};
		}
		
		this.bgcolor = vec4("#ffff60")
		this.bg.basecolor = vec4();
		
		this.atDraw = function()
		{
			this.bg.basecolor = this.basecolor;
		}
		
		this.bg.bgcolorfn = function(a,b)
		{
			return mix(basecolor, vec4("white"), a.y/2);
		}
		
		this.flexdirection = "column" 
		this.padding = 1;
		this.borderwidth = 1;
		this.bordercolor = vec4("darkgray");
		this.render = function(){
			
			return [
				
				view({ bgcolor: this.basecolor, "bg.bgcolorfn": function(a,b){return mix(bgcolor, vec4("white"), a.y*0.3);}, padding: 4},
					text({text: this.name, bgcolor: "transparent", fgcolor: "black"})
				),
				view({bgcolor: this.basecolor, "bg.bgcolorfn": function(a,b){return mix(bgcolor, vec4("white"), 1-(a.y*0.2));}}
						,button({text:"button 1"})
						,button({text:"button 2"})
						,button({text:"button 3"})
						,button({text:"button 4"})
				)]
		}
	})
	
		
	this.render = function(){
		return[
			view({name:"toplevel",flexdirection: "column", bgcolor: "darkgray" , flex:1}
				,view({name:"menubarholder", bgcolor:"lightgray"}
					,menubar({flex:1}
						,menuitem({text: "File"}
							,menuitem({text: "Load"})
							,menuitem({text: "Save"})
							,menuitem({text: "Save as"})
							,menuitem({text: "Revert"})
						)
						,menuitem({text: "Edit"}
							,menuitem({text: "Copy"})
							
							,menuitem({text: "Paste"})
							,menuitem({text: "Undo", click:function(){dataset.undo()}})
							,menuitem({text: "Redo", click:function(){dataset.redo()}})
							,menuitem({text: "Options"})		
						)
						,menuitem({text: "Help"}
									,menuitem({text: "Manual"})
									,menuitem({text: "About", click: function(){
									this.screen.openModal(screenoverlay({}
										,view({flexdirection: "column"},view({flexdirection: "row"},
										text({text: "ABOUT", fontsize: 40, fgcolor: "white", bgcolor: "transparent"}) 
										) )
										));
										console.log("HI")
									}})
						)
					)					
				)
				,splitcontainer({name:"mainsplitter", vertical: false}
					,treeview({flex:0.2, 
						dataset: dataset,
						buildtree: function(data)
							{
								console.log(data)
								return { 
									name:"Composition", children:
										[{name:"Screens" , children: 
												data.screens.map(function(d) {
												console.log(d);
												return {name: d.name, children: d.linkables?d.linkables.map(function(c){
													console.log(c);
													return {name: c.name}
												}):[]
										}}
									)
								},
								{name:"Connections"}
								] 
						} }
						}
					)
					,scrollcontainer({flex: 0.8}
						,view({flexdirection: "column" , flex:1},
							menubar({}
								,menuitem({text: "new block", click:function(){
									
										dataset.fork(function(data){
										
										data.screens.push({name:"new screen"})
									
								})
								
							}})
								,menuitem({text: "Undo", click:function(){dataset.undo()}})
								,menuitem({text: "Redo", click:function(){dataset.redo()}})

							)
							,blokjesgrid({dataset: dataset})
						)
					)
				)
			)
	]}
});



