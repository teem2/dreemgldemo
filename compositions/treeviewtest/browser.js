define.browser(function(require, screen, view, edit, text, myview, treeview, ruler){
	this.render = function(){return[
		view({position: "relative",   flexdirection: "column", height: 20, bgcolor: "red", flex:1},[
			view({position: "relative",   height: 50, flexdirection: "row", bgcolor: "#404080", alignitems:"stretch", alignself: "stretch" , flex: undefined})
			,view({position: "relative",   flexdirection: "row", bgcolor: "#404080", alignitems:"stretch", alignself: "stretch" , flex:1}
			,view({position: "relative", width: 400,  flexdirection: "column", bgcolor: "#b0b0b0", alignself: "stretch" }
				,treeview({})
				)
			,view({position: "relative", flex:0.34,  flexdirection: "column", bgcolor: "darkgray"}
				,ruler({height: 30})
				,view({position: "relative", flex: 1.0, padding: 4, bgcolor: "#d0d0d0", alignitems: "stretch"}
					,edit({fontsize:20, flex: 1.0,fgcolor: "black",bgcolor: "#e0d0d0" ,text:'Type\nHere\nMultiline'})
				)
			)
			,view({position: "relative", width: 400,  flexdirection: "column", bgcolor: "#b0b0b0", alignself: "stretch" })
		
		),
		
		
		]

		
		//,edit({x:100,y:30,w:300,h:80,fontsize:60, text:'MyValue'})

			//view({x:0,y:0,w:100,h:100}))
		
		//,view({mode:'DOM', tag:'iframe', 'src':'http://blog.thisisnotrocketscience.nl', bgcolor:'yellow', x:10, y:100, w:190, h:190})
		//,view({mode:'DOM', tag:'iframe', 'src':'http://blog.thisisnotrocketscience.nl', bgcolor:'blue', x:10, y:200, w:290, h:190})
		//,treeview({})
		
		)
		]
	}
	
}
);



