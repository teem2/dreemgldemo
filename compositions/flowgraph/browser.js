define.browserClass(function(require,screen, node, datatracker, spline, cadgrid, menubar,screenoverlay,scrollcontainer,menuitem, view, edit, text, icon, treeview, ruler, foldcontainer,button, splitcontainer, scrollbar, editlayout){	

	var XmlParser = require('$parsers/htmlparser')

	this.title = "Flowgraph Builder"

	this.atConstructor = function(){
		this.composition = location.hash.slice(1) || 'compositions/example/editor.dre'
		this.dataset = datatracker({
			screens:[
			],
			connections:[
			]
		})
	}

	this.init = function(){
		this.teem.fileio.readfile('../dreem2/' + this.composition).then(function(result){
			var parser = new XmlParser()
			var xml = parser.parse(result)
			var screens = XmlParser.childByTagName(xml, 'composition/screens')
			this.dataset.fork(function(data){
				for(var i = 0; i < screens.child.length; i++){
					var scr = screens.child[i]
					data.screens.push({name:scr.attr.name, basecolor:vec4('yellow'), linkables:
						XmlParser.childrenByTagName(scr, 'attribute').map(function(each){
							return {
								name: each.attr.name,
								type: each.attr.type,
								input: each.attr.input === 'true'
							}
						}.bind(this))
					})
				}
			})
		}.bind(this))
	}
	/*
	var dataset = datatracker({
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
			
			this.linecolor1 = from.basecolor;
			this.linecolor2 = to.basecolor;

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
				this.blokjes[d.name] = blokje({x:(d.x!==undefined)?d.x:20 + i *30 , y:(d.y!==undefined)?d.y:20 + i *30 , name: d.name, basecolor: d.basecolor? d.basecolor:vec4("purple") });
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
		this.attribute("basecolor", {type: vec4, value: "green"});

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
							,menuitem({text: "Undo", click:function(){this.dataset.undo()}.bind(this)})
							,menuitem({text: "Redo", click:function(){this.dataset.redo()}.bind(this)})
							,menuitem({text: "Options"})		
						)
						,menuitem({text: "Help"}
							,menuitem({text: "Manual"})
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
					,treeview({flex:0.2, 
						dataset: this.dataset,
						buildtree: function(data){
							return { 
								name:"Composition", children:
									[{name:"Screens" , children: 
											data.screens.map(function(d) {
											
											return {name: d.name, children: d.linkables?d.linkables.map(function(c){
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
					,splitcontainer({flex: 0.8, vertical: true}
						,scrollcontainer({}
						,view({flexdirection: "column" , flex:1},
							menubar({}
								,menuitem({text: "new block", click:function(){
									this.dataset.fork(function(data){
										data.screens.push({name:"new screen"})
									})
								}.bind(this)})
								,menuitem({text: "Undo", click:function(){this.dataset.undo()}.bind(this)})
								,menuitem({text: "Redo", click:function(){this.dataset.redo()}.bind(this)})

							)
							,blokjesgrid({dataset: this.dataset})
						))
							,view({flex:1,mode:'DOM', src:'http://127.0.0.1:8080/'+this.composition+'?edit=1'})
				
						
					)
				)
			)
	]}
});



