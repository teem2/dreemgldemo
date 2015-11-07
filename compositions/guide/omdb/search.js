define.class(function(server, require) {

    // Base API URL
    this.apiurl = "http://www.omdbapi.com/?s=";
    this.request = require('request');

    // The string to search for in the OMDB database
    this.attribute("keyword", {type:String});

    // List of movie objects returned from server
    this.attribute("found", {type:function A(a){return a;}});

    this.onkeyword = function (keyword) {
        if (keyword) {
            this.request(this.apiurl + keyword.replace(/[^a-z0-9_-]/ig, '+'), (function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var res = JSON.parse(body);
                    this.found = res["Search"];
                }
            }).bind(this))
        }
    };

});