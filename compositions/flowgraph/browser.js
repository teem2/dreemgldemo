define.browserClass(function(require,screen, cadgrid, menubar, menuitem, view, edit, text, icon, treeview, ruler, foldcontainer,button, splitcontainer, scrollbar, editlayout){	

	this.title = "My Flowgraph2"

	var blokje = view.extend(function blokje(){

		this.position = "absolute" ;
		
		this.bgcolor = vec4("#ffff60")
		this.bg.bgcolorfn = function(a,b)
		{
			return mix(bgcolor, vec4("white"), a.y/2);
		}
		this.flexdirection = "column" 
		this.padding = 1;
		this.borderwidth = 1;
		this.bordercolor = vec4("darkgray");
		this.render = function(){
			
			return [
				
				view({ bgcolor: "#ffff80", "bg.bgcolorfn": function(a,b){return mix(bgcolor, vec4("white"), a.y*0.3);}, padding: 4},
					text({text: this.name, bgcolor: "transparent", fgcolor: "black"})
				),
				view({width: 200, height: 100,bgcolor: "#ffff80", "bg.bgcolorfn": function(a,b){return mix(bgcolor, vec4("white"), 1-(a.y*0.2));}})
				]
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
							,menuitem({text: "Undo"})
							,menuitem({text: "Redo"})
							,menuitem({text: "Options"})		
						)
						,menuitem({text: "Help"}
									,menuitem({text: "Manual"})
									,menuitem({text: "About"})
						)
					)					
				)
				,splitcontainer({name:"mainsplitter", vertical: false}
					,treeview({flex:0.2})
					,view({flex: 0.8}
						,cadgrid({}
							,blokje({x:20, y:20, name: "Blokje 1!"})
							,blokje({x:620, y:250, name: "Blokje 2!"})
							,blokje({x:320, y:120, name: "Blokje 3!"})
							,blokje({x:120, y:320, name: "Blokje 4!"})
						)
					)
				)
			)
	]}
});



