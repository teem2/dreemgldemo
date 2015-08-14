define.browser(function(require, screen, view, edit, text, icon, myview, treeview, ruler, foldcontainer,button, splitcontainer, scrollbar, editlayout){
		
	this.render = function(){return[
		view({rotation:0,position: "relative",   flexdirection: "column", height: 20, bgcolor: "black", flex:1},[
			view({position: "relative",  cornerradius:"vec4(0,0,0,14)" , borderwidth:1, height: 50, flexdirection: "row", bgcolor: "#404080",'bg.bgcolorfn':function(a,b){return vec4(mesh.x * bgcolor.rgb, 1.0)} , alignitems:"stretch", alignself: "stretch" , flex: undefined}
				
				,text({fontsize: 26, text:"Visionary Studio 3016", width: 200, bgcolor: "transparent" , margin: 2, marginleft:15})
			)
			,splitcontainer({vertical:false, position: "relative",   flexdirection: "row", bgcolor: "black", alignitems:"stretch", alignself: "stretch" , flex:1}
				,view({position: "relative", flex: 0.2,  flexdirection: "column", bgcolor: "#b0b0b0", alignself: "stretch", borderwidth: 1,cornerradius: "vec4(0,14,0,0)" , bordercolor: "gray" }
					,treeview({})
					)
				,view({position: "relative", flex:0.34,  flexdirection: "column", bgcolor: "darkgray",padding: 1, borderwidth: 1, bordercolor: "gray" , cornerradius: 0}
					,ruler({height: 20})
					,view({position: "relative", flex: 1.0, padding: 0, bgcolor: "#f0f0f0", alignitems: "stretch", flexdirection: "row" }
						,ruler({width: 20, vertical: true, offset:0})
						,view({position: "relative", flex: 1.0, padding: 4, bgcolor: "#f0f0f0", alignitems: "stretch", flexdirection:"row" }
							,editlayout({flex:1.0,padding:10,  composition:'minidialog'})
						,scrollbar({width:15, position:'relative'})
						)
					)
				)
				,view({position: "relative", flex: 0.2,  flexdirection: "column", bgcolor: "#808090", alignself: "stretch" , borderwidth: 1, padding: 3,cornerradius: "vec4(0,0,14,0)" , bordercolor: "gray" }
					,foldcontainer({title:"Class Library", icon:'files-o', alignself: "stretch",marginbottom: 2})
					,foldcontainer({title:"Attributes", icon:'gears', alignself: "stretch",marginbottom: 2},
						text({fontsize: 26, text:"Visionary Studio 3016",bgcolor: "transparent" , margin: 5})
					)
					,foldcontainer({title:"Fancy buttons", icon:'gamepad', marginbottom: 2}
						,view({ position:"relative", flexwrap:"wrap", alignitems: "stretch", bgcolor: "transparent"}
							,button({text:"Youtube",icon:"youtube"})
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
						,view({position: "relative", flex: 1.0, padding: 4, bgcolor: "#f0f0f0", alignitems: "stretch", flexdirection:"column" }
						,splitcontainer({vertical: false, margin: 4},[
						text({fontsize: 26, text:"A", bgcolor: "transparent" , fgcolor:"black", margin: 2})
						,text({fontsize: 26, text:"B", bgcolor: "transparent" ,fgcolor:"black", margin: 2})
						,text({fontsize: 26, text:"C", bgcolor: "transparent" , fgcolor:"black",margin: 2})
						,text({fontsize: 26, text:"D", bgcolor: "transparent" , fgcolor:"black",margin: 2})
						]
						)
						,splitcontainer({vertical: true, margin: 4},[
						text({fontsize: 26, text:"A", bgcolor: "transparent" , fgcolor:"black", margin: 2})
						,text({fontsize: 26, text:"B", bgcolor: "transparent" ,fgcolor:"black", margin: 2})
						,text({fontsize: 26, text:"C", bgcolor: "transparent" , fgcolor:"black",margin: 2})
						,text({fontsize: 26, text:"D", bgcolor: "transparent" , fgcolor:"black",margin: 2})
						]
						))
					)
					
				)
			)
		])
	]}
});



