# Adding Devices and Web Services

Extending Dreem with new services, devices and other components is much like creating any Dreem composition, but with
some explicit conventions to follow.

## Adding a Simple Web Service

This example will demonstrate how to build a server-side component that has to communicate with an external web service.  

This component will provide a search object and simple UI for the [OMDB](http://omdbapi.com/) database, but a more generic 
(and synchronous) example of a bare-bones server-side web-fetching component can be found in the 
[Dreem GL branch](https://github.com/teem2/teem-sample_component/tree/dreemgl) of the sample component repository.

### Setting up the Component

Dreem GL components provide additonal fucntionality to compositions and are implemented as sibling directories 
(by default) that live along side the compositions, and can even be entire composition hierarchies themselves.  
The simplest way to add a component to a Dreem GL server is with a symlink into the compositions directory:

    ln -s /path/to/component/directory/ ./compositions/<componentname>
    
The name you choose for `<componentname>` is important as it will be the namespace that other compositions will use to 
instantiate it's classes later.  For example, this guide is in the `./compositions/guide/` directory, so all of the 
classes provided by this directory can then be accessed using `guide$<classname>` syntax.  For example, a class in a file 
`./compositons/guide/foo.js` would be accessible via `guide$foo`.  This syntax acts as a path seperator to traverse
directories, for example `./compositons/guide/omdb/search.js` is accessible via `guide$omdb$search`.

Be sure to include a `README.md` with instructions for use and a package.json to help manage dependancies, like so:

    {
      "name": "<component name>",
      "version": "0.0.1",
      "description": "<description>",
      "dependencies": {},
      "engine": "node >= 0.10.0"
    }

If required, be sure to install any dependancies in the component directory:
 
    npm install  

### Addding Components

#### Server Side

Dreem components are collections of server objects and UI widgets that can be used by other Dreem compositions.  This
example provides a simple way to access and display movies from the [OMDB](http://omdbapi.com/) database.  Here is a simple 
object that encapsulates a single "search" within the database (see `./compositons/guide/omdb/search.js` for more detailed version):

    define.class(function(server, require) {

        this.attribute("found", {type:Array});
        this.attribute("keyword", {type:String});
        this.onkeyword = function (keyword) {
            var request = require('request');
            request("http://www.omdbapi.com/?s=" + keyword.replace(/[^a-z0-9_-]/ig, '+'), (function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    this.found = JSON.parse(body)["Search"];
                }
            }).bind(this))
        }
    });

The search object has two attributes, the `keyword` to search term used in the search and the resulting list of movie 
objects `found` by the server.  Setting the `keyword` triggers the `onkeyword` event which fetches the data from the 
search API and sets it's own found attribute upon return.

#### Screen Side

Client-side UI views are also an important part of external components, and this example provies a simple view
to consume the data coming from it's server component (see `./compositons/guide/omdb/movie.js` for complete code):

    define.class(function (view, text) {
    
        this.attribute("Title", {type:String});
        this.attribute("Year", {type:String});
        this.attribute("Poster", {type:String});    
        this.onPoster = function (poster) { this.bgimage = poster; };
    
        this.render = function() { return [ 
            text({ text:this.Title + '[' + this.Year + ']' }) 
        ]; }
    
    });

The server returns blocks of JSON which look like this: 
    
    {"Title":"Snow White and the Huntsman",
     "Year":"2012",
     "imdbID":"tt1735898",
     "Type":"movie",
     "Poster":"..."}
    
When rendered into a javascript object these blocks can be consumed directly by the `guide$omdb$movie()` object to create
new movies views which can be added directly to the heirarchy.  An example of how this can be accomplished is provided 
in the next section.

### Including Examples and Usage

In addition to a `REAMDE.md` components often provide one or more example compositions.  Typically only the `index.js`
is kept at the root for technical reasons (this may be changed soon), and all other compositions, 
supporting screens and other views kept in the `./example` or `./examples` directory.

For this guide one screen will be used to gather user input and display the list of movies (as `guide$omdb$movie` views):
              
    define.class(function(screen, view, button, editor, text, guide$omdb$movie) {
    
        this.attribute('term', {type:String});
        this.attribute('movies', {type:Array});
    
        this.renderMovies = function() {
            var mviews = [];
            for (var i=0;i<this.movies.length;i++) {
                mviews.push(guide$omdb$movie(this.movies[i]));
            }    
            return mviews;
        };
    
        this.render = function() { return [
            view(
                {flexdirection:'column'},
                editor({ name:'search', text:'Aliens'}),
                button({text:'Search', click:function() {
                    this.screen.term = this.parent.search.text;
                }}),
                view(this.renderMovies())
            )
        ] }        
    });
    
And finally, the `index.js` wires all the components together:

    define.class(function(composition, screens, guide$omdb$search, guide$example$omdb$search) {
    
        this.render = function() { return [
            guide$omdb$search({
                name:'omdb',
                keyword:'${this.rpc.screens.main.term}'
            }),
            screens(
                guide$example$omdb$search({
                    name:'main',
                    movies:'${this.rpc.omdb.found}'
                })
            )
        ] }    
    });

### Working with screen <-> server RPC

All communication between the screens and the server must go though the RPC bus, availabel via `this.rpc`.  To make
calls on the server, use `this.rpc.serverObjectName.attributeOrMethodName` for server objects 
and `this.rpc.screens.screenName.attributeOrMethodName` for screen objects.    

#### Attributes

Attributes can be get and set like so:

    this.rpc.screens.browser.someAttribute = "value"
    
    console.log("My value is", this.rpc.screens.browser.someAttribute);

#### Methods

All RPC method calls are promises, and can be called like so:

    this.rpc.server.methodCall().then(function(ret) {
        console.log("My value is:", ret.value);
    })

## Communicating with External Services and Devices

When you have a physcial device or external service that cannot be integrated directly within the Dreem system itself,
or if you otherwise need to send data into the system, you can interact directly with Dreem objects using the HTTP 
POST API methods.  An example of of an external component using the POST API can be found in the 
[Dreem GL branch](https://github.com/teem2/teem-estimotebeacon/tree/dreemgl) of the Dreem<->Estimote bridge 
repository.  In particular the [app.js](https://github.com/teem2/teem-estimotebeacon/blob/dreemgl/estimote_repeater/app.js#L83)
POSTs the beacons it finds via AJAX.

### Using POST API 

The composition server will respond to HTTP POSTs requests sending JSON data in the following format:

    { 
      "rpcid": "<see below>", 
      "type": "<attribute|method>",

      //used only if type=attribute
      "attribute": "<attribute name>",
      "value": "<attribute value, if setting>",

      //used only if type=method
      "method": "<method name>",
      "args": ["<array>", "<of>", "<arguments>"]       
    }
    

#### RPC ID

The RPC ID refers to the object that the RPC method will be called on, and is simply the string that would otherwise 
come after a call to `this.rpc` in Dreem code, except for the name of the attribute or method name itself.  For example, 
the attribute you would have set in this code `this.rpc.screens.mobile.deviceID` would have an 
RPC ID of `screens.mobile`.  Likewise, a method called with `this.rpc.localapi.register()` would have an RPC ID of `localapi`.

#### Attributes

##### Setter

The JSON structure for a setting an attribute is as follows:

    { 
      "rpcid": "<see above>", 
      "type": "attribute",

      "attribute": "<attribute name>",
      "value": "<attribute value>"
    }

An an example, to set the search term variable on the example above, you can use [curl](http://curl.haxx.se/) like so: 

    curl -X POST -d '{"rpcid":"screens.main", "type":"attribute", "attribute":"term", "value":"Snow"}' http://localhost:2000/guide
    
Which will return:
    
    {"type":"return","attribute":"term","value":"OK"}

##### Getter

Getting attributes is identical to setting, but without a `value` property:

    { 
      "rpcid": "<see above>", 
      "type": "attribute",

      "attribute": "<attribute name>"
    }

Reading the kework attribute off the omdb search object:

    curl -X POST -d '{"rpcid":"omdb", "type":"attribute", "attribute":"keyword"}' http://localhost:2000/guide
    
If you had set the search term with the previous example, it will now return:    
    
    {"type":"return","attribute":"keyword","value":"Snow"}

#### Method Calls

In additon to setting attributes, methods can be called directly on Dreem objects.  The method JSON structure looks 
like this:

    { 
      "rpcid": "<see above>", 
      "type": "method",

      "method": "<method name>",
      "args": ["<array>", "<of>", "<arguments>"]       
    }

This will directly manipulate the `onkeyword` function of the omdb search object to trigger a 

    curl -X POST -d '{"rpcid":"omdb", "type":"method", "method":"onkeyword", "args":["Red"]}' http://localhost:2000/guide
    
The screen will redraw and this the API will return:

    {"type":"return","method":"onkeyword"}
    
    