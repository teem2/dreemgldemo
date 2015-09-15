// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class(function(sprite,view, require, text,foldcontainer){
	
	this.bgcolor = vec4("#f0f0f0" );	
	this.attribute("model", {type:Object})
	this.state("model");
	this.flex = 1.0
	this.padding=20;
	var Parser = require("$parsers/onejsparser");
	//this.flex = 0.5;
	
	// A single documentation block with name and bodytext.
	define.class(this, 'ClassDocItem', function(view, text){
		
		this.attribute("func", {type: Object});
		this.bgcolor = vec4("#ffffff");
		this.margin = 4;
		this.padding = 4;
		this.flexdirection = "column" ;
		this.flexwrap = "none"
		// the type of this display block. Accepted values: "function", "attribute"
		this.attribute("blocktype", {type:String, value:"function"});
		this.render = function()
		{	
			var res = [];
			
			
			if (this.blocktype === "function")
			{
				var functionsig = "()"
				if (this.func.params && this.func.params.length > 0) { 
					functionsig = "(" + this.func.params.map(function(a){return a.name}).join(", ") + ")";
				}
				res.push(text({margin:vec4(2),text: this.func.name + functionsig , fontsize: 20, fgcolor: "black"}));
			}
			else{
				
				var sub = [];
				if (this.func.type)
				{
					sub.push(
						text({margin:vec4(2),text: "type: "+ this.func.type, fontsize: 15, fgcolor: "#404040"}));
				}
				if (this.func.defvalue !== undefined)
				{
					
					if (this.func.type === "vec4")
					{
						console.log(this.func.defvalue);
						var labeltext = (Math.round(this.func.defvalue[0]*100)/100) + ", " + 
						(Math.round(this.func.defvalue[1]*100)/100) + ", " + 
						(Math.round(this.func.defvalue[2]*100)/100) + ", " + 
						(Math.round(this.func.defvalue[3]*100)/100) ;
						
						var zwartdiff = this.func.defvalue[0] + this.func.defvalue[1] + this.func.defvalue[2];
						var witdiff = (1-this.func.defvalue[0]) + (1-this.func.defvalue[1]) + (1-this.func.defvalue[2]);
						var color = "black";
						if (witdiff > zwartdiff) color = "white";
						
						sub.push(
							view({},
								[
									text({margin:vec4(2),text: "default:", fontsize: 15, fgcolor: "#404040"}),
									view({bordercolor: "#808080", borderwidth: 1, cornerradius:4, bgcolor: this.func.defvalue, padding: vec4(8,3,8,3)},
										text({fgcolor: color , bgcolor:"transparent" , text:labeltext})
									)
								]
							));
					}
					else{
						if (this.func.type === "String"){
							sub.push(text({margin:vec4(2),text: "default: \""+ this.func.defvalue.toString() + "\"" , fontsize: 15, fgcolor: "#404040"}))
						}
						else
						{
							sub.push(text({margin:vec4(2),text: "default: "+ this.func.defvalue.toString(), fontsize: 15, fgcolor: "#404040"}))
						}
					}
				}
				console.log(this.func);
				var title = text({margin:vec4(2),text: this.func.name, fontsize: 20, fgcolor: "black"})
				//res.push();
				
				res.push(view({flex: 1},[title,view({flex: 1, flexdirection:"column", alignitems:"flex-end" },sub)]));
			}
			
			if (this.func.body_text){
				for(var t in this.func.body_text){
					res.push(text({text: this.func.body_text[t], fgcolor: "gray", fontsize: 14, margin: vec4(10)}));
				}
			}
			
			if (this.func.params && this.func.params.length > 0){
				res.push(text({ fgcolor:"#5050dd", margin:vec4(2,0,4,4), text:"parameters:" }));
				for (var a in this.func.params){	
					var parm = this.func.params[a];
					var left = text({ fgcolor:"black", margin:vec4(10,0,4,4), text:parm.name});
					var right;
					
					if (parm.body_text && parm.body_text.length > 0){
						right= view({flex: 0.8},parm.body_text.map(function(a){return text({fgcolor:"gray", text:a})}))
					}
					else{
						right = view({flex: 1.0});
					}
					res.push(view({height:1, borderwidth: 1, bordercolor:"#e0e0e0", padding: 0}));
					res.push(view({ flexdirection:"row"},[left, right]));
					
				}
				res.push(view({height:1, borderwidth: 1, bordercolor:"#e0e0e0", padding: 0}));
			}
			return res;
		}
	});
			
	// Look through the array of comments upwards until a full newline is found. 
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
	// Build a minimal correct version of the ClassDoc structure
	function BlankDoc(){
			return {
			class_name:"",
			body_text: [], // array with strings. each string = paragraph
			examples: [],
			events: [],
			attributes: [],
			state_attributes: [],
			methods: [],
			inner_classes: []
		}
	}
	
	// Build a documentation structure for a given constructor function
	function BuildDoc(constructor){
		var proto = constructor.prototype;
		console.log(proto.constructor.name);
		var class_doc = BlankDoc();
		class_doc.class_name = proto.constructor.name;
		//try{
			
			var parser = new Parser();
		
			var total_ast = parser.parse(proto.constructor.body.toString());
				
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
				if (step.type ==="Call"){
					
					if (step.fn.object.type ==="This"){
						if (step.fn.key.name === "attribute"){
							var attrname = step.args[0].value;
							var attr = proto._attributes[attrname];
							console.log(attrname,attr );
							
							var defvaluename = undefined;
							if (attr.value){	
							console.log(typeof(attr.value));
								if (typeof(attr.value ) === "Function"){
										console.log(" function1!!");
								}
								else{
									console.log(attr.value);
									defvaluename = attr.value;
								}
}
							var attrdoc = {name: attrname, type:attr.type.name.toString(), defvalue: defvaluename, body_text: WalkCommentUp(step.cmu)}
							console.log(attrdoc);
							class_doc.attributes.push(attrdoc)
							
						} else if (step.fn.key.name === "event"){							
							class_doc.events.push({name: step.args[0].value})
						}
						else if (step.fn.key.name === "state"){								
							class_doc.state_attributes.push({name: step.args[0].value})
						}
					}
					else{
						if (step.fn.object.type ==="Id"){
							if (step.fn.object.name === "define"){
								if (step.fn.key.name === "class"){
									var innerclassname = step.args[1].value;
										var NewClass = BuildDoc( proto[innerclassname]);
										//NewClass.class_name = innerclassname;
										NewClass.body_text = WalkCommentUp(step.cmu);
										class_doc.inner_classes.push(NewClass);
								};
							}
						}
					}
					
					
				} else {
					var stepleft = step.left;
					//console.log(step.left, step.right);
					if (stepleft)	{
					//		console.log("left", stepleft.key.name, stepleft);
						
						if (stepleft.type==="Key" && stepleft.object.type ==="This"){ 
							var method = {name:stepleft.key.name, params:[]};
							var stepright = step.right;
							if (stepright.type === "Function")
							{
						//	console.log("right:", stepright);
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
							//console.log(method.name);
							class_doc.methods.push(method);			
							}						

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
	
	// This class will recursively expand a class_doc sturcture to an on-screen view.
	define.class(this, 'ClassDocView', function(view, text){
	
	// If collapsible is true, the render function will build a foldcontainer around this class. This is used for recursion levels > 0 of the docviewer class.	
	this.attribute("collapsible", {type: Boolean, value:false});
	this.flexdirection = "column"
	this.flexwrap = "none" ;
	
	// the class_doc structure to display. 
	this.attribute("class_doc", {type: Object});
	
	this.render = function(){
		var body = [];
		var res =[];
		var class_doc = this.class_doc;
		
		if (!this.collapsible ){
			body.push(text({width: 500, text:class_doc.class_name,fontsize: 30,margin: vec4(10,10,0,20), fgcolor: "black" }));
		}
		if (class_doc.body_text.length > 0)
		{
			for (var a in class_doc.body_text){
				var L = class_doc.body_text[a];
				body.push(text({width: 500, text:L,fontsize: 14, margin: vec4(10,0,10,10), fgcolor: "#303030" }));
			}
		}
			res.push(view({flexdirection:"column", margin: vec4(10,0,0,20)}, body));

		if(class_doc.attributes.length >0){
			var attributes = []

			for (var a in class_doc.attributes){
				attributes.push(this.classroot.ClassDocItem({blocktype:"attribute", func: class_doc.attributes[a]}))
				attributes.push(view({height:1, borderwidth: 1, bordercolor:"#c0c0e0", padding: 0, margin: vec4(0,30,0,0)}));
			}
			res.push(foldcontainer({collapsed:false, basecolor:"#f0f0c0", icon:"table", title:"Attributes" , fontsize: 20,margin: vec4(10,0,0,20), fgcolor: "white" }, view({flexdirection: "column", flex: 1}, attributes)));
		}
		
		if(class_doc.state_attributes.length >0){
			var state_attributes = []

			for (var a in class_doc.state_attributes){
				state_attributes.push(this.classroot.ClassDocItem({blocktype:"attribute",func: class_doc.state_attributes[a]}))
				state_attributes.push(view({height:1, borderwidth: 1, bordercolor:"#c0c0e0", padding: 0, margin: vec4(0,30,0,0)}));
			}
			res.push(foldcontainer({collapsed:true, basecolor:"#f0c0c0", icon:"table", title:"State Attributes" , fontsize: 20,margin: vec4(10,0,0,20), fgcolor: "white" }, view({flexdirection: "column", flex: 1}, state_attributes)));
		}
		
		if (class_doc.inner_classes.length > 0){
			var classes = []
			//console.log(class_doc.methods);
			for (var a in class_doc.inner_classes){
				classes.push(this.classroot.ClassDocView({collapsible:true, class_doc: class_doc.inner_classes[a]}))
				classes.push(view({height:1, borderwidth: 1, bordercolor:"#c0c0e0", padding: 0, margin: vec4(0,30,0,0)}));
			}
			res.push(foldcontainer({collapsed:true,  basecolor:"#c0f0c0", icon:"table", title:"Inner classes" , fontsize: 20,margin: vec4(10,0,0,20), fgcolor: "white" }, view({flexdirection: "column", flex: 1}, classes)));
		}
	
	
		if (class_doc.methods.length > 0){
			var methods = []
			//console.log(class_doc.methods);
			for (var a in class_doc.methods){
				methods.push(this.classroot.ClassDocItem({blocktype:"function",func: class_doc.methods[a]}))
				
			}
			res.push(foldcontainer({collapsed:true,  basecolor:"#c0c0f0", icon:"table", title:"Methods" , fontsize: 20,margin: vec4(10,0,0,20), fgcolor: "white" }, view({flexdirection: "column", flex: 1}, methods)));
		}
		
		if (this.collapsible){
			
			return foldcontainer({basecolor:"#c0f0c0",collapsed:true,icon:"flask", title:class_doc.class_name},view({flexdirection:"column", flex:1},res));
		}
		
		return res;
		
	}
	})
	
	this.flexdirection = "column"
	this.flexwrap = "none" ;
		
		
	this.render = function(){	
		var functions = [];
		var res = [];
		var R = this.model// 	require("$classes/dataset")
		
		//console.log( );
		
		var class_doc = BuildDoc(R)
		
		return [this.ClassDocView({class_doc:class_doc})]
	}
})