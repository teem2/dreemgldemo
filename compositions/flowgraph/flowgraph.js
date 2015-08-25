"use strict";
define.class(function(require, screen, node, datatracker, spline, blokjesgrid, menubar,screenoverlay,scrollcontainer,menuitem, view, edit, text, icon, treeview, ruler, foldcontainer,button, splitcontainer, scrollbar, editlayout){	

	var Xml = require('$parsers/htmlparser')

	this.title = "Flowgraph Builder"
	
	//this.attribute("dataset", {type: Object});
	this.state("xmlstring");
	this.state("xmljson");
	this.state("dataset");
	this.state("appstate");
	this.xmlstring = "";
	
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
				from:'screens_' + con.from.node + '_' + con.from.output,
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
				// lets find the right data
				for(var i = 0; i < dataset.screens.length; i++)if(dataset.screens[i].name === screen.attr.name){
					screen.attr.editx = ''+dataset.screens[i].x
					screen.attr.edity = ''+dataset.screens[i].y
					//data.screens.push({name:scr.attr.name,
				}

				if(attrib.attr.input == 'true'){
					if(server_output[to]){
						attrib.attr.value = "${dr.teem.flowserver." + to + "}"
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
		return res;
	}
	
	this.init = function(){
		this.composition = location.hash.slice(1) || 'compositions/example/editor.dre'
		this.dataset = datatracker({
			screens:[
			],
			connections:[
			],
		})
		
		this.dataset.atChange  = function(){
			console.log("data set changed!");
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
		}.bind(this);
	
		this.appstate = datatracker({
			selected: "composition/screens/default"
		})
		
		this.teem.fileio.readfile('../dreem2/' + this.composition).then(function(result){
			this.xmljson = Xml(result)			

			var screens = Xml.childByTagName(this.xmljson, 'composition/screens')
			this.dataset.fork(function(data){
				for(var i = 0; i < screens.child.length; i++){
					var scr = screens.child[i]
					var view = Xml.childByTagName(scr, 'view')

					data.screens.push({name:scr.attr.name, icon: scr.attr.icon?scr.attr.icon:"tv", title:scr.attr.title?scr.attr.title:scr.attr.name,					
								x:parseFloat(scr.attr.editx || 0), y:parseFloat(scr.attr.edity || 0),
								basecolor: (scr.attr.basecolor)?scr.attr.basecolor: vec4('#d0d0a0'), linkables:
						Xml.childrenByTagName(view, 'attribute').map(function(each){
							return {
								name: each.attr.name,
								icon: each.attr.icon?each.attr.icon:"chevron-right",
								title: each.attr.title?each.attr.title:each.attr.name,
								type: each.attr.type,
								input: each.attr.input === 'true'
							}
						}.bind(this))
					})
				}

				var flowserver = Xml.childByTagName(this.xmljson,'composition/flowserver')
				Xml.childrenByTagName(flowserver,'attribute').map(function(each){
					var name = each.attr.name
					var tonode = name.slice(name.indexOf('_')+1)
					var toinput = tonode.slice(tonode.indexOf('_')+1)
					tonode = tonode.slice(0,tonode.indexOf('_'))
					var from = each.attr.from
					if (!from) return;
					
					var fromnode = from.slice(from.indexOf('_')+1)
					var fromoutput = fromnode.slice(fromnode.indexOf('_')+1)
					fromnode = fromnode.slice(0,fromnode.indexOf('_'))

					data.connections.push({from:{node:fromnode, output:fromoutput},to:{node:tonode,input:toinput}})
				})


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
						dataset: this.dataset, appstate: this.appstate
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
						,view({flex:1,mode:'DOM', src:'http://127.0.0.1:8080/'+this.composition+''})
				
						
					)
				)
			)
	]}
});


