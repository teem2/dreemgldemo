define.browser(function(require, screen, view, edit, text, treeview){
	this.render = function(){return[
		view({flexdirection:"column" , flex: 1, bgcolor: "#808070"	},
			view({bgcolor: "white" , flex: 1, margin: 40,flexdirection:"column" },
				view({bgcolor: "#a0a070" , padding: 4,flexdirection:"column" },
					text({text:"some dialog", bgcolor: "transparent" , fontsize: 20})
				),
				view({bgcolor: "#f0f0f0" , flex: 1, margin: 4,flexdirection:"column" },
					edit({fontsize:30,text:'Type\nHere\nMultiline', flex: 1, 'bg.color':function(){return vec4("#f0f0f0")} , fgcolor: "black"})
				)
			)
		)]
	}
})



