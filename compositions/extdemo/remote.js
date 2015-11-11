define.class(function(screen, button, text, view) {

        this.attribute('pager', {type: int, value: 0});

        this.render = function render() {
            return [
                view({flex: 1, bgcolor: 'black'},
                    button({
                        text: 'Left', flex: 1, size: vec2(200, 200), bgcolor: vec4('yellow'), click: function () {
                            this.screen.pager = -1
                        }
                    }),
                    button({
                        text: 'Right', flex: 1, size: vec2(200, 200), bgcolor: vec4('red'), click: function () {
                            this.screen.pager = 1
                        }
                    })
                )
            ]
        }
    }
);