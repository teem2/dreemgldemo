"use strict";
define.browserClass(function(require,screen, node, datatracker, spline, cadgrid, menubar,screenoverlay,scrollcontainer,menuitem, view, edit, text, icon, treeview, ruler, foldcontainer,button, splitcontainer, scrollbar, editlayout){	

	var Xml = require('$parsers/htmlparser')

	this.title = "Flowgraph Builder"
	
	this.attribute("dataset", {type: Object});
	
	this.state("xmlstring");
	this.state("xmljson");
	this.state("dataset");
	this.state("appstate");
	this.xmlstring = "";
	
	this.atConstructor = function(){
		this.composition = location.hash.slice(1) || 'compositions/example/editor.dre'
		this.dataset = datatracker({
			screens:[
			],
			connections:[
			],
			
		})

		this.appstate = datatracker({
			selected: "composition/screens/default"
		})
	}
	
	this.BuildXML = function(originalset, dataset){
		if(!this.xmljson) return ''
		var fs = Xml.childByTagName(this.xmljson, 'composition/flowserver')
		if(!fs){
			fs = Xml.createChildNode('flowserver', Xml.childByTagName(this.xmljson, 'composition'))
		}
		fs.child = undefined
		var server_output = {}
		var server_input = {}
		for(var i = 0; i < dataset.connections.length; i++){
			var con = dataset.connections[i]
			var attr = Xml.createChildNode('attribute', fs)
			attr.attr = {
				name:'screens_' + con.to.node + '_' + con.to.input,
				to:'screens_' + con.from.node + '_' + con.from.output,
				type:'string'
			}
			server_output[attr.attr.name] = 1
			server_input[attr.attr.to] = 1
		}

		Xml.childrenByTagName(this.xmljson, 'composition/screens/screen').forEach(function(screen){
			var view = Xml.childByTagName(screen, 'view')
			Xml.childrenByTagName(view, 'attribute').forEach(function(attrib){
				// check if we are in connections
				var to = "screens_"  + screen.attr.name + "_" + attrib.attr.name
				if(attrib.attr.input == 'true'){
					if(server_output[to]){
						attrib.attr.value = "${dr.teem.flowserver."+to+"}"
					}
					else delete attrib.attr.value
				}
				if(attrib.attr.input == 'false'){
					var handler = Xml.childByAttribute(view,'event', 'on'+attrib.attr.name, 'handler')
					if(server_input[to]){ // add-make one
						if(!handler){
							handler = Xml.createChildNode('handler', view)
							handler.attr = {event:'on'+attrib.attr.name}
							var txt = Xml.createChildNode('$text', handler)
							txt.value = ''
							for(var i = 0; i < dataset.connections.length; i++){
								var con = dataset.connections[i]
								if(con.from.node === screen.attr.name &&
									con.from.output === attrib.attr.name){
									txt.value += "dr.teem.flowserver.screens_" + con.to.node + '_' + con.to.input + ' = this.' + attrib.attr.name + '\n'
								}
							}
							
						}

					}
					else{ // try to remove one
					}
					// handler
				}

			})
		})
		var res = Xml.reserialize(this.xmljson);
		console.log(res)
//
		return res;
	}
	
	this.dataset = function(){
		console.log("data set changed!");
		console.log(this.xmljson)
		var newxml = this.BuildXML(this.xmljson, this.dataset.data);
		
		if (newxml != this.xmlstring){
			console.log("need to save new version...");
			this.teem.fileio.writefile('../dreem2/' + this.composition, newxml).then(function(result){				
				console.log("saved composition to server!");
				this.xmlstring = newxml;
			}.bind(this));		
		}else{
			console.log("no notable changes.. not saving file to server");
		}
	}
	
	this.init = function(){
		this.teem.fileio.readfile('../dreem2/' + this.composition).then(function(result){
			this.xmljson = Xml(result)			

			var screens = Xml.childByTagName(this.xmljson, 'composition/screens')
			this.dataset.fork(function(data){
				for(var i = 0; i < screens.child.length; i++){
					var scr = screens.child[i]
					var view = Xml.childByTagName(scr, 'view')

					data.screens.push({name:scr.attr.name, 
								basecolor: (scr.attr.basecolor)?scr.attr.basecolor: vec4('#d0d0d0'), linkables:
						Xml.childrenByTagName(view, 'attribute').map(function(each){
							return {
								name: each.attr.name,
								type: each.attr.type,
								input: each.attr.input === 'true'
							}
						}.bind(this))
					})
				}

				this.xmlstring = this.BuildXML(this.xmljson, data);
			}.bind(this))
	//		this.dataset.fork(function(data){
//				data.connections.push({from:{node:"default", output:'sldvalue'}, to: {node:"mobile", input:'sldinput'}})
		//	})
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
		this.state("from")
		this.state("to");
		this.position = "absolute" 
		this.linewidth = 10;
		
		this.init = function(){
			this.update();
			this.to.postLayout = 
			this.from.postLayout = function(){
				this.update()
			}.bind(this)		
		}
		
		this.linecolor = vec4("black");

		this.atDraw = function(){
			
			this.update()
			
			if (this.hovered > 0){
				
				this.linecolor1 = vec4.vec4_mul_float32(vec4(this.from.data.basecolor),1.5);
				this.linecolor2 = vec4.vec4_mul_float32(vec4(this.to.data.basecolor),1.5);
			}
			else{
				this.linecolor1 = this.from.data.basecolor;
				this.linecolor2 = this.to.data.basecolor;				
			}
			
			
			spline.prototype.atDraw.call(this)
		}

		this.update = function(from, to){
			//console.log(this.from.name, this.to.name);
			if (from === undefined) from = this.from;
			if (to === undefined) to = this.to;
			
			
			var br1 = from.lastdrawnboundingrect;
			var w = br1.right - br1.left;
			var fx = from._pos[0];
			var fy = from._pos[1] + 8;
			var tx = to._pos[0];
			var ty = to._pos[1] + 8;

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
			
			//this.setDirty();
		}
		this.hovered =0;
		this.mouseover = function()
		{
			this.hovered++;
			this.setDirty();
		}
		
		this.mouseout = function(){
			if (this.hovered > 0) this.hovered--;
			this.setDirty();
		}
		
		this.click = function(){
			console.log("spline click")
			//this.screen.openModal(screenoverlay({}))
		}
	});
	
	var blokjesgrid = cadgrid.extend(function blokjesgrid(){
		this.attribute("dataset", {type: Object, value: {}});
		this.connections = [];
		
		
		this.connectionstart = undefined;
		this.connectionend = undefined;
	
		this.tryToBuildConnection = function(){
			if(this.connectionstart && this.connectionend)
			{
				this.dataset.fork(function(data){
						data.connections.push({
																	from:{
																			node: this.connectionstart.screen, 
																			output: this.connectionstart.output
																	}
																	,to:{
																			node: this.connectionend.screen,
																			input: this.connectionend.input,
																	}
																})
				}.bind(this))
				this.connectionstart = undefined;
				this.connectionend = undefined;			
			}			
		}
		
		this.setConnectionStart = function(blok, output){
			this.connectionstart = {screen: blok, output: output};
			this.tryToBuildConnection();
		}

		this.setConnectionEnd = function(blok, input){
			this.connectionend = {screen: blok, input: input};
			this.tryToBuildConnection();		
		}
		
		//this.updateConnections = function(name, pos){
		//	for (var i in this.connections){
		//		var c = this.connections[i];
		//		if (c.to.name === name || c.from.name === name) c.update(this.blokjes[c.from.name], this.blokjes[c.to.name]);
		//	}
		//}
		
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
	
	var connectorbutton = view.extend(function connectorbutton(){
		this.margin = 0;
		this.padding = 0;
		this.attribute("text", {type:String, value:""});
		this.attribute("input", {type:boolean, value:""});
		this.attribute("targetscreen", {type:String, value:""});
		this.attribute("attrib", {type:String, value:""});
		
		this.mouseover = function(){
			this.setDirty();
		}
		
		this.mouseout = function(){
			this.setDirty();
		}
		
		this.click = function(){
			if (this.input){
					this.target.setConnectionEnd(this.targetscreen, this.attrib);
			}
			else{
					this.target.setConnectionStart(this.targetscreen, this.attrib);
			}
		}
		
		this.render =function(){		
			if (this.input){
				return [icon({icon: "forward", fontsize: 20}),text({text:this.text,margin: vec4(10,0,10,4), fontsize: 20, bgcolor:"transparent", fgcolor:"black"})];
			}
			else{
				return [text({text:this.text, margin: vec4(10,0,10,4), fontsize: 20, bgcolor:"transparent", fgcolor:"black"}), icon({icon: "forward", fontsize: 20})];
			}
		}
	})
	
	var blokje = view.extend(function blokje(){

		this.position = "absolute" ;
		this.attribute("dataset", {type: Object});
		this.attribute("selected", {type: boolean, value: false});
		this.attribute("appstate", {type:Object})
		this.appstate = function()
		{
			var newsel = this.appstate.data.selected === ( "composition/screens" + this.data.name);
			if (newsel !== this._selected)
			this.selected = newsel;
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
				//this.parent.updateConnections(this.name, this.pos);
			
			}
			this.mouseleftup = function(){
				this.mousemove = function(){};
				//this.parent.updateConnections(this.name, this.pos);
				this.mouseleftup = function(){};
			}
		}

		this.bgcolor = vec4("#ffff60");
		this.bg.basecolor = vec4();

		

		this.bg.bgcolorfn = function(a,b)
		{
			return mix(basecolor, vec4("white"), a.y/2);
		}
		
		this.flexdirection = "column" 
		this.padding = 1;
		this.borderwidth = 1;
		this.bordercolor = vec4("darkgray");
	
		this.atDraw = function(){
			if (this._selected){
				this.bg.borderwidth = 20;
				this.bg.bordercolor = vec4("blue");
			}else{
				this.bg.borderwidth =1;
				this.bg.bordercolor = vec4("darkgray");				
			}
		}
		
				this.inputsdict = [];
		this.outputsdict = [];
		this.inputs = [];
		this.outputs = [];

		
		this.render = function(){
			
		this.inputsdict = [];
		this.outputsdict = [];
		this.inputs = [];
		this.outputs = [];
				
		if (this.data.linkables){
			for (var i in this.data.linkables){
				var L = this.data.linkables[i];				
				if (L.input == true)	{
					var newinput = connectorbutton({text:L.name,input: true, target: this.parent, targetscreen: this.data.name, attrib:L.name})
					this.inputsdict[L.name] = newinput;
					this.inputs.push(newinput);
				}
				else{
					var newoutput = connectorbutton({text:L.name,input: false,target: this.parent, targetscreen: this.data.name, attrib:L.name})
					this.outputsdict[L.name] = newoutput;
					this.outputs.push(newoutput);					
				}
			}
		}
					
					
			var root = this;
		//console.log("blokjedata: " ,this.data);
			var basecolor  = this.data.basecolor? this.data.basecolor:vec4("#ffc030") ;
			return [				
				view({ bgcolor: basecolor, "bg.bgcolorfn": function(a,b){return mix(bgcolor, vec4("white"), a.y*0.3);}, padding: 4},
					text({text: this.data.name, margin: 4, fontsize:20, bgcolor: "transparent", fgcolor: "black"})
	/*				,button({text:"change color",margin:0, padding:0,  click: function(){
	
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
					)*/
				),
				view({bgcolor: basecolor, flexdirection:"column", "bg.bgcolorfn": function(a,b){return mix(bgcolor, vec4("white"), 1-(a.y*0.2));},margin:0, padding:0}
					,view({flexdirection:"row",margin:0, padding:0 }, view({flexdirection:"column",margin:0, padding:0},this.inputs), view({flexdirection:"column",margin:0, padding:0}, this.outputs))
					
				)
			]
		}
	})
	
	
	var flowgraphtreeview = treeview.extend(function flowgraphtreeview(){
		
		this.attribute("appstate", {type:Object});
		
		this.appstate = function(){
			this.selected = this.appstate.data.selectedscreen;
		}
	
		this.buildtree = function(data)
		{
			return { 
				name:"Composition", id: "comp", children:[
					{name:"Screens" , id:"screens", children: data.screens.map(function(d) {
							return {name: d.name, id: d.name, children: []
							}
						})
					},
					{name:"Connections", id:"conns", children:data.connections.map(function(d){return {name:d.from.node + " -> " + d.to.node  }}) }
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
						dataset: this.dataset,appstate: this.appstate
						
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



