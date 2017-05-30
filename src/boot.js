// This state is always the first state. It sets up basic behaviours of the game.

var boot = function () {
    console.log("%cBooting game...", "color:white; background:red");
}

boot.prototype = {
    preload: function preload () {

        // Load loading bar here
        //this.game.load.image("loading","assets/loading.png"); 
    },
    create: function create() {

        // Config screen behaviour here
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;

        //game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    /*  game.scale.setResizeCallback(function() {
        game.scale.setMaximum();
    });*/
    
        // Start preloading assets via preload state
        this.game.state.start("preload");
    }
}
