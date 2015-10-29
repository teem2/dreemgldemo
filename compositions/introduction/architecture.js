define.class(function(view, require, screens){

	var GLText = require('$gl/gltext')
	var GLShader = require('$gl/glshader')

	this.bgcolor = vec4("red");
	this.setMatrixUniforms = function(renderstate){
		var r = this.rects;
		var a = this.arrows;		
		var t = this.texts;		
		this.bg_shader._matrix = 
		this.fg_shader._matrix = 
		r._matrix = renderstate.matrix;
		a._matrix = renderstate.matrix;
		t._matrix = renderstate.matrix;

		this.fg_shader._viewmatrix =
		this.bg_shader._viewmatrix =
		r._viewmatrix = renderstate.viewmatrix;
		a._viewmatrix = renderstate.viewmatrix;
		t._viewmatrix = renderstate.viewmatrix;
	}
		
	define.class(this, 'rectshader', GLShader, function(){
		
		this.color = function(){			
			return vec4("#809080") + mesh.w *vec4(1,0,0,0);
		};
		
		this.addRect  = function(x,y,w,h){
			this.mesh.pushQuad(x,y,0,0, x+w, y,1,0, x, y+h,0,1, x+w, y+h, 1,1)
		}
		
		this.mesh = vec4.array();
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
		this.matrix = mat4.identity()
		this.viewmatrix = mat4.identity()
		
		//this.color = function(){return vec4("red");};
	
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
		this.texts.mesh = this.textbuf;
	
		this.texts.fgcolor = vec4("black" );
		this.textbuf.fontsize = 20;
	}
	
	this.doDraw = function(renderstate){
		this.rects._time = this.screen.time
		this.texts._time = this.screen.time

		this.rects.draw(this.screen.device)
		this.texts.draw(this.screen.device)

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
		var newx = startx;
		var newy = starty + 80;
		
		var wh = this.textbuf.measurestring(node.source.name);
		
		
		
		
		var maxR = startx;
		
		for(var i = 0;i<node.children.length;i++)
		{
			var c = node.children[i];
			var R = this.BuildTree(maxR+5, newy, c);
			maxR = Math.max(R.x+10, maxR);			
		}

		var blockw = Math.max(110,maxR-newx );
		
		this.rects.addRect(startx,starty,blockw,50);
		this.textbuf.add_x = startx - wh.w /2 + blockw/2;
		this.textbuf.add_y = starty + 50/2 + this.textbuf.fontsize-  this.textbuf.fontsize / 2;
		this.textbuf.add(node.source.name);

		
		return {x: Math.max(maxR,  startx + 110), y: starty + 60};
	}	

	
	this.render = function(){
	
		if (!this.file) return [];
		
		this.nodes = {};
		this.nodeslist = [];
		for(var i = 0; i < this.file.nodes.length; i++){
			var node = this.file.nodes[i];
			var nodestruct =  {source: node, tocount:0, fromcount:0, children:[]};
			this.nodes[node.name] =nodestruct;
			this.nodeslist.push(nodestruct);
		}
		
		for(var i = 0;i<this.file.connections.length;i++) {
			var connection = this.file.connections[i];
			var from = this.nodes[connection.from];
			var to = this.nodes[connection.to];										
			if (from)
			{
				from.tocount++;
				if (to) to.children.push(from);
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