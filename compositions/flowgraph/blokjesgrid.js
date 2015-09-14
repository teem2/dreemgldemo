"use strict";
define.class(function(require, cadgrid, blokje, connection){	

	this.attribute("dataset", {type: Object, value: {}})
	
	this.connections = []
	this.connectionstart = undefined
	this.connectionend = undefined

	// reuse em iframes
	this.atConstructor = function(){
		this.dom_node_cache = []
	}

	this.tryToBuildConnection = function(){
		if(this.connectionstart && this.connectionend){
			this.dataset.fork(function(data){
				data.connections.push({
					from:{
							node: this.connectionstart.screen, 
							output: this.connectionstart.output,
						    value: this.connectionstart.value

					}
					,to:{
							node: this.connectionend.screen,
							input: this.connectionend.input,
  						    value: this.connectionend.value
					}
				})
			}.bind(this))

			var sblk = this.connectionstart.bkje;
			if (sblk) {
				setTimeout(function() {
					sblk.reloadIFrame()
				}, 1500);
			}
			var eblk = this.connectionend.bkje;
			if (eblk) {
				setTimeout(function() {
					eblk.reloadIFrame()
				}, 1500);
			}

			this.connectionstart = undefined
			this.connectionend = undefined		
		}
	}
	
	this.setConnectionStart = function(blok, output, bkje, value){
		this.connectionstart = {screen: blok, output: output, bkje: bkje, value:value}
		this.tryToBuildConnection();
	}

	this.setConnectionStart = function(blok, output, bkje, value){

		if(this.connectionstart && this.connectionstart.bkje)
		{
			for(var i in this.connections)
			{
				var this_ = this.connections[i];
				if((this_.from === bkje) && (this_.fromattr == output)){
					this.dataset.fork(function(data){


						for(var a in data.connections){
							var con = data.connections[a];
							if (con.from.node == this.from.data.name &&
								con.to.node == this.to.data.name &&
								con.to.input == this.toattr &&
								con.from.output == this.fromattr)
							{
								data.connections.splice(a, 1);
								if (this.from && this.from.reloadIFrame) {
									this.from.reloadIFrame();
								}
								if (this.to && this.to.reloadIFrame) {
									this.to.reloadIFrame();
								}
								return;
							}
						}

					}.bind(this_))
				}

			}

			this.connectionstart.bkje.setConnectorState('output',this.connectionstart.output,false);


			if( (this.connectionstart.bkje === bkje) && (this.connectionstart.output == output)){
				this.connectionstart = undefined;
				return;
			}
		}

		this.connectionstart = {screen: blok, output: output, bkje: bkje, value:value}
		this.connectionstart.bkje.setConnectorState('output',this.connectionstart.output,true);

		this.tryToBuildConnection();
	}

	this.setConnectionEnd = function(blok, input, bkje, value){
		if(this.connectionend && this.connectionend.bkje)
		{
			for(var i in this.connections)
			{
				var this_ = this.connections[i];
				if((this_.to === bkje) && (this_.toattr == input)){
					this.dataset.fork(function(data){


						for(var a in data.connections){
							var con = data.connections[a];
							if (con.from.node == this.from.data.name &&
								con.to.node == this.to.data.name &&
								con.to.input == this.toattr &&
								con.from.output == this.fromattr)
							{
								data.connections.splice(a, 1);
								if (this.from && this.from.reloadIFrame) {
									this.from.reloadIFrame();
								}
								if (this.to && this.to.reloadIFrame) {
									this.to.reloadIFrame();
								}
								return;
							}
						}

					}.bind(this_))
				}

			}

			this.connectionend.bkje.setConnectorState('input',this.connectionend.input,false);
			if((this.connectionend.bkje === bkje) && (this.connectionend.input == input)){
				this.connectionend = undefined;
				return;
			}
		}

		this.connectionend = {screen: blok, input: input, bkje: bkje, value:value}
		this.connectionend.bkje.setConnectorState('input',this.connectionend.input,true);
		this.tryToBuildConnection()
	}
	
	//this.updateConnections = function(name, pos){
	//	for (var i in this.connections){
	//		var c = this.connections[i];
	//		if (c.to.name === name || c.from.name === name) c.update(this.blokjes[c.from.name], this.blokjes[c.to.name]);
	//	}
	//}
	
	this.blokjes = {}

	this.dblclick = function(){

	}

	this.render = function(){
		var outer = this
		this.blokjes = {};
		var all = [];			
		var connecties = {};
		var i = 0;

		for(var a in this.dataset.data.screens){
			var d = this.dataset.data.screens[a]
			this.blokjes[d.name] = blokje({dataset:this.dataset, blokid:a, dblclick:function(){
				outer.emit('dblclick',this)
			},data: d, x:(d.x!==undefined)?d.x:20 + i *30 , y:(d.y!==undefined)?d.y:20 + i *30 })
			i++
			
			all.push(this.blokjes[d.name])
		}
		this.connections = []
		for(var a in this.dataset.data.connections){
			var c = this.dataset.data.connections[a]
			var b1 = this.blokjes[c.from.node]
			var b2 = this.blokjes[c.to.node]
			if (b1 && b2){

				//shin --start--
				(function(b1,b2,c){
					setTimeout(function(){
						b1.setConnectorState('output',c.from.output,true);
						b2.setConnectorState('input',c.to.input,true);
					},10);
				}(b1,b2,c));
				//shin --end--


				var newcon = connection({from: b1, fromattr: c.from.output, to: b2, toattr: c.to.input, dataset: this.dataset})

				this.connections.push(newcon)
				all.push(newcon)
			}
		}
		return all
	}
})