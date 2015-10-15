
# DreemGL WebGL Runtime Analaysis
## DreemGL WebGL runtime with empty screen
Tested with DreemGL dev branch on October 15th. Compositions used for testing is:

		define.class(function(teem, screens, screen){
		
			this.render = function(){ return [
				screens( 
					screen(
					)
				)
			]}

		})

The file was saved as simplescreen.js in folder compositions, and then the URL http://localhost:2000/simplescreen was 
requested. The following request are sent by the browser for this composition:

| No  | URL requested                                         | Type          | Runtime    | Description |
| :-- | :---------------------------------------------------- | :------------ | :--------- | :---------- |
| 1   | http://localhost:2000/simplescreen                    | HTML Page     | WebGL      | Embedding page for the WebGL Runtime application. |
| 2   | http://localhost:2000/define.js                       | JS File       | WebGL/DALi | Class definition and module export. |
| 3   | http://localhost:2000/core/base/math.js               | JS File       | WebGL/DALi | Math definitions. |
| 4   | http://localhost:2000/compositions/simplescreen.js    | JS File       | WebGL/DALi | Description. |
| 5   | ws://localhost:2000/                                  | Websocket     | WebGL/DALi | Socket connection | 
| 6   | http://localhost:2000/classes/teem.js                 | JS File       | WebGL/DALi | Teem object. |
| 7   | http://localhost:2000/classes/screens.js              | JS File       | WebGL/DALi | Screens class. |
| 8   | http://localhost:2000/classes/screen.js               | JS File       | WebGL/DALi | Screen class. |
| 9   | http://localhost:2000/core/parsers/vectorparser.js    | JS File       | WebGL/DALi | Helper library for vec2/vec4 parsing. |
| 10  | http://localhost:2000/core/dreem/teem_browser.js      | JS File       | WebGL/DALi | Teem browser. |
| 11  | http://localhost:2000/core/rpc/rpcproxy.js            | JS File       | WebGL/DALi | RPC Proxy. |
| 12  | http://localhost:2000/core/rpc/rpcmulti.js            | JS File       | WebGL/DALi | Description. |
| 13  | http://localhost:2000/classes/node.js                 | JS File       | WebGL/DALi | Description. |
| 14  | http://localhost:2000/core/rpc/rpcpromise.js          | JS File       | WebGL/DALi | Promise polyfill. |
| 15  | http://localhost:2000/core/rpc/webrtc.js              | JS File       | WebGL      | WebRTC library. |
| 16  | http://localhost:2000/core/rpc/busclient.js           | JS File       | WebGL/DALi | Description. |
| 17  | http://localhost:2000/core/renderer/mouse_web.js      | JS File       | WebGL      | Mouse handler for browser. |
| 18  | http://localhost:2000/core/renderer/keyboard_web.js   | JS File       | WebGL      | Keyboard handler for browser. |
| 19  | http://localhost:2000/core/renderer/touch_web.js      | JS File       | WebGL      | Touch handler for browser. |
| 20  | http://localhost:2000/core/renderer/renderer.js       | JS File       | WebGL/DALi | Renders the scene graph. |
| 21  | http://localhost:2000/core/dreem/teem_base.js         | JS File       | WebGL/DALi | RPC-proxifies the screens for a composition. |
| 22  | http://localhost:2000/core/parsers/onejsparser.js     | JS File       | WebGL/DALi | Parser for ONEJS superset of JavaScript. |
| 23  | http://localhost:2000/core/parsers/wiredwalker.js     | JS File       | WebGL/DALi | Assumption: Used for wiring up constraints. |
| 24  | http://localhost:2000/core/gl/gldevice.js             | JS File       | WebGL/DALi | Device class for WebGL context. |
| 25  | http://localhost:2000/core/gl/glshader.js             | JS File       | WebGL      | Shader compiler. |
| 26  | http://localhost:2000/core/gl/gltexture.js            | JS File       | WebGL/DALi | Description. |
| 27  | http://localhost:2000/core/gl/gltext.js               | JS File       | WebGL/DALi | Description. |
| 28  | http://localhost:2000/core/renderer/sprite_gl.js      | JS File       | WebGL/DALi | Description. |
| 29  | http://localhost:2000/core/renderer/text_gl.js        | JS File       | WebGL      | Text implementation. |
| 30  | http://localhost:2000/core/renderer/renderstate_gl.js | JS File       | WebGL/DALi | Description. |
| 31  | http://localhost:2000/lib/layout.js                   | JS File       | WebGL/DALi | Facebook Flexbox JS library. |
| 32  | http://localhost:2000/fonts/code_font3_1024.glf       | Font          | WebGL      | Description. |
| 33  | http://localhost:2000/core/renderer/screen_base.js    | JS File       | WebGL/DALi | Screen base class for all runtimes. |
| 34  | http://localhost:2000/core/parsers/onejsgen.js        | JS File       | WebGL/DALi | Description. |
| 35  | http://localhost:2000/core/gl/glfontparser.js         | JS File       | WebGL      | Description. |
| 36  | http://localhost:2000/core/gl/glslgen.js              | JS File       | WebGL/DALi | Description. |
| 37  | http://localhost:2000/core/parsers/astdumper.js       | JS File       | WebGL/DALi | Description. |
| 38  | http://localhost:2000/core/parsers/onejsdef.js        | JS File       | WebGL/DALi | Description. |
| 39  | http://localhost:2000/core/gl/glnoise.js              | JS File       | WebGL/DALi | Description. |
| 40  | http://localhost:2000/core/gl/glpalette.js            | JS File       | WebGL/DALi | Description. |
| 41  | http://localhost:2000/core/gl/glshape.js              | JS File       | WebGL/DALi | Description. |
| 42  | http://localhost:2000/core/gl/glmath.js               | JS File       | WebGL/DALi | Description. |
| 43  | http://localhost:2000/core/gl/gldemos.js              | JS File       | WebGL/DALi | Description. |
| 44  | http://localhost:2000/core/gl/glmaterial.js           | JS File       | WebGL/DALi | Description. |
| 45  | http://localhost:2000/core/renderer/sprite_base.js    | JS File       | WebGL/DALi | Sprite base class for all runtimes. |
| 46  | http://localhost:2000/core/animation/animtrack.js     | JS File       | WebGL/DALi | Description. |
| 47  | http://localhost:2000/core/base/nodeworker.js         | JS File       | WebGL/DALi | Description. |
| 48  | http://localhost:2000/textures/noise.png              | Image         | WebGL/DALi | Description. |
| 49  | http://localhost:2000/textures/checker.png            | Image         | WebGL/DALi | Description. |
| 50  | http://localhost:2000/textures/hex_tiles.png          | Image         | WebGL/DALi | Description. |
| 51  | ws://localhost:2000/simplescreen                      | Websocket     | WebGL/DALi | Description. |

Returns HTML embedding page:

		<html lang="en">
		 <head>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
			<meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">
			<meta name="apple-mobile-web-app-capable" content="yes">
			<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
			<meta name="format-detection" content="telephone=no">
			<title>simplescreen</title>
			<style>
				.unselectable{
				-webkit-user-select: none;
				-moz-user-select: none;
				-user-select: none;
				}
				body {background-color:darkgray;margin:0;padding:0;height:100%;overflow:hidden;}
			</style>  <script type="text/javascript">
				window.define = {
				 $rendermode:"gl",
					system_classes:{"3d":"$classes/3d","button":"$classes/button","cadgrid":"$classes/cadgrid","codeviewer":"$classes/codeviewer","dataset":"$classes/dataset","docviewer":"$classes/docviewer","edit":"$classes/edit","fileio":"$classes/fileio","foldcontainer":"$classes/foldcontainer","icon":"$classes/icon","markdown":"$classes/markdown","menubar":"$classes/menubar","menuitem":"$classes/menuitem","node":"$classes/node","ruler":"$classes/ruler","screen":"$classes/screen","screenoverlay":"$classes/screenoverlay","screens":"$classes/screens","scrollbar":"$classes/scrollbar","scrollcontainer":"$classes/scrollcontainer","server":"$classes/server","spline":"$classes/spline","splitcontainer":"$classes/splitcontainer","sprite":"$classes/sprite","subcomposition":"$classes/subcomposition","tabcontrol":"$classes/tabcontrol","teem":"$classes/teem","tests":"$classes/tests","text":"$classes/text","treeview":"$classes/treeview","unconfirmed":"$classes/unconfirmed","view":"$classes/view"},
					main:["$base/math", "undefined"],
					atMain:function(require, modules){
						define.endLoader()
				 define.global(require(modules[0]))
				 var TeemClient = require(modules[1])
						define.rootTeemClient = new TeemClient(define.rootTeemClient)
					},
				 atEnd:function(){
						 define.startLoader()
					}
				}
			</script>
			<script type="text/javascript" src="/define.js"></script>
		 </head>
		 <body class="unselectable">
		 </body>
		</html>

# Questions
## Questions Rik:
### Questions regarding the functionality contained within files?
  * teem_browser.js 
  * What is the relationship between rpcproxy.js  and rpcmulti.js?
  * Is busclient.js the a client for the TEEM bus?
  * wiredwalker.js: Is it used to set up the constraints?
  * What is onejsparser.js used for right now?

#### Which classed need to be added for DALi?
  * screens_dali.js
  * screen_dali.js
  * sprite_dali.js
  * DALi mouse handler
  * DALi keyboard handler
  * DALi touch handler
  * DALi animation class
