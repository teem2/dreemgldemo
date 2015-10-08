define.class(function(require, screen, view,menuitem, menubar, edit, text, icon, treeview, ruler, foldcontainer,button, splitcontainer, scrollbar, subcomposition){
	
	this.render = function(){ return [
		view({rotation:0,position: "relative", flexdirection: "column", height: 20, bgcolor:"black", flex:1},
			view({position: "relative", cornerradius:"vec4(0,0,0,14)", borderwidth:1, flexdirection: "row",
				bg:{
					bgcolor2: vec4("#404080"),
					bgcolorfn:function(pos,b){
					//	return demos.highdefblirpy(pos*vec2(2.,0.1), time * 2, 1.) * vec4(mesh.x * bgcolor.rgb, 1.0)
						return vec4(mesh.x * bgcolor2.rgb, 1.0)
					}
				},alignitems:"stretch", alignself: "stretch", flex: undefined}
				,icon({icon:"windows", fgcolor:"white", marginleft: 15, fontsize:18})
				,text({fontsize: 20, text:"Dreem Editor Testing", width: 200, bgcolor: "transparent" , marginbottom:10, marginleft:15})
			)
			,menubar({}
				,menuitem({text: "File"}
					,menuitem({text: "Load"})
					,menuitem({text: "Save"})
					,menuitem({text: "Save as"})
					,menuitem({text: "Revert"})
				)
				,menuitem({text: "Edit"}
					,menuitem({text: "Copy"})
					,menuitem({text: "Paste"})
					,menuitem({text: "Undo"})
					,menuitem({text: "Redo"})
					,menuitem({text: "Options"})		
				)
				,menuitem({text: "Help"}
					,menuitem({text: "Manual"})
					,menuitem({text: "About"})
				)
			)
			,splitcontainer({vertical:false, position: "relative",   flexdirection: "row", bgcolor: "black", alignitems:"stretch", alignself: "stretch" , flex:1}
				,view({position: "relative", flex: 0.2,  flexdirection: "column", bgcolor: "#b0b0b0", alignself: "stretch", borderwidth: 1,cornerradius: "vec4(0,14,0,0)" , bordercolor: "gray" }
					,treeview({})
				)
				,view({position: "relative", flex:0.34,  flexdirection: "column", bgcolor: "darkgray",padding: 1, cornerradius: 0, clipping: true}
					,ruler({height: 20})
					,view({position: "relative", flex: 1.0, padding: 0, bgcolor: "#f0f0f0", alignitems: "stretch", flexdirection: "row" }
						,ruler({width: 20, vertical: true, offset:0})
						,view({position: "relative", flex: 1.0, padding: 4, bgcolor: "#f0f0f0", alignitems: "stretch", flexdirection:"row" ,clipping: false}
							,subcomposition({flex:1.0,padding:10,  composition:'minidialog', clipping: true})
							,scrollbar({width:15, position:'relative'})
						)
					)
				)
				,view({position: "relative", flex: 0.2,  flexdirection: "column", bgcolor: "#808090", alignself: "stretch" , borderwidth: 1, padding: 3,cornerradius: "vec4(0,0,14,0)" , bordercolor: "gray" , clipping: true}
					,foldcontainer({title:"Class Library", icon:'files', alignself: "stretch",marginbottom: 2})
					,foldcontainer({title:"Attributes", icon:'gears', alignself: "stretch",marginbottom: 2},
						text({fontsize: 26, text:"Dreem Editor Testing",bgcolor: "transparent" , margin: 5})
					)
					,foldcontainer({title:"Fancy buttons", icon:'gamepad', marginbottom: 2}
						,view({ position:"relative", flexwrap:"wrap", alignitems: "stretch", bgcolor: "transparent"}
							,button({text:"Youtube",icon:"youtube", click:function(){
								this.screen.openModal(
									view({
										click:function(){
											this.screen.closeModal(1)
										},position:'absolute',bgcolor:'red',w:100,h:100}, [text({text:"click me to close!", fgcolor: "black", padding: vec4(10)})])
								).then(function(result){
									console.log('resolved',result)
								})
							}})
							,button({text:"Github", icon:"github"})
							,button({text:"Google", icon: "gear"})
							,button({text:"me me me me!"})
						)
					)
					,foldcontainer({title:"Attributes", icon:'list-ul', alignself: "stretch", marginbottom: 2}
						,view({position: "relative", flex: 1.0, padding: 4, bgcolor: "#f0f0f0", alignitems: "stretch", flexdirection:"row" }
							,edit({fontsize:20, height: 100, width:100,position:"relative" , cursorcolor: "black", markercolor:"#9090f0", flex: 1.0,fgcolor: "black",'bg.color':function(){return vec4("#f0f0f0")} ,text:'another editbox1'})
							//,edit({fontsize:20, height: 100, width:100,position:"relative" , cursorcolor: "black", markercolor:"#9090f0", flex: 1.0,fgcolor: "black",'bg.color':function(){return vec4("#f0f0f0")} ,text:'another editbox2'})
						)
					)
					,foldcontainer({title:"Split Test", alignself: "stretch", marginbottom: 2}				
						,view({position: "relative", flex: 1.0, padding: 4, bgcolor: "#f0f0f0", alignitems: "stretch", flexdirection:"column", flex: 1.0 }
							,splitcontainer({vertical: false, margin: 4, flex: 1.0},
								text({flex: 0.2, fontsize: 26, text:"A", bgcolor: "transparent" , fgcolor:"black", margin: 2})
								,text({flex: 0.2, fontsize: 26, text:"B", bgcolor: "transparent" ,fgcolor:"black", margin: 2})
								,text({flex: 0.2, fontsize: 26, text:"C", bgcolor: "transparent" , fgcolor:"black",margin: 2})
								,text({flex: 0.2, fontsize: 26, text:"D", bgcolor: "transparent" , fgcolor:"black",margin: 2})
							)
							,splitcontainer({vertical: true, margin: 4, flex: 1.0},
								text({flex: 0.2, fontsize: 26, text:"A", bgcolor: "transparent" , fgcolor:"black", margin: 2})
								,text({flex: 0.2, fontsize: 26, text:"B", bgcolor: "transparent" ,fgcolor:"black", margin: 2})
								,text({flex: 0.2, fontsize: 26, text:"C", bgcolor: "transparent" , fgcolor:"black",margin: 2})
								,text({flex: 0.2, fontsize: 26, text:"D", bgcolor: "transparent" , fgcolor:"black",margin: 2})
							)
						)
					)
					
				)
			)
		)
	]}
});



