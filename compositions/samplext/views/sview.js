define.class(function(view, text){

    this.height = 50;

    this.render = function() {
        return view({height: 50, width:150, bgcolor:"red"}, text({width:150, height:20, text:'did it work?', y:5, x:5}))
    };

});



