define.class(function(composition, screens, screen, guide$omdb$search, guide$example$omdb$search) {

    this.render = function() { return [
        guide$omdb$search({
            name:'omdb',
            keyword:'${this.rpc.screens.main.term}'
            // TODO this should work instead | keyword:'${this.rpc.screens.main.term}'
        }),
        screens(
            guide$example$omdb$search({
                name:'main',
                term:'Aliens',
                movies:'${this.rpc.omdb.found}'
                // TODO this should work instead | movies:'${this.rpc.omdb.found}'
            })
        )
    ] }
});
