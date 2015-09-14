// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite,view, require, text){
	
	this.bgcolor = vec4("white" );	
	this.attribute("model", {type:Object})
	this.flex = 1.0
	
	var Parser = require("$parsers/onejsparser");
	//this.flex = 0.5;
	define.class(this, 'functiondisp', function(view, text){
		this.attribute("func", {type: Object});
		this.bgcolor = vec4("#ffffff");
		this.margin = 4;
		this.padding = 4;
		this.flexdirection = "column" ;
		this.flexwrap = "none"
		
			
		this.render = function()
		{	
			var res = [];
			var functionsig = "()"
			if (this.func.params && this.func.params.length > 0) { 
				functionsig = "(" + this.func.params.map(function(a){return a.name}).join(", ") + ")";
			}
			
			res.push(text({margin:vec4(4),text: this.func.name + functionsig , fontsize: 20, fgcolor: "black"}));
			if (this.func.FunctionBodyText)
			{
				for(var t in this.func.FunctionBodyText)
				{
				res.push(text({text: this.func.FunctionBodyText[t], fgcolor: "gray", fontsize: 14, margin: vec4(10)}));
				}
			}
			if (this.func.params && this.func.params.length > 0)
			{
				res.push(text({ fgcolor:"#5050dd", margin:vec4(2,0,4,4), text:"parameters:" }));
				for (a in this.func.params)
				{	
					var parm = this.func.params[a];
					var left = text({flex:0.2, fgcolor:"black", margin:vec4(10,0,4,4), text:parm.name});
					var right;
					
					if (parm.ParamBodyText && parm.ParamBodyText.length > 0)
					{
						right= view({flex: 0.8},parm.ParamBodyText.map(function(a){return text({fgcolor:"gray", text:a})}))
					}
					else{
						right = view({flex: 1.0});
					}
					res.push(view({ flexdirection:"row"},[left, right]));
					res.push(view({height:1, borderwidth: 1, bordercolor:"#e0e0e0", padding: 0}));
					
				}
			}
			return res;
		}
	});
		
	function funcstruct(name, params){
		return {name:name, bodytext:"Tadaa, dit is een ding\nyeeeey \n\nHurrah!", params:params}
	}
	
	
	function WalkCommentUp(commentarray)
	{
		var res = [];
		var last1 = false;
		for (var i = commentarray.length -1;i>=0;i--)
		{
				var com = commentarray[i];
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
					res.unshift(com.trim());
				}
		}
		return res;
	}
	this.render = function(){	
		var functions = [];
		var res = [];
		var R = this.model// 	require("$classes/dataset")
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
						method.FunctionBodyText = WalkCommentUp(step.cmu);
						
						
						for(var p in stepright.params){							
							var param = stepright.params[p];						
							var paramname = param.id.name; 		
							var paramtag = '<' + paramname  + '>';
							var Param = {name: paramname, ParamBodyText: []}
							
							var remaining = [];
							for(var a in method.FunctionBodyText){
								var L = method.FunctionBodyText[a];
								if (L.indexOf(paramtag) === 0) {
									Param.ParamBodyText.push(L.substr(paramtag.length).trim());
								}
								else{
									remaining.push(L);
								}
							}
								method.params.push(Param);
						
							method.FunctionBodyText= remaining;
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
		
		this.flexdirection = "column"
		
		res.push(text({width: 100, text:ClassDoc.ClassName,fontsize: 30,margin: vec4(10,0,0,0), fgcolor: "black" }));
		
		for (a in ClassDoc.ClassBodyText){
			var L = ClassDoc.ClassBodyText[a];
			res.push(text({width: 100, text:L,fontsize: 16, margin: vec4(10,10,10,10), fgcolor: "#101010" }));
		}
		
		for (a in ClassDoc.Methods){
			res.push(this.functiondisp({func: ClassDoc.Methods[a]}))
			res.push(view({height:1, borderwidth: 1, bordercolor:"#c0c0e0", padding: 0, margin: vec4(0,30,0,0)}));
					
		}
		return res;
	}
})