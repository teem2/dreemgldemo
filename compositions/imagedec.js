//Pure JS based composition
define.class(function(composition, require, screens, screen, view, text){
	var imgload = require('$parsers/imageparser')

function Pluck( ctx ) {
  this.sr = ctx.sampleRate;
  this.ctx = ctx;
  this.pro = ctx.createScriptProcessor( 512, 0, 1 );
  this.pro.connect( ctx.destination );
}

Pluck.prototype.play = function( freq ) {
  var N = Math.round( this.sr / freq ),
    impulse = this.sr / 1000,
    y = new Float32Array( N ),
    n = 0;
    this.T = 0;
  this.pro.onaudioprocess = function( e ) {
    var out = e.outputBuffer.getChannelData( 0 ), i = 0, xn;
    for ( ; i < out.length; ++i ) {
      xn = ( --impulse >= 0 ) ? Math.random() - 0.5 : 0;
      out[ i ] = y[ n ] = xn + ( y[ n ] + y[ ( n + 1 ) % N ] ) / 2;
      if ( ++n >= N || !this.playing ) {
        n = 0;
      }

      this.T++;
      if (this.T > this.sr) this.pro.disconnect(this.ctx);
    }
  }.bind( this );
  this.playing = true;
};

Pluck.prototype.pause = function() {
  this.playing = false;
};

// usage:



	this.render = function(){ return [
		screens(
			screen(
				view({
					//bgimage: 
					init: function(){

						this.ctx = new AudioContext();


						this.playingNote = [];
						for (var i =0 ;i<128;i++){
							this.playingNote.push(false);
						}

						var img = imgload(require('$textures/IMG_0011.JPG'))
						// we have image buffer access

						this.bgimage = img
						// lets create a canvas
						//console.log(this.bgimage)
						this.bg_shader.contrast = function(inp){
							return pow(inp.r, .01)*100.;
						}
						this.bg_shader.samp1 = function(pos, dist){
							var cc = vec2(0.509,0.53)

							var ang = pos.x * 6.283 + time *0.2
							var d2 = pos.y * 0.5

							var w = 0.005;

							//var sam = vec2(pos.x * aspect + center, pos.y)
							var col1 = contrast(texture.sample(cc + vec2(sin(ang)*d2*(.741), cos(ang)*d2)))
							var col2 = contrast(texture.sample(cc + vec2(sin(ang+w*1.0)*d2*(.741), cos(ang+w*1.0)*d2)))
							var col3 = contrast(texture.sample(cc + vec2(sin(ang+w*2.0)*d2*(.741), cos(ang+w*2.0)*d2)))
							var col4 = contrast(texture.sample(cc + vec2(sin(ang+w*3.0)*d2*(.741), cos(ang+w*3.0)*d2)))

							var avg = (col1 + col2 + col3 + col4)*0.25;
							var hp = (col1 - avg)*1.0;

		//				   col += 0.8 + 0.2*sin(pos.y*1000.);
							hp = step(0.8, hp);
							return  hp;
					
						}
						this.bg_shader.bgcolorfn = function(pos, dist){

							var yb = 0.1;
							var octscale = 0.2;
							var octs = 0.
							var stripe = 0.0;
							if (pos.y > yb)
								{
									stripe = step(0.5, sin((pos.y-yb) * 127 * PI *2.	))*0.4
								}
							stripe += sin(pos.x * 6.283 * (3.*70.) )*0.1+0.1;


							var cc = vec2(0.509,0.53)
							var ang = pos.x * 6.283 + time *0.2
							var d2 = pos.y * 0.5

							var a = samp1(pos, dist);
							var off = 0.001;
							var b = samp1(pos+vec2(off, off), dist);
							var c = samp1(pos+vec2(0.00, off), dist);
							var d = samp1(pos+vec2(off, 0.0), dist);
							var col = texture.sample(cc + vec2(sin(ang)*d2*(.741), cos(ang)*d2)) 
							return col + vec4(1.0)*step(0.5,a + b + c + d) //+ stripe;				
						}
					},
					postDraw: function(device){
						if(this.myscreen) return
				//			console.log(device.frame.size[0])
					//	return
					//	this.myscreen = device.readPixels(0,0,device.frame.size[0]/2,device.frame.size[1]/2)
						this.line = device.readPixels(10,0,1,device.frame.size[1]/2)
						var height = device.frame.size[1]

						var newnotes = [];
						for(var i = 0;i<128;i++) newnotes.push(false);
						for(var i = 0; i < height*4;i+=4){
							var r = this.line[i]
							if(r > 225)
							{
								var idx = Math.floor((i * 64) / (height* 4));
								newnotes[idx] = true;
								//console.log(idx);
							}
							
						}

						for(var i = 0;i<128;i++){
							if (newnotes[i] != this.playingNote[i]){
								if (newnotes[i]) {
									var p = new Pluck(this.ctx)
									p.play(Math.pow((i-50)/12,2.0)*440);
							//		console.log("playing " + i)
								}else{
							//		console.log("stopping " + i)
					
								}
								this.playingNote[i] = newnotes[i]
							}
						} 
					},
					bgcolor:'transparent',w:2000,h:1000
				})
			)
		)
	]}
})