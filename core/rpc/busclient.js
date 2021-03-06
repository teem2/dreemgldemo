// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// BusClient class, always available auto reconnecting socket

define.class(function(require, exports, self){

	self.atConstructor = function(url){
		this.url = url || ''
		this.backoff = 1
		this.reconnect()
	}

	self.disconnect = function(){
		if(this.socket){
			this.socket.onclose = undefined
			this.socket.onerror = undefined
			this.socket.onmessage = undefined
			this.socket.onopen = undefined
			this.socket.close()
			this.socket = undefined
		}
	}

	// Reconnect to server (used internally and automatically)
	self.reconnect = function(){
		this.disconnect()
		if(!this.queue) this.queue = []

		this.socket = new WebSocket('ws://'+location.host+this.url)

		this.socket.onopen = function(){
			this.backoff = 1
			for(var i = 0;i<this.queue.length;i++){
				this.socket.send(this.queue[i])
			}
			this.queue = undefined
		}.bind(this)

		this.socket.onerror = function(event){
			this.backoff = 500
		}.bind(this)

		this.socket.onclose = function(){
			this.backoff *= 2
			if(this.backoff > 1000) this.backoff = 1000
			setTimeout(function(){
				this.reconnect()
			}.bind(this),this.backoff)
		}.bind(this)

		this.socket.onmessage = function(event){
			var msg = JSON.parse(event.data)
			this.atMessage(msg)
		}.bind(this)
	}

	
	// Send a message to the server
	self.send = function(msg){
		msg = JSON.stringify(msg)
		if(this.queue) this.queue.push(msg)
		else this.socket.send(msg)
	}

	// Causes a console.color on the server
	self.color = function(data){
		this.send({type:'color', value:data})
	}

	// Causes a console.log on the server
	self.log = function(data){
		this.send({type:'log', value:data})
	}

	// Called when a message is received
	self.atMessage = function(message){}
})