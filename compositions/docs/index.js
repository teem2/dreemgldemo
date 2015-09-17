//Pure JS based composition
define.class(function(teem, docviewer, fileio, screens, screen, dataset, splitcontainer, treeview, view, text, require, scrollcontainer){

	this.render = function(){
		//console.log(t)
		return [
		fileio(),
		screens(
			screen({
				init:function(){
					// lets load the entire directory structure
					this.teem.fileio.readalldir('',['gzcache','@/\\.','.git', '.gitignore']).then(function(result){
						var filetree = this.find('filetree')
						result.name = 'Documentation'
						result.collapsed = false
						// lets make a dataset
						this.model = filetree.dataset = dataset(result)
						console.log(result)
					}.bind(this))
				}},
				splitcontainer({vertical:false, position: "relative",   flexdirection: "row", bgcolor: "black", alignitems:"stretch", alignself: "stretch" , flex:1}
					,view({flexdirection:"column",padding: 0, flex: 0.2}
						,view({alignitems:"center", bgcolor:"#e0e0e0", flexdirection:"row" ,padding: 14},text({text:"DreemGL", fgcolor:"black", bgcolor:"transparent", fontsize: 30 }))
					,scrollcontainer({has_hscroll:false,flex:1},view({flex:1, flexdirection:"column"}
						,treeview({
						init:function(){
							this.dataset = this.find('screen').model
						},
						name:'filetree', flex:1, selectclick:function(sel){
							// we have to grab the last path set and concatenate a path
							var path = ''
							for(var i = sel.path.length - 1; i >= 1; i--){
								path = sel.path[i].name + (path!==''?'/' + path:'')
							}
							path = '$root/'+path
							require.async(path).then(function(module){
								console.log(typeof module)
								//console.log(module.toString())
								this.find('docviewer').model = module
							}.bind(this))
						}
						})))
					)
					,view({flex:1}
							,scrollcontainer({has_hscroll:false, move_view_bgcolor: "#f0f0f0"}
							,docviewer({model: require('$root/README.md')})
						)
					)
				)
			)
		)
	]}
})