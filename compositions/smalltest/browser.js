define.browserClass(function(require, screen, thing, view, edit, text, treeview, splitcontainer, tabcontrol, button, scrollbar,icon){
	
	console.log(typeof(thing));
	
	var thing2 = thing.extend(function(){
		this.bg.color = function(){
			return vec4(mesh.x *basecolor, 1.0);
		}
	});
	
	this.render = function(){return[
		view({rotation: 0, flexdirection:"column" , flex: 1, bgcolor: "#708080"	},
			view({bgcolor: "white" , flex: 1, margin: 140,flexdirection:"column" },
				view({bgcolor: "#70a0a0" , padding: 4}
					,icon({ rotation: 20, margin:20,fontsize:30, icon:"flask" })
					,text({margin:8,text:"Small test for livecoding", bgcolor: "transparent" , fontsize: 20})					
				),
				tabcontrol({margin:4,bgcolor: "#f0f0f0" }					
					,view({tabname: "thing 1" , bgcolor: "#ffffc0", clipping:true}
						,thing({rotation:0,clipping:true, width:250, flex:1, "bg.basecolor": vec4("yellow" )}
							,text({text:"this is an instance_child", bgcolor: "transparent"})
							,text({text:"this is another instance_child", bgcolor: "transparent"})
							,edit({rotation: 20,text: "editable!", height:100, fontsize: 20})
							,text({text:"this is the third", bgcolor: "transparent"})
						)
						,thing2({  flex:1})
						,scrollbar({width: 50})
						,text({fontsize:30,text:"CLIP", fgcolor:"black",bgcolor: "red"})
					)					
					,view({tabname: "thing 2" },
						button({text:"Open Modal 2",icon:"youtube", click: function(){
								this.screen.openModal(
									view({
										click:function(){
											this.screen.closeModal(1)
										},position:'absolute',bgcolor:'red',w:100,h:100})
								).then(function(result){
									console.log('resolved',result)
								})
							}
						})
					)									
				)
			)
		)
	]}
})



