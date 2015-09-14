// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite,view, require, text){
	
	this.bgcolor = vec4("white" );	
	this.attribute("model", {type:Object})
	
	var Parser = require("$parsers/onejsparser");
	//this.flex = 0.5;
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
			var res = [];
			var functionsig = "()"
			if (this.func.params && this.func.params.length > 0) { 
				functionsig = "(" + this.func.params.map(function(a){return a.name}).join(", ") + ")";
			}
			
			res.push(text({margin:vec4(4),text: this.func.name + functionsig , fontsize: 20, fgcolor: "black"}));
			if (this.func.bodytext)
			{
				res.push(text({text: this.func.bodytext, fgcolor: "gray", fontsize: 14, margin: vec4(10)}));
			}
			if (this.func.params && this.func.params.length > 0)
			{
				res.push(text({ fgcolor:"#5050dd", margin:vec4(2,0,4,4), text:"parameters:" }));
				for (a in this.func.params)
				{	
					var f = this.func.params[a];
					res.push(text({ fgcolor:"black", margin:vec4(10,0,4,4), text:f.name}));
				}
			}
			return res;
		}
	});
		
	function funcstruct(name, params){
		return {name:name, bodytext:"Tadaa, dit is een ding\nyeeeey \n\nHurrah!", params:params}
	}
	
	this.render = function(){	
		var functions = [];
		var res = [];
		var R = 	require("$classes/dataset")
		var P = new Parser();
		var proto = R.prototype;
		
		//console.log( );
		
		var ClassDoc = {
			ClassName:"dataset",
			ClassBodyText: [], // array with strings. each string = paragraph
			Examples: [],
			Attributes: [],
			StateAttributes: [],
			Methods: []
		}
		
		try{
			var totalAST = P.parse(R.module.factory.body.toString());
			console.log(totalAST);
				
			var ClassBody = totalAST.steps[0];
			
			console.log(ClassBody);
			
			var ClassComment = ClassBody.body.steps[0].cmu;
			var last1 = false;
			
			for(var a in ClassComment)
			{
				var com = ClassComment[a];
				if (com === 1){
					if(last1 === true){
						break;
					}
					else{
						last1 = true;		
					}
				}
				else{
					last1 = false;
					ClassDoc.ClassBodyText.push(com);
				}
			}
			
			for (var a in ClassBody.body.steps)
			{				
				var step = ClassBody.body.steps[a];
				var stepleft = step.left;
				if (stepleft)	{
					if (stepleft.type==="Key" && stepleft.object.type ==="This"){ 
						var method = {name:stepleft.key.name, params:[]};
						var stepright = step.right;
						for(var p in stepright.params){							
							var param = stepright.params[p];						
							method.params.push({name: param.id.name});
						}

						ClassDoc.Methods.push(method);						
						console.log(method);
					}
				}
			}			
		}
		catch(e){
			console.log(e);
		}
		
		while(proto){
			var keys = Object.keys(proto);
			for(i in keys){
				var key = keys[i];
				if (proto.__lookupSetter__(key)){
					continue;
				}
				
				if (proto.__lookupGetter__(key)){
					continue;
				}
				
				var prop = proto[key];
				
				if (typeof(prop) === "function"){
					var params = [];
					var ast = P.parse(prop.toString());
					//console.log(prop.toString());
					for (param in ast.steps[0].params)
					{
						var p = ast.steps[0].params[param];
						params.push({name:p.id.name});
					}
					//console.log(params);
					functions.push(funcstruct(key, params));
				}else{
					
				}
			 }
			 proto = Object.getPrototypeOf(proto);
		 }
		
	//	console.log(R.prototype);
		
		//console.log(R.body.toString());
		this.flexdirection = "column"
		
		res.push(text({width: 100, text:ClassDoc.ClassName,fontsize: 20, fgcolor: "black" }));
		
		for (a in ClassDoc.ClassBodyText){
			var L = ClassDoc.ClassBodyText[a];
			res.push(text({width: 100, text:L,fontsize: 16, margin: vec4(10,10,10,10), fgcolor: "#101010" }));
		}
		
		for (a in ClassDoc.Methods){
		//	console.log(functions[a]);
			res.push(this.functiondisp({func: ClassDoc.Methods[a]}))
		}
		return res;
	}
})