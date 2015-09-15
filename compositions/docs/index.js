//Pure JS based composition
define.class(function(teem, docviewer, fileio, screens, screen, dataset, splitcontainer, treeview, view, text, require, scrollcontainer){

	this.render = function(){ 
		//console.log(t)
		return [
		fileio(),
		screens(
			screen(
				{
				init:function(){
					// lets load the entire directory structure
					this.teem.fileio.readalldir('',['gzcache','@/\\.','.git', '.gitignore']).then(function(result){
						var filetree = this.find('filetree')
						result.name = 'Documentation'
						result.collapsed = false
						// lets make a dataset
						this.model = filetree.dataset = dataset(result)
					}.bind(this))
				}},
				splitcontainer({vertical:false, position: "relative",   flexdirection: "row", bgcolor: "black", alignitems:"stretch", alignself: "stretch" , flex:1}
					,view({flexdirection:"column",padding: 0, flex: 0.2}
						,view({alignitems:"center", bgcolor:"#e0e0e0", flexdirection:"row" ,padding: 14},text({text:"DreemGL", fgcolor:"black", bgcolor:"transparent", fontsize: 30 }))
						,treeview({
						name:'filetree', flex:1, selectclick:function(selection){
							require.async('$classes/' + selection.item.name).then(function(module){
								//console.log(this.find('docviewer'))
								this.find('docviewer').model = module
							}.bind(this))
						}
						})
					)
					,view({flex:1},
						scrollcontainer({},
							docviewer({name:'docviewer', model: require('$classes/foldcontainer')})
						)
					)
				)
			)
		)
	]}
})