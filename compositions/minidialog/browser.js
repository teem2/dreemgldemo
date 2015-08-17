define.browser(function(require, screen, view, edit, text, treeview, splitcontainer, scrollcontainer, mousedebug, tabcontrol, button){
	this.render = function(){return[
		view({flexdirection:"column" , flex: 1, bgcolor: "#808070"	},
			view({bgcolor: "white" , flex: 1, margin: 40,flexdirection:"column" },
				view({bgcolor: "#a0a070" , padding: 4,flexdirection:"column" },
					text({text:"The amazing tinydialog!", bgcolor: "transparent" , fontsize: 20})
				),
				splitcontainer({bgcolor: "#f0f0f0" , padding: 4,margin: 4,flexdirection:"column" }
			,	tabcontrol({}, 
					view({tabname: "tab 1"}	,button({text:"Youtube",icon:"youtube"})),
					view({tabname: "tab 2"}	,button({text:"Not Youtube",icon:"facebook"})),
					view({tabname: "tab 3"}	,button({text:"Github",icon:"github"})),
					view({tabname: "tab 4", tabicon:"gears"}	,button({text:"Youtube",icon:"youtube"})),
					splitcontainer({vertical:false}
						,edit({margin:2,fontsize:30,text:'This box contains editable text.\nTo the right is a mouse-test box', flex: 1, 'bg.color':function(){return vec4("#f0f0f0")} , fgcolor: "black"})
						,mousedebug({flex: 1, margin:4,  alignself: "stretch",bgcolor: "blue"})
						,treeview({flex:1,alignself:"stretch"})
					)
					
				)
					
					, splitcontainer({vertical:false}
						,edit({margin:2,fontsize:30,text:'This box contains editable text.\nTo the right is a mouse-test box', flex: 1, 'bg.color':function(){return vec4("#f0f0f0")} , fgcolor: "black"})
						,mousedebug({flex: 1, margin:4,  alignself: "stretch",bgcolor: "blue"})
						,treeview({flex:1,alignself:"stretch"})
					)
					,scrollcontainer({bgcolor: "#f0f0ff"},
						 view({x: 20, y:20,width: 20, height:520, position:"absolute", bgcolor: "yellow" })
						,view({y: 120,x:20, width: 20, height: 520, position:"absolute", height:20, bgcolor: "green" })
						,view({y: 20, x: 120,position:"absolute", width: 20, height:20, bgcolor: "blue" })
						,view({x:120, y:120, position:"relative", width: 20, height:20, bgcolor: "red" })		
						,mousedebug({flex: 1, margin:4,  alignself: "stretch",bgcolor: "blue"})
					)
										
				)
			)
		)]
	}
})



