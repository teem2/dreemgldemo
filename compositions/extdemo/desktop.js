define.class(function(screen, require, button, text, view, codeviewer, slideviewer, cells, guide$movie) {

    this.attribute('pager', {type: int, value: 0});
    this.onpager = function(val) { this.slides.page += val; };

    this.attribute('movies', {type: Array});

    this.attribute('searchCode', {type: String});
    this.attribute('apiCode', {type: String});

    this.render = function render() {

        return [
            slideviewer({name: 'slides', slideheight: 800, position: 'absolute', x: 0, bgcolor: 'black'},

                view({flex:1, bgcolor:'transparent', slidetitle:'External Components in DreemGL'}),

                view({flex: 1, slidetitle: 'Internal'},
                    view({flexdirection: 'row', flex: 1},
                        codeviewer({flex: 1, alignself: 'stretch', margin: vec4(10), code: this.searchCode, padding: vec4(4), fontsize: 14, bgcolor: "#000030", multiline: true}),
                        cells({flex: 1, padding: 4, margin: 10, cornerradius: 0, bgcolor:"#B3B3D7", clipping:true, data:this.movies, celltype:guide$movie})
                    )
                ),

                view({flex: 1, slidetitle: 'External'},
                    view({flexdirection: 'row', flex: 1},
                        codeviewer({ flex: 1, alignself: 'stretch', margin: vec4(10), code: this.apiCode, padding: vec4(4), fontsize: 14, bgcolor: "#000030", multiline: true}),
                        view({flex: 1, padding: 4, margin: 10, cornerradius: 0, bgcolor: '#D1CAB0'})
                    )
                )
            )
        ]
    }
});