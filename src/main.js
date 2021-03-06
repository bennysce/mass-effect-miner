var main = function () {
    console.log("state started: Test2");
}

var strength = 0;
var collectText = [];
var platforms;
var player;
var cursors;

var materials = {
    types: ['copper', 'iron', 'vanadium', 'eezo'],
    eezo: {
        name: 'Element Zero',
        color: '0xadd8e6',
        colorHex: '#add8e6',
        collected: 0,
        max: 1,
        strReq: 20,
        health: 8
    },
    vanadium: {
        name: 'Vanadium',
        color: '0xc0c0c0',
        colorHex: '#c0c0c0',
        collected: 0,
        max: 10,
        strReq: 10,
        health: 2
    },
    iron: {
        name: 'Iron',
        color: '0x434b4d',
        colorHex: '#434b4d',
        collected: 0,
        max: 8,
        strReq: 2,
        health: 5
    },
    copper: {
        name: 'Copper',
        color: '0xb87333',
        colorHex: '#b87333',
        collected: 0,
        max: 2,
        strReq: 0,
        health: 3
    }
}

// Win text
var bar;
var text;

var game;

function createInput() {
    cursors = game.input.keyboard.createCursorKeys();
    var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(drill, this);
    space.onUp.add(stopDrill, this);
}

var tiles;
function createWorld() {

    //  A simple background for our game
    game.stage.backgroundColor = '#333333';
    game.add.sprite(0, 0, 'sky');

    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 32, 'ground');
    ground.scale.setTo(1, 1);
    ground.body.immovable = true;

    tiles = game.add.group();
    tiles.enableBody = true;

    var tileSize = 32;
    var scale = 2;
    var scaledTileSize = tileSize * scale;
    var rows = 20 / scale;
    var columns = 59 / scale;
    var placedGold = false;
    for (var x = 0; x < columns; x++) {
        for (var y = 0; y < rows; y++) {
            var type;
            if (!placedGold && y == rows - 1 && (Math.random() * 100 < 20 || (x == columns - 1))) {
                placedGold = true;
                type = 'eezo';
            } else if (Math.random() * 100 < 25) {
                type = 'vanadium';
            } else if (Math.random() * 100 < 50) {
                type = 'iron';
            } else {
                type = 'copper';
            }

            createTile(type, x * scaledTileSize, 420 + y * scaledTileSize, scale);
        }
    }

    for (var i = 0; i < materials.types.length; i++) {
        createTile(materials.types[i], 1880, 10 + i * 40, 1, 32);
    }
}

function createTile(type, x, y, scale) {
    var tile = tiles.create(x, y, 'tile');
    tile.scale.setTo(scale, scale);
    tile.body.immovable = true;

    tile.ffType = type;
    tile.tint = materials[tile.ffType].color;
    tile.ffMaxHealth = materials[tile.ffType].health;
    tile.ffHealth = materials[tile.ffType].health;
}

function createPlayer() {
    // The player and its settings
    player = game.add.sprite(game.world.width / 2 - 32, 0, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.setSize(player.body.halfWidth, player.body.height, player.body.halfWidth / 2);
    player.body.bounce.y = 0;
    player.body.gravity.y = 600;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('drill', [0, 3], 50, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
}

function createMaterialText(materialName, index) {
    collectText[materialName] = game.add.text(0, index * 40, materials[materialName].name + ': 0/' + materials[materialName].max,
        { fontSize: '20px', fill: materials[materialName].colorHex, boundsAlignH: "right", boundsAlignV: "middle" });
    collectText[materialName].setTextBounds(0, 20, 1870, 20);
}

var debugText;
function createUI() {
    //game.add.text(16, 16, 'FULL FRÄS!', { fontSize: '40px', fill: '#ff0' });
    //debugText = game.add.text(16, 50, 'play with arrows and space', { fontSize: '20px', fill: '#fff' });
    for (var i = 0; i < materials.types.length; i++) {
        createMaterialText(materials.types[i], i);
    }

    bar = game.add.graphics();
    bar.beginFill(0x000000, 0.2);
    bar.drawRect(0, 100, 1920, 100);
    bar.visible = false;

    var winText = "SUCCESS!\n1. Code for systems alliance military special forces\n2. Designation for EDIs ship\n3. Prefix for the new \"Ryde\"!\n";
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle", align: "center" };
    text = game.add.text(0, 0, winText, style);
    text.visible = false;
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
    text.setTextBounds(0, 200, 1920, 200);
}

var canDrill = true;
function updateCounter() {
    canDrill = true;
}

var drilling = false;
function drill() {
    drilling = true;
    player.animations.play('left');
}
function stopDrill() {
    drilling = false;
    player.animations.stop();
}

var hasJumped = true;


function hurtTile(tile) {
    tile.ffHealth -= 1;
    tile.alpha = tile.ffHealth / tile.ffMaxHealth;

    if (tile.ffHealth <= 0) {
        killTile(tile);
    }
}

function killTile(tile) {
    if (materials[tile.ffType].collected < materials[tile.ffType].max) {
        materials[tile.ffType].collected++;
        strength++;
        if (tile.ffType == 'eezo') {
            bar.visible = true;
            text.visible = true;
        }
        collectText[tile.ffType].text = materials[tile.ffType].name + ': ' + materials[tile.ffType].collected + '/' + materials[tile.ffType].max;
    }
    tile.kill();
}

function killTiles(player, tile) {

    if (!canDrill || (!hasJumped && !drilling) || tile.y < player.y + 40) {
        return;
    }

    hasJumped = false;
    canDrill = false;
    game.time.events.add(Phaser.Timer.SECOND * 0.5, updateCounter, this);

    if (strength >= materials[tile.ffType].strReq) {
        hurtTile(tile);
    }
}

main.prototype = {
    init: function (score) {
        console.log("Got data from prev state: " + score);
        game = this.game;
    },

    preload: function () {

        game.load.image('sky', 'assets/bg3.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('tile', 'assets/square.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

        //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    },
        
    create: function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        createInput();
        createWorld();
        createUI();
        createPlayer();
    },

    update: function () {
        game.physics.arcade.overlap(player, tiles, killTiles, null, this);
        game.physics.arcade.collide(player, tiles);
        game.physics.arcade.collide(player, platforms);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            //  Move to the left
            player.body.velocity.x = -150;

            player.animations.play('left');
        }
        else if (cursors.right.isDown) {
            //  Move to the right
            player.body.velocity.x = 150;

            player.animations.play('right');
        }
        else if (!drilling) {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }

        if (!player.body.touching.down) {
            hasJumped = true;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown) {
            player.body.velocity.y = -150;
        }
    },

    render: function () {
    }
}