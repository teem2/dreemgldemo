//Pure JS based composition
define.class(function(teem, docviewer, fileio, screens, screen, dataset, splitcontainer, treeview, view, text, require, scrollcontainer){

	this.render = function(){ 
		//console.log(t)
		return [
		fileio(),
		screens(
			screen(
				{init:function(){
					// lets load the entire directory structure
					this.teem.fileio.readalldir('',['gzcache','@/\\.']).then(function(result){
						var filetree = this.find('filetree')
						result.name = 'Documentation'
						result.collapsed = false
						// lets make a dataset
						filetree.dataset = dataset(result)
					}.bind(this))
				}},
				splitcontainer({vertical:false, position: "relative",   flexdirection: "row", bgcolor: "black", alignitems:"stretch", alignself: "stretch" , flex:1}
					,treeview({
						name:'filetree', flex:0.5, w:100, selectclick:function(node, path){
							require.async('$classes/' + node.name).then(function(module){
								//console.log(this.find('docviewer'))
								this.find('docviewer').model = module
							}.bind(this))
						}
					})
					,view({flex:1},
						scrollcontainer({},
							docviewer({name:'docviewer', model: require('$classes/dataset')})
						)
					)
				)
			)
		)
	]}
})