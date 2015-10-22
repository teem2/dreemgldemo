define.class(function(composition, server, screens, screen, view, text, samplext$sserver, samplext$views$sview) {

    this.render = function() {
        return [
            screens(
                screen(
                    view(
                        { x:100, y:100, height: 500, width:300, bgcolor:"pink" },
                        samplext$views$sview({x:10, y:10})
                    )
                )
            ),
            samplext$sserver()
        ]
    }

});
