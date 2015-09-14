//Pure JS based composition
define.class(function(teem, docviewer, fileio, screens, screen, dataset, splitcontainer, treeview, view, text, require){

	this.render = function(){ 
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
						name:'filetree', flex:0.5, w:100
					})
					,view({flex:1}, docviewer({model: require("$classes/dataset") }))
				)
			)
		)
	]}
})