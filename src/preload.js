// This state preloads global game assets, displays the loading bar and finally starts the title screen

var preload = function () {
    console.log("%cPreloading assets...", "color:white; background:red");
}

preload.prototype = {
    preload: function preload () {
        /*
        var loadingBar = this.add.sprite(160,240,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);*/
    },
    create: function create() {
        this.game.state.start("title");
    }
}
