// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)

define.class( function(view, text){
	// Markdown display class - this element can display a small subset of the "markdown" syntax. See the SUPPORTED_MARKDOWN.md file in the docviewer for supported elements.
	
	// Body can be a single string or an array of strings - each string will be its own paragraph.
	this.attribute("body", {});
	
	// Base fontsize - heading sizes will be multiples of this value.
	this.attribute("fontsize", {type:Number, value: 13});
	
	// The color to use as the default color for this textblock.
	this.attribute("fontcolor", {type:vec4, value: vec4("#202020")});
	
	this.flexdirection = "column"

	// Create a set of visual elements for an array of textlines.
	this.BuildMarkdown= function(lines){
		var res = [];
		
		for(var a in lines)
		{				
			var L = lines[a];
			var LT = L.trim();
			if (LT.length == 0) continue;
		
			var fontsize = this.fontsize;
			var Margin = vec4(10,10,10,10);
			if (LT.indexOf("######") == 0){
				L = LT.substr(7);
				fontsize = this.fontsize * (16. / 14.);				
			} else if (LT.indexOf("#####") == 0){
				L = LT.substr(6);
				fontsize = this.fontsize * (18. / 14.);				
			} else if (LT.indexOf("####") == 0){
				L = LT.substr(5);
				fontsize = this.fontsize * (22. / 14.);				
			} else if (LT.indexOf("###") == 0){
				L = LT.substr(4);
				fontsize = this.fontsize * (25. / 14.);				
			} else if (LT.indexOf("##") == 0){
				L = LT.substr(3);
				fontsize = this.fontsize * (27. / 14.);				
			} else if (LT.indexOf("#") == 0){
				L = LT.substr(2);					
				fontsize = this.fontsize * (30. / 14.);				
			} else {
				// default text
			}
			
			res.push(text({fgcolor: this.fontcolor, margin: Margin, text: L, fontsize: fontsize, multiline: true}));
		}
		
		return res;
	}
	
	this.render = function(){
		if (!this.body) return [];
		if (typeof(this.body) === "array" || (this.body.length && typeof(this.body) !== "string" ) ){
				// join parts and do markup
				
			var lines = [];
			for(var i = 0;i<this.body.length;i++)
			{
				var splitted = this.body[i].split('\n')
				for(var j in splitted) lines.push(splitted[j]);
			}
				
			return this.BuildMarkdown(lines);;
		}
		else{				
			if (typeof(this.body) === "string"){
				
				var lines = [];
				var splitted = this.body.split('\n');
				for(var j in splitted) lines.push(splitted[j]);

				return this.BuildMarkdown(lines);
			}
			else{
				return [text({fgcolor:"#303030", text:"unknown format for body!\n\n" + this.body.toString(), multiline: true, fontsize:12})];
			}
		}
	}

});
