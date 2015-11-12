define.class(function (view, text) {

    this.slidetitle = "External Components in DreemGL";

    this.flexdirection = 'column';

    this.render = function render() {
        return [
            text({text:'Components are just directories - No special work required!'}),
            text({text:'(define.$plugins defaults to $compositions for convenience, but can be changed for security)'}),
            text({text:'External classes can be auto loaded outside the composition using the `compositionname$classname` syntax.'}),
            text({text:'Examples are just compositions in the component directory.'}),
            text({text:'(see https://github.com/teem2/dreemgl/tree/dev/compositions/guide for more detail)'})

        ];
    }

    //components are just directories, no special work required, defaults to composition directory

    //

    //

    //define.$plugin can be changed


});