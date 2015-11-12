define.class(function (view) {

    this.attribute('celltype', {type: Object});
    this.attribute('data', {type: Array});

    this.render = function render() {

        var mviews = [];
        if (this.data) {
            for (var i = 0; i < this.data.length && i < 10; i++) {
                var data = this.data[i];
                data.width = 130;
                data.height = 160;
                mviews.push(this.celltype(data));
            }
        }
        return mviews;
    }


});