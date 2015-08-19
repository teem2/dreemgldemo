define.browserClass(function(require, screen, icon,view, edit, text,scrollbar,  treeview, splitcontainer, scrollcontainer, mousedebug, tabcontrol, button, grid){

	var json = require('$compositions/dynagrid/top_movies.json')

	this.buildmoviegrid = function(){
		var tiles = []
			var results = json.searchResponse.results
			for(var i = 0; i < 40; i++){
				var imgs = results[i].movie.images
				var img = imgs[imgs.length-1]
				tiles.push(
					view({
						margin: 10, 
						w:100,h:100,bgimage:img.url
					})
				)
			}
			return tiles
	}
	
	this.render = function(){return[
		view({flexdirection:"row" , flex: 1, bgcolor: "#202060", alignitems:"center"	},
			view({ alignself: "center", bgcolor: "#202060",flexdirection:"column",alignself:"stretch", flex:1},
			view({ borderwidth:20, bordercolor:"white", alignself: "stretch",padding:4},
			view({bgcolor: "white",flex: 1, margin: 0,flexdirection:"column" },
				view({bgcolor: "#b0b010" , padding: 4,flexdirection:"row" },
					icon({icon:"flask", fgcolor:"white", fontsize: 20, margin: 10 })
					,text({text:"This is the amazing tinydialog!", bgcolor: "transparent" , fontsize: 25, margin: 4})
				),
				tabcontrol({bgcolor: "#f0f0f0" , flexdirection:"column" }
					,tabcontrol({tabname:"tests", tabicon:"hand-lizard" }, 
					view({tabicon:"film", tabname: "Movie Grid Test", flex: 1, flexdirection: "column" }	,
					grid({cols: 10},this.buildmoviegrid())
					),
					view({tabicon:"th", tabname: "Grid Test", flex: 1, flexdirection: "column" }	
						,grid({cols:4 , items: 10}
							,icon({fontsize: 40, icon:"flask" })
							,icon({fontsize: 40, icon:"hand-spock" })
							,icon({fontsize: 40, icon:"hand-lizard" })
							,icon({fontsize: 40, icon:"hand-paper" })
							,icon({fontsize: 40, icon:"hand-rock" })
							,icon({fontsize: 40, icon:"hand-scissors" })
							
							)
							,view({flexdirection: "row"}
								,icon({fontsize: 40, icon:"flask" })
							,icon({fontsize: 40, icon:"hand-spock" })
							,icon({fontsize: 40, icon:"hand-lizard" })
							,icon({fontsize: 40, icon:"hand-paper" })
							,icon({fontsize: 40, icon:"hand-rock" })
								,icon({fontsize: 40, icon:"flask" })
							,icon({fontsize: 40, icon:"hand-spock" })
							,icon({fontsize: 40, icon:"hand-lizard" })
							,icon({fontsize: 40, icon:"hand-paper" })
							,icon({fontsize: 40, icon:"hand-rock" })
								,icon({fontsize: 40, icon:"flask" })
							,icon({fontsize: 40, icon:"hand-spock" })
							,icon({fontsize: 40, icon:"hand-lizard" })
							,icon({fontsize: 40, icon:"hand-paper" })
							,icon({fontsize: 40, icon:"hand-rock" })
								,icon({fontsize: 40, icon:"flask" })
							,icon({fontsize: 40, icon:"hand-spock" })
							,icon({fontsize: 40, icon:"hand-lizard" })
							,icon({fontsize: 40, icon:"hand-paper" })
							,icon({fontsize: 40, icon:"hand-rock" })
							,icon({fontsize: 40, icon:"hand-scissors" })
						)
						,scrollbar({vertical: false,  height: 20})
					),
					view({tabname: "tab 1"}	,button({text:"Youtube",icon:"youtube"})),
					view({tabname: "tab 2"}	,button({text:"Not Youtube",icon:"facebook"})),
					view({tabname: "tab 3"}	,button({text:"Github",icon:"github"})),
					view({tabname: "tab 4", tabicon:"gears"}	,button({text:"Youtube",icon:"youtube"})),
					splitcontainer({tabname: "Splitter thing" ,tabicon:"flask", vertical:false}
						,edit({margin:2,fontsize:30,text:'This box contains editable text.\nTo the right is a mouse-test box', flex: 1, 'bg.color':function(){return vec4("#f0f0f0")} , fgcolor: "black"})
						,mousedebug({flex: 1, margin:4,  alignself: "stretch",bgcolor: "blue"})
						,treeview({flex:1,alignself:"stretch"})
					)
				)
					, splitcontainer({tabname:"tests", tabicon:"hand-spock" ,vertical:false}
						,edit({margin:2,fontsize:30,text:'This box contains editable text.\nTo the right is a mouse-test box', flex: 1, 'bg.color':function(){return vec4("#f0f0f0")} , fgcolor: "black"})
						,mousedebug({flex: 1, margin:4,  alignself: "stretch",bgcolor: "blue"})
						,treeview({flex:1,alignself:"stretch"})
					)
					,scrollcontainer({bgcolor: "#f0f0ff",tabname:"Scrollcontainer", tabicon:"hand-scissors" },
						view({padding: 10, margin: 10, flex: 1},
						view({width: 300},
						 view({x: 20, y:20,width: 20, height:20, position:"absolute", bgcolor: "yellow" })
						,view({y: 120,x:20, width: 20, height: 20, position:"absolute", height:20, bgcolor: "green" })
						,view({y: 20, x: 120,position:"absolute", width: 20, height:20, bgcolor: "blue" })
						,view({x:120, y:120, position:"relative", width: 20, height:20, bgcolor: "red" })	)
						,mousedebug({flex: 1, margin:4,  alignself: "stretch",bgcolor: "blue"}))
					)										
				)
			)
			))
		)]
	}
})



