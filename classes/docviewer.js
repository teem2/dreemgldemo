// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite,view, require, text,foldcontainer){
	
	this.bgcolor = vec4("white" );	
	this.attribute("model", {type:Object})

	this.flex = 1.0
	
	var Parser = require("$parsers/onejsparser");
	//this.flex = 0.5;
	define.class(this, 'BuildDocDisp', function(view, text){
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
			if (this.func.body_text)
			{
				for(var t in this.func.body_text)
				{
				res.push(text({text: this.func.body_text[t], fgcolor: "gray", fontsize: 14, margin: vec4(10)}));
				}
			}
			if (this.func.params && this.func.params.length > 0)
			{
				res.push(text({ fgcolor:"#5050dd", margin:vec4(2,0,4,4), text:"parameters:" }));
				for (var a in this.func.params)
				{	
					var parm = this.func.params[a];
					var left = text({flex:0.2, fgcolor:"black", margin:vec4(10,0,4,4), text:parm.name});
					var right;
					
					if (parm.body_text && parm.body_text.length > 0)
					{
						right= view({flex: 0.8},parm.body_text.map(function(a){return text({fgcolor:"gray", text:a})}))
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
		if (!commentarray) return res;
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
	
	function BuildDoc(module){
		var proto = module.prototype;
		
		var class_doc =	{
			class_name:"",
			body_text: [], // array with strings. each string = paragraph
			examples: [],
			attributes: [{name:"attr1", type:"Object", body_text:["tadaaa","this is another line"]}],
			state_attributes: [{name:"attr1", type:"Object", body_text:["tadaaa","this is another line"]}],
			methods: []
		}
		class_doc.class_name = proto.constructor.name;
		//try{
			
			var parser = new Parser();
		
			var total_ast = parser.parse(module.module.factory.body.toString());
				
			var class_body = total_ast.steps[0];
			
			//console.log(ClassBody);
			var stepzero = class_body.body.steps[0];
			if (!stepzero) return class_doc;
			
			var class_comment = class_body.body.steps[0].cmu;
			var last1 = false;
			
			for(var a in class_comment)
			{
				var com = class_comment[a];
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
					class_doc.body_text.push(com);
				}
			}
			
			for (var a in class_body.body.steps)
			{				
				var step = class_body.body.steps[a];
				var stepleft = step.left;
				console.log(step.left, step.right);
				if (stepleft)	{
					if (stepleft.type==="Key" && stepleft.object.type ==="This"){ 
						var method = {name:stepleft.key.name, params:[]};
						var stepright = step.right;
						if (stepright.type === "Function")
						{
						console.log("right:", stepright);
						console.log("left", stepleft);
						method.body_text = WalkCommentUp(step.cmu);
						
						
						for(var p in stepright.params){							
							var param = stepright.params[p];						
							var paramname = param.id.name; 		
							var paramtag = '<' + paramname  + '>';
							var param = {name: paramname, body_text: []}
							
							var remaining = [];
							for(var a in method.body_text){
								var L = method.body_text[a];
								if (L.indexOf(paramtag) === 0) {
									param.body_text.push(L.substr(paramtag.length).trim());
								}
								else{
									remaining.push(L);
								}
							}
							method.params.push(param);
						
							method.body_text= remaining;
						}
						console.log(method.name);
						class_doc.methods.push(method);			
						}						

					}
				}
			}			
		//}
	//	catch(e){
	//		console.log(e);
	//	}
		
		return class_doc;
	}
	
	this.render = function(){	
		var functions = [];
		var res = [];
		var R = this.model// 	require("$classes/dataset")
		
		//console.log( );
		
		var class_doc = BuildDoc(R)
		
		this.flexdirection = "column"
		this.flexwrap = "none" ;
		res.push(text({width: 100, text:class_doc.class_name,fontsize: 30,margin: vec4(10,0,0,0), fgcolor: "black" }));
		
		for (var a in class_doc.body_text){
			var L = class_doc.body_text[a];
			res.push(text({width: 100, text:L,fontsize: 14, margin: vec4(10,0,10,10), fgcolor: "#303030" }));
		}

		if(class_doc.attributes.length >0){
			var attributes = []

			for (var a in class_doc.attributes){
				attributes.push(this.BuildDocDisp({func: class_doc.attributes[a]}))
				attributes.push(view({height:1, borderwidth: 1, bordercolor:"#c0c0e0", padding: 0, margin: vec4(0,30,0,0)}));
			}
			res.push(foldcontainer({ basecolor:"#f0f0c0", icon:"table", title:"Attributes" , fontsize: 20,margin: vec4(10,0,0,20), fgcolor: "white" }, view({flexdirection: "column", flex: 1}, attributes)));
		}
		
		if(class_doc.state_attributes.length >0){
			var state_attributes = []

			for (var a in class_doc.state_attributes){
				state_attributes.push(this.BuildDocDisp({func: class_doc.state_attributes[a]}))
				state_attributes.push(view({height:1, borderwidth: 1, bordercolor:"#c0c0e0", padding: 0, margin: vec4(0,30,0,0)}));
			}
			res.push(foldcontainer({ basecolor:"#f0c0c0", icon:"table", title:"State Attributes" , fontsize: 20,margin: vec4(10,0,0,20), fgcolor: "white" }, view({flexdirection: "column", flex: 1}, state_attributes)));
		}
		
		if (class_doc.methods.length > 0){
			var methods = []
			console.log(class_doc.methods);
			for (var a in class_doc.methods){
				methods.push(this.BuildDocDisp({func: class_doc.methods[a]}))
				methods.push(view({height:1, borderwidth: 1, bordercolor:"#c0c0e0", padding: 0, margin: vec4(0,30,0,0)}));
			}
			res.push(foldcontainer({  basecolor:"#c0c0f0", icon:"table", title:"Methods" , fontsize: 20,margin: vec4(10,0,0,20), fgcolor: "white" }, view({flexdirection: "column", flex: 1}, methods)));
		}
		return res;
	}
})