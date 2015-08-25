"use strict";
define.class(function(require, cadgrid, blokje, connection){	

	this.attribute("dataset", {type: Object, value: {}})
	
	this.connections = []
	this.connectionstart = undefined
	this.connectionend = undefined

	this.tryToBuildConnection = function(){
		if(this.connectionstart && this.connectionend){
			this.dataset.fork(function(data){
				data.connections.push({
					from:{
							node: this.connectionstart.screen, 
							output: this.connectionstart.output
					}
					,to:{
							node: this.connectionend.screen,
							input: this.connectionend.input,
					}
				})
			}.bind(this))
			this.connectionstart = undefined
			this.connectionend = undefined		
		}
	}
	
	this.setConnectionStart = function(blok, output){
		this.connectionstart = {screen: blok, output: output}
		this.tryToBuildConnection();
	}

	this.setConnectionEnd = function(blok, input){
		this.connectionend = {screen: blok, input: input}
		this.tryToBuildConnection()
	}
	
	//this.updateConnections = function(name, pos){
	//	for (var i in this.connections){
	//		var c = this.connections[i];
	//		if (c.to.name === name || c.from.name === name) c.update(this.blokjes[c.from.name], this.blokjes[c.to.name]);
	//	}
	//}
	
	this.blokjes = {}
	
	this.render = function(){
			
		this.blokjes = {};
		var all = [];			
		var connecties = {};
		var i = 0;
		for(var a in this.dataset.data.screens){
			var d = this.dataset.data.screens[a]
			this.blokjes[d.name] = blokje({dataset:this.dataset, data: d, x:(d.x!==undefined)?d.x:20 + i *30 , y:(d.y!==undefined)?d.y:20 + i *30 })
			i++
			
			all.push(this.blokjes[d.name])
		}
		this.connections = []
		for(var a in this.dataset.data.connections){
			var c = this.dataset.data.connections[a]
			var b1 = this.blokjes[c.from.node]
			var b2 = this.blokjes[c.to.node]
			if (b1 && b2){
				var newcon = connection({from: b1, fromattr: c.from.output, to: b2, toattr: c.to.input, dataset: this.dataset})
				this.connections.push(newcon)
				all.push(newcon)
			}
		}
		return all
	}
})