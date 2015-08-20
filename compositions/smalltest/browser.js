define.browserClass(function(require, screen, view){
	
	var thing2 = view.extend(function(){
		this.bg.color = function(){
			return 'red'
		}
	});
	
	this.render = function(){return[
		thing2({w:100, h:100})
	]}
})



