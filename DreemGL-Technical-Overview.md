# Dreem Internals

## UI Rendering in Dreem
Dreem uses two concepts when updating the UI: Rendering and drawing:

Rendering is the act of generating the scene graph (corresponds to updating the DOM tree in HTML5). The render() 
function spits out the scene graph, and therefore  controls the subview structure of a UI widget or view. The
render functions on all UI widgets are just a way to expand that scene graph.

Drawing is the process of walking the scene graph and calling draw() on each node. Drawing is tied to the
[requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) calls.

The source code dealing with rendering is mostly contained the following three files:
[renderer.js](./core/renderer/renderer.js)
[screen_gl.js](./core/renderer/screen_gl.js)
[sprite_gl.js](./core/renderer/sprite_gl.js)

[renderer.js](./core/renderer/renderer.js) contains the logic for recursively calling the render function, and diffing
the scene graph.

[screen_gl.js](./core/renderer/screen_gl.js) represents a screen instance in the composition. The class extends
[screen_base](./core/renderer/screen_base.js), which contains the API definition for a screen shared across runtimes.

[sprite_gl.js](./core/renderer/sprite_gl.js) is the base object for any visual element on the screen. sprite_gl takes 
care of doing the actual drawing of the visual elements. For a different runtime - e.g. DALi - a sprite_dali.js 
version of this file needs to be created. [sprite_gl.js](./core/renderer/sprite_gl.js) extends the 
[sprite_base](./core/renderer/sprite_base.js) class, which contains the definition of the sprite's API with all
attributes shared across runtimes.

### Rendering subviews of a component


### Modifying view child structure during rendering
In some situations you need to be able to modify the subview structure of the component to implement some 
component-specific behavior. A good example is the [splitcontainer](./classes/splitcontainer.js) class. If there is more
than one child vide, the splitcontainer adds a splitter view between each of the child views. This is done inside the
render() function of the splitcontainer:

	this.render = function(){		
		if (this.instance_children.length > 1){
			this.newchildren = []
			this.newchildren.push(view({clipping: true, flex: this.instance_children[0].flex},this.instance_children[0]));
			for (var i = 1;i<this.instance_children.length;i++){
				this.newchildren.push(this.splitter({vertical: this.vertical,firstnode: (i-1)*2, splitsize: this.splitsize, splittercolor: this.splittercolor, hovercolor: this.hovercolor, activecolor: this.activecolor}));
				this.newchildren.push(view({clipping: true, flex: this.instance_children[i].flex },this.instance_children[i]));				
			}
			this.children = [];
			return this.newchildren;
		}else{
		 ...
		}
	}

The subviews of a view or component are stored on the *instance_children* array of a view. In the above code example a
 splitter is added between each of the instance_children of the splitcontainer class.

### Shaders in Dreem
Every background shader for a every visible item is a nested class which lives on a sprite. A good example is the
[sprite_gl.js background color](https://github.com/teem2/dreemgl/blob/dev/core/renderer/sprite_gl.js#L34-L80). Nested
 classes contain a reference to the container class through the classroot reference.
