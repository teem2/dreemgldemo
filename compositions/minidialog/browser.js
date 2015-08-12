define.browser(function(require, screen, view, edit, text, treeview, splitcontainer, scrollcontainer, mousedebug){
	this.render = function(){return[
		view({flexdirection:"column" , flex: 1, bgcolor: "#808070"	},
			view({bgcolor: "white" , flex: 1, margin: 40,flexdirection:"column" },
				view({bgcolor: "#a0a070" , padding: 4,flexdirection:"column" },
					text({text:"The amazing tinydialog!", bgcolor: "transparent" , fontsize: 20})
				),
				mousedebug({flex: undefined, margin:4, width: 100, height: 100, bgcolor: "blue"}),
				splitcontainer({bgcolor: "#f0f0f0" , padding: 4,margin: 4,flexdirection:"column" }
					,edit({margin:2,fontsize:30,text:'This box contains editable text.', flex: 1, 'bg.color':function(){return vec4("#f0f0f0")} , fgcolor: "black"})
					,scrollcontainer({},treeview({}))					
				)
			)
		)]
	}
})



