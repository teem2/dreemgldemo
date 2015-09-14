// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite,view, require, text){
	
	this.bgcolor = vec4("#e0e0e0" );	
	this.attribute("model", {type:Object})
	
	var Parser = require("$parsers/onejsparser");
	
	define.class(this, 'functiondisp', function(view, text){
		this.attribute("func", {type: Object});
		this.bgcolor = vec4("#ffffff");
		this.margin = 4;
		this.borderwidth= 2;
		this.padding = 4;
		this.bordercolor = vec4("#c0c0c0")
		this.flexdirection = "column" ;
		
		this.render = function()
		{		
			var res =  [text({margin:vec4(4),text: this.func.name, fontsize: 20, fgcolor: "black"}),
				text({text: this.func.bodytext, fgcolor: "gray", fontsize: 14, margin: vec4(10)})
			];
			for (a in this.func.params)
			{	
				var f = this.func.params[a];
				res.push(text({ fgcolor:"black", margin:vec4(10,0,4,4), text:f.name}));
			}
			
			return res;
		}
	});
		
	function testfunc(name){
		return {name:name, bodytext:"Tadaa, dit is een ding\nyeeeey \n\nHurrah!", params:[{name:"param1", type: "Object"}, {name:"param2", type: "var"}]}
	}
	
	this.render = function(){	
		var functions = [];
		var res = [];
		var R = 	require("$classes/dataset")
		var P = new Parser();
		
		for (a in R.prototype)
		{
			var proto = R.prototype[a];
			if(typeof(proto) === "function")
			{
				console.log(P.parse(proto.toString()));
				functions.push(testfunc(a));
			}else{
				console.log(R.prototype[a]);
			}
		}
		
		console.log(R.prototype);
		
		//console.log(R.body.toString());
		this.flexdirection = "column"
		for (a in functions)
		{
			console.log(functions[a]);
			res.push(this.functiondisp({func: functions[a]}))
		}
		return res;
	}
})