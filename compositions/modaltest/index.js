// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(composition, screens, browser){
	// modal test function to see how
	// 1) modal displays behave
	// 2) how the layout system operates in "absolute" mode
	// this test is currently broken as far as we know (unless stuff resolved itself already)
	
	this.render = function(){
		return [
			screens(
				browser( {})
			)
		]
	}
})