define.class(function(require, node){	

	this.atConstructor = function(){
		this.undo_stack = []
		this.redo_stack = []
		this.connected_objects = []
		this.data = this.constructor_props
	}

	this.atAttributeAssign = function(obj, key){
		for(var i = 0; i < this.connected_objects.length; i++){
			var co = this.connected_objects[i];
			if (co.obj === obj) return;
		}
		this.connected_objects.push({obj:obj, key:key})
	}

	this.fork = function(callback){
		this.undo_stack.push(JSON.stringify(this.data))
		this.redo_stack.length = 0
		callback(this.data)
		this.notifyAssignedAttributes();
	}

	// cause objects that have us assigned to reload
	this.notifyAssignedAttributes = function(){
		for(var i = 0; i < this.connected_objects.length; i++){
			var o = this.connected_objects[i]
			o.obj[o.key] = this
		}
	}
	
	
	function recursiveCleanup(node){
		if (typeof(node) === "object"){
			if  (node.____struct){
				var lookup  = define.typemap.types[node.____struct] ;
				return lookup.apply(null, node.data);
			}
			else{
				for(key in node){
					node[key] = recursiveCleanup(node[key]);
				}				
			}
		}
		
		return node;
	}
	this.JSONParse = function(stringdata){
		var data = JSON.parse(stringdata)
		recursiveCleanup(data);
		return data;
	}
	
	this.undo = function(){
		if(!this.undo_stack.length) return
		this.redo_stack.push(JSON.stringify(this.data))
		this.data = this.JSONParse(this.undo_stack.pop());
		this.notifyAssignedAttributes();
	}

	this.redo = function(){
		if(!this.redo_stack.length) return
		this.undo_stack.push(JSON.stringify(this.data))
		this.data = this.JSONParse(this.redo_stack.pop())
		this.notifyAssignedAttributes();
	}
})