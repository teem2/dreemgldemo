define.browserClass(function(require,screen, node, datatracker, spline, cadgrid, menubar,screenoverlay,scrollcontainer,menuitem, view, edit, text, icon, treeview, ruler, foldcontainer,button, splitcontainer, scrollbar, editlayout){	

	var XmlParser = require('$parsers/htmlparser')

	this.title = "Flowgraph Builder"
	
	this.attribute("dataset", {type: Object});
	
	this.state("xmlstring");
	this.state("xmljson");
	this.state("dataset");
	this.state("applicationstate");
	this.xmlstring = "";
	this.xmljson = {};
	
	this.atConstructor = function(){
		this.composition = location.hash.slice(1) || 'compositions/example/editor.dre'
		this.dataset = datatracker({
			screens:[
			],
			connections:[
			],
			
		})

		this.applicationstate = datatracker({
			selected: "composition/screens/default"
		})
	}
	
	this.BuildXML = function(originalset, dataset){
		var res = XmlParser.reserialize(this.xmljson);
		
		return res;
	}
	
	this.dataset = function(){
		console.log("data set changed!");
		
		var newxml = this.BuildXML(this.xmljson, this.dataset.data);
		
		if (newxml != this.xmlstring){
			console.log("need to save new version...");
			this.teem.fileio.savefile('../dreem2/' + this.composition).then(function(result){				
				console.log("saved composition to server!");
				this.xmlstring = newxml;
			});		
		}else{
			console.log("no notable changes.. not saving file to server");
		}
	}
	
	this.init = function(){
		this.teem.fileio.readfile('../dreem2/' + this.composition).then(function(result){
			
			this.xmljson= XmlParser(result)			
			
			var screens = XmlParser.childByTagName(this.xmljson, 'composition/screens')
			this.dataset.fork(function(data){
				for(var i = 0; i < screens.child.length; i++){
					var scr = screens.child[i]
					data.screens.push({name:scr.attr.name, 
								basecolor: (scr.attr.basecolor)?scr.attr.basecolor: vec4('#d0d0d0'), linkables:
						XmlParser.childrenByTagName(scr, 'attribute').map(function(each){
							return {
								name: each.attr.name,
								type: each.attr.type,
								input: each.attr.input === 'true'
							}
						}.bind(this))
					})
				}
			data.connections.push({from:{node:"default"}, to: {node:"mobile"}})
				
				this.xmlstring = this.BuildXML(this.xmljson, data);
			}.bind(this))
		}.bind(this))
	}
	
	/*var dataset = datatracker({
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
			{to: {node:"TV", attribute: "scale"}, from:{node:"Remote", attribute: "yslider"}}		,
			{to: {node:"Phone", attribute: "scale"}, from:{node:"TV", attribute: "yslider"}}		
		]
	})*/

	var connection = spline.extend(function connection(){
		this.attribute("from", {type: Object});
		this.attribute("to", {type: Object});
		this.position = "absolute" 
		this.linewidth = 10;
		this.init = function(){
			this.update();
		}
		
		this.linecolor = vec4("black");
		
		this.update = function(from, to){
			//console.log(this.from.name, this.to.name);
			if (from === undefined) from = this.from;
			if (to === undefined) to = this.to;
			
			this.linecolor1 = from.data.basecolor;
			this.linecolor2 = to.data.basecolor;

			var br1 = from.lastdrawnboundingrect;
			var w = br1.right - br1.left;
			var fx = from._x;
			var fy = from._y + 8;
			var tx = to._x;
			var ty = to._y + 8;

			this.p0 = vec2(fx + w, fy);
			this.p1 = vec2(fx+ w +100, fy );
			this.p2 = vec2(tx-100,  ty);
			this.p3 = vec2(tx, ty);
		
			var minx = this.p0[0];var maxx = minx;
			if (this.p1[0] < minx) minx = this.p1[0];else if (this.p1[0]>maxx) maxx = this.p1[0];
			if (this.p2[0] < minx) minx = this.p2[0];else if (this.p2[0]>maxx) maxx = this.p2[0];
			if (this.p3[0] < minx) minx = this.p3[0];else if (this.p3[0]>maxx) maxx = this.p3[0];
			
			var miny = this.p0[1];var maxy = miny;
			if (this.p1[1] < miny) miny = this.p1[1];else if (this.p1[1]>maxy) maxy = this.p1[1];
			if (this.p2[1] < miny) miny = this.p2[1];else if (this.p2[1]>maxy) maxy = this.p2[1];
			if (this.p3[1] < miny) miny = this.p3[1];else if (this.p3[1]>maxy) maxy = this.p3[1];
			
		//	console.log(minx, miny, maxx, maxy);
			
			this.pos = vec2(minx-11, miny-11);
			this.size = vec3(maxx-minx + 22, maxy-miny +22);
			this.off = vec4(minx-11,miny-11,0,0);
			
			this.setDirty();
		}
		
		this.arender = function(){
			return [button({text:"x"})]
		}
	});
	
	var blokjesgrid = cadgrid.extend(function blokjesgrid(){
		this.attribute("dataset", {type: Object, value: {}});
		this.connections = [];
		
		
		this.updateConnections = function(name, pos){
			for (var i in this.connections)
			{
				var c = this.connections[i];
				if (c.to.name === name || c.from.name === name) c.update(this.blokjes[c.from.name], this.blokjes[c.to.name]);
			}
			
		}
		
		this.blokjes ={};
		
		this.render = function(){
			
			
			this.blokjes = {};
			var all = [];			
			var connecties = {};
			var i = 0;
			for(a in this.dataset.data.screens)
			{
				
				var d = this.dataset.data.screens[a];
				this.blokjes[d.name] = blokje({dataset:this.dataset, data: d, x:(d.x!==undefined)?d.x:20 + i *30 , y:(d.y!==undefined)?d.y:20 + i *30 });
				i++;
				
				all.push(this.blokjes[d.name]);			
			}
			this.connections = []
			for(a in this.dataset.data.connections)
			{
				var c = this.dataset.data.connections[a];
				var b1 = this.blokjes[c.from.node];
				var b2 = this.blokjes[c.to.node];
				if (b1 && b2)
				{
					var newcon = connection({from: b1, to: b2});
					this.connections.push(newcon);
					all.push(newcon);
				}
			}
			return all;
		}	
	})
	
	var blokje = view.extend(function blokje(){

		this.position = "absolute" ;
		this.attribute("dataset", {type: Object});
		this.attribute("selected", {type: boolean, value: false});
		this.attribute("applicationstate", {type:Object})
		this.applicationstate = function()
		{
			this.selected = this.applicationstate.data.selected === ( "composition/screens" + this.data.name);
		}
		this.attribute("data", {type: Object});
		
		this.mouseleftdown = function(){
			 
			this.start = {mousex:this.mouse.x, mousey:this.mouse.y,startx: this.x, starty: this.y}
			this.mousemove = function(){
				var dx = this.mouse.x - this.start.mousex;
				var dy = this.mouse.y - this.start.mousey;
				
				var nx = this.start.startx + dx;
				var ny = this.start.starty + dy;

				nx = Math.floor(nx/10) * 10;
				ny = Math.floor(ny/10) * 10;
				this.pos = vec2(nx,ny);
				this.parent.updateConnections(this.name, this.pos);
			
			}
			this.mouseleftup = function(){
				this.mousemove = function(){};
				this.parent.updateConnections(this.name, this.pos);
				this.mouseleftup = function(){};
			}
		}

		this.bgcolor = vec4("#ffff60");
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
	
		this.atDraw = function(){
			if (this.dataset.selected == "screen_" + this.data.name){
				this.borderwidth = 20;
				this.bordercolor = vec4("blue");
			}else{
				this.borderwidth =1;
				this.bordercolor = vec4("darkgray");
				
			}
		}
		this.render = function(){
			var root = this;
		//console.log("blokjedata: " ,this.data);
			var basecolor  = this.data.basecolor? this.data.basecolor:vec4("#ffc030") ;
			return [				
				view({ bgcolor: basecolor, "bg.bgcolorfn": function(a,b){return mix(bgcolor, vec4("white"), a.y*0.3);}, padding: 4},
					text({text: this.data.name, margin: 4, fontsize:20, bgcolor: "transparent", fgcolor: "black"})
					,button({text:"change color",margin:0, padding:0,  click: function(){
	
							var br = this.getBoundingRect();
							var setcolor = function(color){
						//		console.log(color);
						//		console.log(root.dataset);
								root.dataset.fork(function(data){
									console.log("forking!");
					//				root.data.basecolor = color;
								});
								//this.screen.closeModal();
							}.bind(this);
							this.screen.openModal(		
								view({position: "absolute", x: br.left,top: br.bottom}
								,button({text:"Red",margin:4, padding:4,  click: function(){setcolor(vec4("#ff6060"));}})
								,button({text:"Green",margin:4, padding:4,  click: function(){setcolor(vec4("#60ff60"));}})
								,button({text:"Blue",margin:4, padding:4,  click: function(){setcolor(vec4("#6060ff"));}})
								,button({text:"Yellow",margin:4, padding:4,  click: function(){setcolor(vec4("#ffff60"));}})
								,button({text:"Gray",margin:4, padding:4,  click: function(){setcolor(vec4("gray"));}})
								)
							);
						}
					}
					)
				),
				view({bgcolor: basecolor, flexdirection:"column", "bg.bgcolorfn": function(a,b){return mix(bgcolor, vec4("white"), 1-(a.y*0.2));}}
					,this.data.linkables?this.data.linkables.map(function(d){
						return button({text:d.name, itemalign: d.input?"flex-start":"flex-end"});
					}):[]
					
				)
			]
		}
	})
	
	var flowgraphtreeview = treeview.extend(function flowgraphtreeview(){
		
		this.attribute("applicationstate", {type:Object});
		
		this.applicationstate = function(){
			this.selected = this.applicationstate.data.selectedscreen;
		}
	
		this.buildtree = function(data)
		{
			return { 
				name:"Composition", id: "comp", children:[
					{name:"Screens" , id:"screens", children: data.screens.map(function(d) {
							return {name: d.name, id: d.name, children: d.linkables?d.linkables.map(function(c){
									return {name: c.name, id: c.name}
								}):[]
							}
						})
					},
					{name:"Connections", id:"conns"}
				] 
			};
			
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
							,menuitem({text: "Copy", enabled: false})
							
							,menuitem({text: "Paste", enabled: false})
							,menuitem({text: "Undo", click:function(){this.dataset.undo()}.bind(this)})
							,menuitem({text: "Redo", click:function(){this.dataset.redo()}.bind(this)})
							,menuitem({text: "Options", enabled: false})		
						)
						,menuitem({text: "Help"}
							,menuitem({text: "Manual", enabled: false})
							,menuitem({text: "About", click: function(){
								this.screen.openModal(screenoverlay({click:function(){this.screen.closeModal()}}
									,view({flexdirection: "column", flex: 1, bgcolor: "transparent"},view({flexdirection: "row", flex: 1, bgcolor: "transparent", alignself:"center"},												
										view({flexdirection: "column", bordercolor: "black" ,bgcolor: vec4(0,0,0,0.3), alignself:  "center" },
											text({text: "About Teem Flowgraph Editor", fontsize: 30, margin: 10, fgcolor: "white", bgcolor: "transparent", alignself:"center"}) ,
											view({bgcolor:"#202020", padding: 20}, text({fontsize: 20, text:"this is a multiline thing\nthat explains what the hell this is all about", bgcolor:"transparent" }))
										)
									))
								));
							}})
						)
					)					
				)
				,splitcontainer({name:"mainsplitter", vertical: false}
					,flowgraphtreeview({flex:0.2, 
						dataset: this.dataset,appstate: this.applicationstate
						
						}
					)
					,splitcontainer({flex: 0.8, vertical: true}
						,scrollcontainer({}
						,view({flexdirection: "column" , flex:1},
							menubar({}
								,menuitem({text: "new block", click:function(){
									this.dataset.fork(function(data){
										data.screens.push({name:"new screen", basecolor:vec4("green")})
									})
								}.bind(this)})
								,menuitem({text: "Undo", click:function(){this.dataset.undo()}.bind(this)})
								,menuitem({text: "Redo", click:function(){this.dataset.redo()}.bind(this)})

							)
							,blokjesgrid({dataset: this.dataset})
						))
							/*,view({flex:1,mode:'DOM', src:'http://127.0.0.1:8080/'+this.composition+'?edit=1'})*/
				
						
					)
				)
			)
	]}
});



