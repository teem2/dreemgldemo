define.browserClass(function(require,screen, cadgrid, menubar, menuitem, view, edit, text, icon, treeview, ruler, foldcontainer,button, splitcontainer, scrollbar, editlayout){	
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
						,cadgrid({})
					)
				)
			)
	]}
});



