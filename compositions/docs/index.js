//Pure JS based composition
define.class(function(teem, docviewer, fileio, screens, screen, dataset, splitcontainer, treeview, view, text, require, scrollcontainer){

	this.render = function(){
		//console.log(t)
		return [
		fileio(),
		screens(
			thescreen = screen({
				init:function(){
					// lets load the entire directory structure
					this.teem.fileio.readalldir('',['fonts','build','lib','server.js','favicon.ico','define.js','textures','gzcache','@/\\.','.git', '.gitignore']).then(function(result){
						var filetree = this.find('filetree')
						result.name = 'Documentation'
						result.collapsed = false
						// lets make a dataset
						this.model = filetree.dataset = dataset(result)
					}.bind(this))
					
				},
				render:function(){
					if (this.locationhash && this.locationhash.path){
						require.async(this.locationhash.path).then(function(module){
							console.log("async done!");
						this.find('docviewer').model = module						
					}.bind(this))
					}
					console.log(this.locationhash);
					return [
				splitcontainer({ vertical: false, position: "relative", flexdirection: "row", bgcolor: "black", alignitems:"stretch", alignself: "stretch" , flex:1}
					,view({flexdirection:"column", padding: 0, flex: 0.2}
						,view({alignitems:"center", bgcolor:"#e0e0e0", flexdirection:"row" ,padding: 14},
							text({text:"DreemGL", fgcolor:"black", bgcolor:"transparent", fontsize: 30 })
						)
						,scrollcontainer({hscrollvisible:false,flex:1},
							view({flex:1, flexdirection:"column"}
								,treeview({
									init:function(){
										this.dataset = this.find('screen').model
									},
									name:'filetree', 
									flex:1, 
									selectclick:function(sel){
										// we have to grab the last path set and concatenate a path
										var path = ''
										for(var i = sel.path.length - 1; i >= 1; i--){
											path = sel.path[i].name + (path!==''?'/' + path:'')
										}
										thescreen.locationhash = {path : '$root/'+path};
									}
								})
							)
						)
					)
					,view({flex:1}
						,scrollcontainer({hscrollvisible:false, move_view_bgcolor: "#f0f0f0"}
							,docviewer({model: ""})
						)
					)
			)]}}
			)
		)
	]}
})