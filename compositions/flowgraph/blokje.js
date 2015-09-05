"use strict";
define.class(function(view, connectorbutton, icon, text, edit, button){

	this.position = "absolute" ;
	this.attribute("dataset", {type: Object});
	this.attribute("selected", {type: boolean, value: false});
	this.attribute("appstate", {type:Object})

	this.appstate = function()
	{
		var newsel = this.appstate.data.selected === ( "composition/screens" + this.data.name);
		if (newsel !== this._selected)
		this.selected = newsel;
	}
	
	this.attribute("data", {type: Object});
	
	this.mouseleftdown = function(){
		 	this.dataset.silent(function(){
				this.data.x = this.x;
				this.data.y = this.y;					
			}.bind(this))
		
		
		this.start = {mousex:this.mouse.x, mousey:this.mouse.y,startx: this.x, starty: this.y}
		this.mousemove = function(){
			var dx = this.mouse.x - this.start.mousex;
			var dy = this.mouse.y - this.start.mousey;
			
			var nx = this.start.startx + dx;
			var ny = this.start.starty + dy;

			nx = Math.floor(nx/10) * 10;
			ny = Math.floor(ny/10) * 10;
			
			this.data.x = nx;
			this.data.y = ny;					
			
			this.pos = vec2(nx,ny);
			
			//this.parent.updateConnections(this.name, this.pos);
		
		}
		this.mouseleftup = function(){
			this.mousemove = function(){};
			//this.parent.updateConnections(this.name, this.pos);
			this.mouseleftup = function(){};
		}
	}

	this.bgcolor = vec4("#ffff60");
	this.bg.basecolor = vec4();

	

	this.bg.bgcolorfn = function(a,b)
	{
		return mix(basecolor, vec4("white"), a.y/2);
	}

	this.cornerradius = 0;
	this.flexdirection = "column" 
	this.padding = 1;
	this.borderwidth = 0;
	this.bordercolor = vec4("darkgray");

	this.atDraw = function(){
		if (this._selected){
			this.bg.borderwidth = 0;
			this.bg.bordercolor = vec4("blue");
		}else{
			this.bg.borderwidth =0;
			this.bg.bordercolor = vec4("darkgray");				
		}
	}

	
	this.width = 300;


	this.reloadIFrame = function() {
		if (this.myiframe && this.myiframe.dom && this.myiframe.dom.src) {
			this.myiframe.dom.src = this.myiframe.dom.src
		}
	};


	this.render = function(){

		this.inputsdict = [];
		this.outputsdict = [];
		this.inputs = [];
		this.outputs = [];

		if (this.data.linkables){
			for (var i in this.data.linkables){
				var L = this.data.linkables[i];
				var self = this;

				if (L.input == true)	{
					var newinput = connectorbutton(
						{
							circlecolor : self.bg.basecolor,
							basecolor: this.data.basecolor,
							title: L.title,
							icon: L.icon,
							text:L.name,
							input: true,
							target: this.parent,
							targetscreen: this.data.name,
							attrib:L.name,
							blok: this,
						    value: L.value
						})
					this.inputsdict[L.name] = newinput;
					this.inputs.push(newinput);
				}
				else{
					var newoutput = connectorbutton(
						{
							circlecolor : self.bgcolor,
							margin:vec4(0,20,0,20),
							basecolor: this.data.basecolor,
							title: L.title,
							icon: L.icon,
							text:L.name,
							input: false,
							target: this.parent,
							targetscreen: this.data.name,
							attrib:L.name,
							blok: this,
							value: L.value
						})
					this.outputsdict[L.name] = newoutput;
					this.outputs.push(newoutput);
				}
			}
		}

		var root = this;

		var basecolor  = this.data.basecolor? this.data.basecolor:vec4("#00c030");

		var blockout = [
			view({
					cornerradius:0,
					bgcolor: basecolor,
					"bg.bgcolorfn": function(a,b){return mix(bgcolor, bgcolor, a.y*0.3);},
					padding: 4,
					flex:1
				},
				icon(
					{icon:this.data.icon, fontsize: 20, margin:vec4(10,0,10,0)}),
				text({margin:vec4(4,4,24,4),text: this.data.title,  fontsize:16, bgcolor: "transparent", fgcolor: "#404040"})
			),
			view({
					borderwidth:0,
					position:"relative", bgcolor: basecolor,justifycontent:"space-between", aligncontent: "flex-end", alignitems: "flex-end",  flexdirection:"row", "bg.bgcolorfn": function(a,b){ return vec4('#d0d0d0') + bgcolor * 0.16	;},margin:0, padding:0}
				,view({position:"relative", flexdirection:"column",margin:0, padding:vec4(0,10,0,10),flex: 1  , bgcolor:"transparent"},this.inputs)
				,view({position:"relative", flexdirection:"column",alignitems: "flex-end",margin:0, padding:vec4(0,10,0,10), flex: 1, bgcolor:"transparent"}, this.outputs)
			)];
		
		if (this.data.type != 'datasource') {
			blockout.push(view({
					borderwidth:0,
					bgcolor: basecolor,clipping:true,flexdirection:'row'}
				,button({
					hovercolor1:'transparent',
					hovercolor2:'transparent',
					pressedcolor1:'transparent',
					pressedcolor2:'transparent',
					buttoncolor1:'transparent',
					buttoncolor2:'transparent',
					margin : vec4(0,0,0,0),
					borderwidth :0,
					text:'Edit',click:function(){
						root.myiframe.setDomFullscreen(true)
						console.log(root.myiframe.dom.src)
						root.myiframe.dom.src += '&edit=1'
					}})
				,button({
					hovercolor1:'transparent',
					hovercolor2:'transparent',
					pressedcolor1:'transparent',
					pressedcolor2:'transparent',
					buttoncolor1:'transparent',
					buttoncolor2:'transparent',
					margin : vec4(0,0,0,0),
					borderwidth :0,
					text:'Rld',click:function(){
						root.reloadIFrame();
					}})
				,view({
						bgcolor : 'transparent',
						flexdirection: "column", flexwrap: "none"
					},
					button({
						fontsize:12,clipping:true, width:180,
						hovercolor1:'transparent',
						hovercolor2:'transparent',
						pressedcolor1:'transparent',
						pressedcolor2:'transparent',
						buttoncolor1:'transparent',
						buttoncolor2:'transparent',
						margin : vec4(0,0,0,0),
						borderwidth :0,
						myurl:this.data.iframeurl,
						text:define.fileName(this.data.iframeurl),
						click:function(){
							window.open(this.myurl)
						}
					}),
					view({
						width:180,
						height : 1,
						margin : vec4(10,-7,0,0),
						bgcolor : '#000',
						borderwidth :0
					})
				)
			));
			root.myiframe = view({
				borderwidth:0,
				position:'relative',domid:this.blokid, domscale:5,init:function(){}, flex:1, h:200 ,mode:'DOM', src:this.data.iframeurl})
			blockout.push(root.myiframe);
		}

		return blockout;



	}
});


