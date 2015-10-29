define.class(function(view, require, screens){

	var GLText = require('$gl/gltext')
	var GLShader = require('$gl/glshader')

	
	this.setMatrixUniforms = function(renderstate){
		var r = this.rects;
		var a = this.arrows;		
		var t = this.texts;		
		r._matrix = renderstate.matrix;
		a._matrix = renderstate.matrix;
		t._matrix = renderstate.matrix;
		r._viewmatrix = renderstate.viewmatrix;
		a._viewmatrix = renderstate.viewmatrix;
		t._viewmatrix = renderstate.viewmatrix;

	}
		
	define.class(this, 'rectshader', GLShader, function(){
		this.color = function(){return vec4("#809080");};
		
		this.addRect  = function(x,y,w,h){
			this.mesh.pushQuad(x,y, x+w, y, x, y+h,x+w, y+h)
		}
		this.mesh = vec2.array();
		this.matrix = mat4.identity()
		this.viewmatrix = mat4.identity()
		
		this.position = function(){
			sized = vec2(mesh.x , mesh.y )
			return vec4(sized.x, sized.y, 0, 1) * matrix * viewmatrix
		}
	})
	
	define.class(this, 'arrowshader', GLShader, function(){
		this.mesh = vec2.quad(0, 0, 1, 0, 0, 1, 1, 1)
		this.matrix = mat4.identity()
		this.viewmatrix = mat4.identity()
		this.color = function(){return vec4("red");};
		this.position = function(){
			sized = vec2(mesh.x, mesh.y )
			return vec4(sized.x, sized.y, 0, 1) * matrix * viewmatrix
		}
	})
	
	define.class(this, 'textshader', GLText, function(){
		this.mesh = vec2.quad(0, 0, 1, 0, 0, 1, 1, 1)
		this.matrix = mat4.identity()
		this.viewmatrix = mat4.identity()
		
		//this.color = function(){return vec4("red");};
		this.position = function(){
			sized = vec2(mesh.x , mesh.y )
			return vec4(sized.x, sized.y, 0, 1) * matrix * viewmatrix
		}
	})

	this.attribute("file",{});
	
	this.file = function(){
		console.log(this.file);
	}
	
	this.init = function(){
		this.rects = new this.rectshader();
		this.texts = new this.textshader();
		this.arrows = new this.arrowshader();
		
		this.textbuf = this.texts.newText()
	}
	
	this.doDraw = function(renderstate){
		this.rects._time = this.screen.time
		this.fg_shader._time = this.screen.time

		this.rects.draw(this.screen.device)
		this.fg_shader.draw(this.screen.device)

		// lets check if we have a reference on time
		if(this.rects.shader && this.rects.shader.unilocs.time || 
			this.texts.shader && this.texts.shader.unilocs.time || 
			
			this.arrows.shader && this.arrows.shader.unilocs.time 
			){
			//console.log('here')
			this.screen.node_timers.push(this)
		}
		
	}
	
	
	this.addBlock  = function(x,y,width,height, label){
	}
	this.addArrow = function(from, to){
	}
	
	this.BuildTree = function(startx, starty, node) {
		this.rects.addRect(startx,starty,100,50);
		var newx = startx;
		var newy = starty + 60;
		
		for(var i = 0;i<node.children.length;i++)
		{
			var c = node.children[i];
			var R = this.BuildTree(newx, newy, c);
			console.log(c);
			
		}
		
		return {x:startx + 110, y: starty + 60};
	}	

	
	this.render = function(){
	
		if (!this.file) return [];
		
		this.nodes = {};
		this.nodeslist = [];
		for(var i = 0;i<this.file.nodes.length;i++)
		{
			var node = this.file.nodes[i];
			var nodestruct =  {source: node, tocount:0, fromcount:0, children:[]};
			this.nodes[node.name] =nodestruct;
			this.nodeslist.push(nodestruct);
		}
		
		for(var i = 0;i<this.file.connections.length;i++) {
			var connection = this.file.connections[i];
			var from = this.nodes[connection.from];
			var to = this.nodes[connection.to];										
			if (to)
			{
				to.tocount++;
				if (from) from.children.push(to);
			}
		}		
		
		console.log(this.nodeslist);
		var x = 10;
		var y = 10;
		for(var i =0 ;i<this.nodeslist.length;i++) {
			var n = this.nodeslist[i];
			console.log(n);
			if (n.tocount ==0){
				x = this.BuildTree(x, y, n).x + 10;

			}
		}
		
		
		return [];	
	}
	
})