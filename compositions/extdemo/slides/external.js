define.class(function (view, codeviewer) {

    this.slidetitle = "External Service using POST API";

    this.attribute('apiCode', {type: String});

    this.render = function render() {
        return [
            view({flexdirection: 'row', flex: 1},
              codeviewer({ flex: 1, alignself: 'stretch', margin: vec4(10), code: this.apiCode, padding: vec4(4), fontsize: 14, bgcolor: "#000030", multiline: true}),
              view({flex: 1, padding: 4, margin: 10, cornerradius: 0, bgcolor: '#D1CAB0'})
            )
        ];
    }


});