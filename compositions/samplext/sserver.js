define.class(function(server){
    this.render = function(){ return [
        server({init:function(){
            console.log('Wow, this worked.')
        }})
    ]}

});