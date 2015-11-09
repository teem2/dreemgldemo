define.class(function(composition, screens, guide$search, guide$screens$search) {

    this.render = function() { return [
        guide$search({
            name:'omdb',
            keyword:'${this.rpc.screens.main.term}'
        }),
        screens(
            guide$screens$search({
                name:'main',
                term:'Aliens',
                movies:'${this.rpc.omdb.found}'
            })
        )
    ] }
});
