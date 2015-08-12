define.browser(function(require, screen, view, edit, text, treeview, splitcontainer, scrollcontainer, mousedebug){
	this.render = function(){return[
		view({flexdirection:"column" , flex: 1, bgcolor: "#808070"	},
			view({bgcolor: "white" , flex: 1, margin: 40,flexdirection:"column" },
				view({bgcolor: "#a0a070" , padding: 4,flexdirection:"column" },
					text({text:"The amazing tinydialog!", bgcolor: "transparent" , fontsize: 20})
				),
				
				splitcontainer({bgcolor: "#f0f0f0" , padding: 4,margin: 4,flexdirection:"column" }
					
					, splitcontainer({vertical:false},edit({margin:2,fontsize:30,text:'This box contains editable text.\nTo the right is a mouse-test box', flex: 1, 'bg.color':function(){return vec4("#f0f0f0")} , fgcolor: "black"}), mousedebug({flex: 1, margin:4,  alignself: "stretch",bgcolor: "blue"}),treeview({flex:1,alignself:"stretch"}))
					,scrollcontainer({alignself:"stretch", bgcolor: "#f0f0ff", height: 100, flex: NaN},
						view({x: 20, width: 20, height:20, position:"absolute", bgcolor: "red" })
						,view({y: 120,width: 20, position:"absolute", height:20, bgcolor: "red" })
						,view({x: 20, y: 120,position:"absolute", width: 20, height:20, bgcolor: "red" })
						,view({x:120, y:120, position:"absolute", width: 20, height:20, bgcolor: "red" })
						
						)
										
				)
			)
		)]
	}
})



