define.browser(function(require, screen, view, edit, text, myview, treeview, ruler, foldcontainer,button){
		
	this.render = function(){return[
		view({position: "relative",   flexdirection: "column", height: 20, bgcolor: "black", flex:1},[
			view({position: "relative",  cornerradius:"vec4(0,0,0,14)" , borderwidth:1, height: 50, flexdirection: "row", bgcolor: "#404080",'bg.bgcolorfn':function(a,b){return vec4(mesh.x * bgcolor.rgb, 1.0)} , alignitems:"stretch", alignself: "stretch" , flex: undefined}
				,text({fontsize: 26, text:"Visionary Studio 3016", width: 200, bgcolor: "transparent" , margin: 2, marginleft:15})
			)
			,view({position: "relative",   flexdirection: "row", bgcolor: "black", alignitems:"stretch", alignself: "stretch" , flex:1}
				,view({position: "relative", width: 400,  flexdirection: "column", bgcolor: "#b0b0b0", alignself: "stretch", borderwidth: 1,cornerradius: "vec4(0,14,0,0)" , bordercolor: "gray" }
					,treeview({})
					)
				,view({position: "relative", flex:0.34,  flexdirection: "column", bgcolor: "darkgray",padding: 1, borderwidth: 1, bordercolor: "gray" , cornerradius: 0}
					,ruler({height: 20})
					,view({position: "relative", flex: 1.0, padding: 0, bgcolor: "#f0f0f0", alignitems: "stretch", flexdirection: "row" }
						,ruler({width: 20, vertical: true, offset:0})
						,view({position: "relative", flex: 1.0, padding: 4, bgcolor: "#f0f0f0", alignitems: "stretch", flexdirection:"row" }
					
						,edit({fontsize:20, position:"relative" , cursorcolor: "black", markercolor:"#9090f0", flex: 1.0,fgcolor: "black",'bg.color':function(){return vec4("#f0f0f0")} ,text:'Type\nHere\nMultiline'}))
					)
				)
				,view({position: "relative", width: 400,  flexdirection: "column", bgcolor: "#808090", alignself: "stretch" , borderwidth: 1, padding: 3,cornerradius: "vec4(0,0,14,0)" , bordercolor: "gray" }
					,foldcontainer({title:"Class Library", alignself: "stretch",marginbottom: 2})
					,foldcontainer({title:"Attributes", alignself: "stretch",marginbottom: 2},
						text({fontsize: 26, text:"Visionary Studio 3016",bgcolor: "transparent" , margin: 5})
					)
					,foldcontainer({title:"Fancy buttons",marginbottom: 2},
						view({ position:"relative", padding: 4, flexwrap:"wrap", alignitems: "flex-start", bgcolor: "transparent"}
							,button({text:"I am a button"})
							,button({text:"me too"})
							,button({text:"so am I"})
							,button({text:"me me me me!"}))
					)
					,foldcontainer({title:"Attributes", alignself: "stretch",marginbottom: 2}
						,edit({fontsize:20, height: 100, width:100,position:"relative" , cursorcolor: "black", markercolor:"#9090f0", flex: 1.0,fgcolor: "black",'bg.color':function(){return vec4("#f0f0f0")} ,text:'another editbox'})
					)
					
				)
			)
		])
	]}
});


