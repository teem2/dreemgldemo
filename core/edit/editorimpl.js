define.mixin(function(require){

	var CursorSet = require('$edit/cursorset')
	var Cursor = require('./cursor')
	var parse = require('$parsers/onejsparser')

	this.addUndoInsert = function(start, end, stack){
		if(!stack) stack = this.undo_stack
		// merge undo groups if it merges
		var last = stack[stack.length - 1]
		if(last && last.type == 'insert' && 
			last.start == end){
			var group = last.group
			last.group = this.undo_group
			for(var i = stack.length - 2;i>=0;i--){
				if(stack[i].group == group) stack[i].group =  this.undo_group
			}
		}		
		stack.push({
			group:  this.undo_group,
			type: 'insert',
			start: start,
			data: this.textbuf.serializeTags(start, end),
			cursors: this.cursors.toArray()
		})
	}

	this.addUndoDelete = function(start, end, stack){
		if(!stack) stack = this.undo_stack
		// merge undo objects if it merges
		var last = stack[stack.length - 1]
		if(last && last.type == 'delete' && 
			last.end == start){
			last.end += end - start
			return
		}
		stack.push({
			group: this.undo_group,
			type: 'delete',
			start: start,
			end: end,
			cursors: this.cursors.toArray()
		})
	}

	this.forkRedo = function(){
		if(this.undo_stack.length){
			this.undo_stack[this.undo_stack.length - 1].redo = this.redo_stack
		}
		this.redo_stack = []
	}

	this.undoRedo = function(stack1, stack2){
		// aight. lets process em undos
		if(!stack1.length) return
		var last_group = stack1[stack1.length - 1].group
		for(var i = stack1.length - 1;i>=0;i--){
			var item = stack1[i]
			var last_cursor
			if(item.group != last_group) break
			// lets do what it says
			if(item.type == 'insert'){
				this.addUndoDelete(item.start, item.start + item.data.length, stack2)
				this.textbuf.insertText(item.start, item.data)
				last_cursor = item.cursors
			}
			else{
				this.addUndoInsert(item.start, item.end, stack2)
				this.textbuf.removeText(item.start, item.end)
				last_cursor = item.cursors
			}
		}
		stack1.splice(i+1)
		this.cursors.fromArray(last_cursor)
	}

	// alright we serialize all ze cursors and concat and send over.
	this.selectionToClipboard = function(){
		// alright. so. we need to sort the cursors.
		var str = this.cursors.serializeSelection()
		//clipboard.value = str
	}

	this.scanLeftWord = function(pos){
		while(pos > 0 && parse.isNonNewlineWhiteSpace(this.textbuf.charCodeAt(pos - 1))){
			pos --
		}
		while(pos > 0 && parse.isIdentifierChar(this.textbuf.charCodeAt(pos - 1))){
			pos --
		}
		return pos
	}

	this.scanRightWord = function(pos){
		while(pos < this.textbuf.char_count && parse.isNonNewlineWhiteSpace(this.textbuf.charCodeAt(pos))){
			pos ++
		}
		while(pos < this.textbuf.char_count && parse.isIdentifierChar(this.textbuf.charCodeAt(pos))){
			pos ++
		}
		return pos
	}

	this.scanLeftLine = function(pos){
		if(this.textbuf.charCodeAt(pos) == 9){
			while(pos < this.textbuf.char_count && this.textbuf.charCodeAt(pos) == 9){
				pos ++
			}
		}
		else{ // if we are a newline 
			if(this.textbuf.charCodeAt(pos - 1) == 9){
				while(pos > 0 && this.textbuf.charCodeAt(pos - 1) != 10){
					pos --
				}
			}
			else{
				while(pos > 0 && this.textbuf.charCodeAt(pos - 1) > 10){
					pos --
				}
			}
		}
		return pos
	}

	this.scanRightLine = function(pos){
		while(pos < this.textbuf.char_count && this.textbuf.charCodeAt(pos) != 10){
			pos ++
		}
		return pos
	}
	
	// called after child constructors
	this.initEditImpl = function(){
		this.cursors = new CursorSet(this, this.textbuf)
		this.undo_stack = []
		this.redo_stack = []
		this.undo_group = 0	
		this.cursors.update()
		//this.cursors.moveDown(0, 0)
	}

	this.clipPaste = function(v){
		this.undo_group++
		this.cursors.insert(v)
		//change = Change.clipboard
	}

	this.keypress = function(v){
		this.undo_group++
		this.cursors.insert(v.value)
		//change = Change.keyPress		
	}

	this.keydown = function(v){
		this.keyboard.clipboard.focus()
		var name = 'key' + v.name[0].toUpperCase() + v.name.slice(1)
		this.undo_group++

		if(this.keyboard.leftmeta || this.keyboard.rightmeta) name += 'Cmd'
		if(this.keyboard.ctrl) name += 'Ctrl'
		if(this.keyboard.alt) name += 'Alt'

		if(this[name]) this[name](v)
		else if(this.keyboard.alt){
			name = v.name
			if(this.keyboard.shift) name = '_' + name
			var trans = utfmap[name]
			if(typeof trans == 'number'){ // we have to do a 2 step unicode
				console.log('2 step unicode not implemented')
			}
			else if(trans !== undefined){
				this.cursors.insert(trans)
				change = Change.keyPress
			}
		}
	}

	this.mouseLeftDown = function(v){
		//console.log(mouse.clicker)

		if(this.keyboard.alt){
			var startx = this.mouse.x
			var starty = this.mouse.y
			var clone
			if(this.keyboard.leftmeta || this.keyboard.rightmeta) clone = this.cursors.list
			else clone = []

			this.cursors.rectSelect(startx, starty, startx, starty, clone)
			this.cursors.fusing = false
			
			this.mouseCapture(function(){
					this.cursors.rectSelect(startx, starty, this.mouse.x, this.mouse.y, clone)
				}.bind(this),
				function(){
					this.cursors.fusing = true
					this.cursors.update()
					// we are done. serialize to clipboard
					this.selectionToClipboard()	
				}.bind(this)
			)
			
		}
		else if(this.keyboard.leftmeta || this.keyboard.rightmeta){
			var cursor = this.cursors.add()
			// in that case what we need to 
			this.cursors.fusing = false
			this.cursor.moveTo(this.mouse.x, this.mouse.y)
			// lets make it select the word 

			if(this.mouse.clicker == 2) cursor.selectWord()
			else if(this.mouse.clicker == 3){
				cursor.selectLine()
				this.mouse.resetClicker()
			}

			this.cursors.update()
			this.mouseCapture(function(){
				// move
				cursor.moveTo(this.mouse.x, this.mouse.y, true)
				this.cursors.update()
			}.bind(this), function(){
				this.cursors.fusing = true
				this.cursors.update()
				this.selectionToClipboard()
			}.bind(this))
		}
		// normal selection
		else{
			// in that case what we need to 
			this.cursors.fusing = true
			this.cursors.moveTo(this.mouse.x, this.mouse.y)

			if(this.mouse.clicker == 2) cursors.selectWord()
			else if(this.mouse.clicker == 3){
				cursors.selectLine()
				this.mouse.resetClicker()
			}

			this.mouseCapture(function(){
				cursors.moveTo(this.mouse.x, this.mouse.y, true)
			}.bind(this), function(){
				selectionToClipboard()
			}.bind(this))
		}
	}

	// alright so. undo. 
	this.keyZCtrl =
	this.keyZCmd = function(){
		this.undoRedo(undo_stack, redo_stack)
		//change = Change.undoRedo
		//doCursor()
	}

	this.keyYCtrl =
	this.keyYCmd = function(){
		this.undoRedo(redo_stack, undo_stack)
		//change = Change.undoRedo
		//doCursor()
	}

	this.keyACtrl = 
	this.keyACmd = function(){
		// select all
		this.cursors.selectAll()
		this.selectionToClipboard()
	}

	this.keyXCtrl = 
	this.keyXCmd = function(){
		// cut the crap
		this.cursors.delete()
	}

	this.keyBackspace = function(){
		this.cursors.backspace()
		//change = Change.delete
		this.doCursor()
	}

	this.doCursor = function(){
		//cursor = 1
		this.selectionToClipboard()
	}
	
	// move selection up one line
	this.keyDownarrowAlt = function(){

	}

	// move selection down one line
	this.keyUparrowAlt = function(){

	}

	this.keyDelete = function(){
		this.cursors.delete()
		this.doCursor()
	}

	this.keyDeleteCtrl =
	this.keyDeleteAlt = function(){
		this.cursors.deleteWord()
		this.doCursor()
	}

	this.keyBackspaceCtrl = 
	this.keyBackspaceAlt = function(){
		this.cursors.backspaceWord()
		this.doCursor()
	}

	this.keyBackspaceCmd = function(){
		this.cursors.backspaceLine()
		this.doCursor()
	}

	this.keyDeleteCmd = function(){
		this.cursors.deleteLine()
		this.doCursor()
	}

	this.keyLeftArrowCtrl = 
	this.keyLeftarrowAlt = function(){
		this.cursors.moveLeftWord(this.keyboard.shift)
		this.doCursor()
	}
	
	this.keyRightArrowCtrl = 
	this.keyRightarrowAlt = function(){
		this.cursors.moveRightWord(this.keyboard.shift)
		this.doCursor()
	}

	this.keyLeftarrowCmd = function(){
		this.cursors.moveLeftLine(this.keyboard.shift)
		this.doCursor()
	}

	this.keyRightarrowCmd = function(){
		this.cursors.moveRightLine(this.keyboard.shift)
		this.doCursor()
	}
 
	this.keyHome = 
	this.keyUparrowCmd = function(){
		this.cursors.moveTop(this.keyboard.shift)
		this.doCursor()
	}

	this.keyEnd = 
	this.keyDownarrowCmd = function(){
		this.cursors.moveBottom(this.keyboard.shift)
		this.doCursor()
	}

	this.keyLeftarrow = function(){ 
		this.cursors.moveLeft(this.keyboard.shift)
		this.doCursor()
	}

	this.keyRightarrow = function(){
		this.cursors.moveRight(this.keyboard.shift)
		this.doCursor()
	}

	this.keyUparrow = function(){
		this.cursors.moveUp(this.keyboard.shift)
		this.doCursor()
	}

	this.keyDownarrow = function(){
		this.cursors.moveDown(this.keyboard.shift)
		this.doCursor()
	}
})