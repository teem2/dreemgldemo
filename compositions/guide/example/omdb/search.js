define.class(function(screen, view, button, editor, text, guide$omdb$movie) {

    this.attribute('term', {type:String});
    this.attribute('movies', {type:function A(a){return a;}});

    this.renderMovies = function() {
        var mviews = [];

        if (this.movies) {
            for (var i=0;i<this.movies.length;i++) {
                var movieData = this.movies[i];
                mviews.push(guide$omdb$movie(movieData));
            }
        }

        return mviews;
    };

    this.render = function() { return [

        view(
            {flexdirection:'column'},
            // TODO this should work | editor({ name:'search', width:300, height:30, text:'Aliens'}),
            text({ name:'search', width:300, height:30, text:'Aliens'}),
            button({text:'Search', width:90, click:function() {
              this.screen.term = this.parent.search.text;
            }}),
            view(this.renderMovies())
        )

    ] }

});