let title = function() {
    console.log("state started: Title");
}

var debugText;

var logo;
var code = "";
var codeText;

var keys = [];
var keyFns = [];

var buttons = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function start(game){
    game.state.start("main");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

title.prototype = {

    preload: function preload () {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('logo', 'assets/logo.png');
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.maxWidth = 1920;
        this.scale.maxHeight = 1080;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.updateLayout();
    },

    create: function create() {
        this.stage.backgroundColor = '#4d4d4d';
        this.add.sprite(0, 0, 'bg');
        logo = this.add.sprite(960, 540, 'logo');
        logo.anchor.x = 0.5;
        logo.anchor.y = 0.5;

        var x = this.world.width / 2;
        var y = this.world.height - 250;

        var enter = this.add.text(0, 0, 'ENTER CODE',
        { fontSize: '20px', fill: '#fff', boundsAlignH: "center" });
        enter.setTextBounds(0, y, 1920, y);

        codeText = this.add.text(0, 40, 'WTF',
        { fontSize: '20px', fill: '#0ff', boundsAlignH: "center" });
        codeText.setTextBounds(0, y, 1920, y);

        buttons.forEach(function(button){
            keys[button] = this.input.keyboard.addKey(Phaser.Keyboard[button]);
        }, this);

        for(var i = 0; i < 5; i++){
            code += buttons[getRandomInt(0, buttons.length-1)];
        }

        codeText.text = code;
    },

    update: function update() {

        for(var i = 0; i < buttons.length; i++){
            if(keys[buttons[i]].isDown && keys[buttons[i]].repeats === 0){
                code += buttons[i];
                if(code.length > 5){
                    code = code.substring(1);
                }

                if(code === 'NOMAD'){
                    start(this.game);
                }

                codeText.text = code;
            }
        };
    },

    render: function render() {
    }
}
