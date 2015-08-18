define.browser(function(require, screen, view, edit, text, treeview, splitcontainer, modalview, tabcontrol, button){
	this.render = function(){return[
		view({flexdirection:"column" , flex: 1, bgcolor: "#708080"	},
			view({bgcolor: "white" , flex: 1, margin: 140,flexdirection:"column" },
				view({bgcolor: "#70a0a0" , padding: 4},
					text({text:"Modal Dialog Test Setup 1", bgcolor: "transparent" , fontsize: 20})
				),
				tabcontrol({bgcolor: "#f0f0f0" }
					,view({tabname: "thing 1" },
						button({text:"Open Modal 1",icon:"youtube", click:
							function(){
								this.screen.openModal(
									modalview({x: this.mouse.x+100})
								).then(
									function(result){									
									}
								);
							}
						})
					)
					,view({tabname: "thing 2" },
						button({text:"Open Modal 2",icon:"youtube", click:
							function(){
								this.screen.openModal(
									modalview({x: 400})
								).then(
									function(result){									
									}
								);
							}
						})
					)
					
					
					)))]
	}
})



