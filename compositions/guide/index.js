define.class(function(composition, screens, screen, guide$omdb$search, guide$example$omdb$search) {

    this.render = function() { return [
        guide$omdb$search({
            name:'omdb',
            onfound: function(found) { this.rpc.screens.main.movies = found; }
            // TODO this should work instead | keyword:'${this.rpc.screens.main.term}'
        }),
        screens(
            guide$example$omdb$search({
                name:'main',
                onterm: function(term) { this.rpc.omdb.keyword = term; }
                // TODO this should work instead | movies:'${this.rpc.omdb.found}'
            })
        )
    ] }
});
