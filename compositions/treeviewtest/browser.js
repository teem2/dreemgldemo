define.browser(function(require, screen, view, edit, text, myview, treeview){
	this.render = function(){return[
		view({position: "relative",   flexdirection: "row", bgcolor: "#404080", alignitems:"stretch", alignself: "stretch" , flex:1}
	
		,view({position: "relative", flex: 0.33,  flexdirection: "column", bgcolor: "black", alignself: "stretch" }, 
				treeview({})

		)
		,view({position: "relative", flex:0.34,  flexdirection: "column", bgcolor: "darkgray"}
			,ruler({height: 30})
			,edit({fontsize:60, flex: 1.0,
			'bg.color':function(){
				return vec4(0.4)
			},text:'Type\nHere\nMultiline'})
			)
			,view({position: "relative", flex:0.33, alignself:"stretch",bgcolor: "gray"})
		)

		
		//,edit({x:100,y:30,w:300,h:80,fontsize:60, text:'MyValue'})

			//view({x:0,y:0,w:100,h:100}))
		
		//,view({mode:'DOM', tag:'iframe', 'src':'http://blog.thisisnotrocketscience.nl', bgcolor:'yellow', x:10, y:100, w:190, h:190})
		//,view({mode:'DOM', tag:'iframe', 'src':'http://blog.thisisnotrocketscience.nl', bgcolor:'blue', x:10, y:200, w:290, h:190})
		//,treeview({})
		]
	}
	
}
);



