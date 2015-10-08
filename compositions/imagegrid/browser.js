define.browserClass(function(require, screen, myimages, view){
	
	this.bgcolor = "black"
	this.render = function(){ return[
	
		view({ padding: 10, bgcolor: "#101010", flex: 1 },
		myimages({margin: 10, padding: 10,  bgcolor:"#040404"  }))
	]
	}

})