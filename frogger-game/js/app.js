var GEMS_X_LOC = Array(25,125,225,325,425,525,625);
var GEM_GREEN_Y_LOC = 190;
var GEM_ORANGE_Y_LOC = 270;
var GEM_BLUE_Y_LOC = 110;
var OFFSCREEN_LOC = -100;
var PLAYER_X_LOC = 300;
var PLAYER_Y_LOC = 380;

/**
* @description Represents an enemy
*/
var Enemy = function() {
    // Possible locations for enemy
    this.locations = Array(60,140,225);

    this.x = OFFSCREEN_LOC;

    // Get random default y location for enemy
    this.y = this.getDefaultYLoc();

    this.height = 75;
    this.width = 75;

    // Get random speed for enemy
    this.speed = this.getSpeed();

    // The image/sprite for enemies
    this.sprite = 'images/enemy-bug.png';
};

/**
* @description Updates the enemy's position
* @param {number} dt - a time delta between ticks
*/
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // Reset enemy's location when enemy goes off the screen
    if (this.x >= 700){
        this.reset();
    }

    // Check if enemy collides with the player
    this.checkCollision();
};

/**
* @description Gets random location for enemy
* @returns {number} Enemy's location
*/
Enemy.prototype.getDefaultYLoc = function() {
    var randomYLoc = this.locations[Math.floor(Math.random()*this.locations.length)];
    return randomYLoc;
};

/**
* @description Gets random speed for enemy
* @returns {number} Enemy's speed
*/
Enemy.prototype.getSpeed = function() {
    var speed = Math.floor(Math.random() * (300 - 80)) + 80;
    return speed;
};

/**
* @description Draws the enemy on the screen
*/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Resets the enemy's location and speed
*/
Enemy.prototype.reset = function() {
    this.x = OFFSCREEN_LOC;
    this.y = this.getDefaultYLoc();
    this.speed = this.getSpeed();
};

/**
* @description Checks if the enemy collides with the player
*/
Enemy.prototype.checkCollision = function() {

    if (this.x < player.x + player.width &&
        this.x + this.width > player.x &&
        this.y < player.y + player.height &&
        this.height + this.y > player.y) {
        // Collision detected!
        // Reset the player
        player.reset();
        // Reset the gems
        resetGemLocations();
        // Reduce number of lives
        player.reduceLives();
        // Update lives on the screen
        player.displayLives();
    }
};

/**
* @description Represents a player
*/
var Player = function() {
    // Variables
    this.x = PLAYER_X_LOC;
    this.y = PLAYER_Y_LOC;
    this.Xstep = 100;
    this.Ystep = 80;
    this.height = 75;
    this.width = 65;
    this.lives = 3;

    // The image/sprite for the player
    this.sprite = 'images/char-boy.png';
};

/**
* @description Updates the player's position
* @param {number} dt - a time delta between ticks
*/
Player.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

/**
* @description Updates the players's position based on key pressed
*              Checks if player reached any gem
* @param {string} input - key pressed
*/
Player.prototype.handleInput = function(input) {

    // Move player based on the keyboard's input
    switch(input) {
        case 'up':
            if (this.y > 0) {
                this.y -= this.Ystep;
            }
            break;
        case 'down':
            if (this.y < 380) {
                this.y += this.Ystep;
            }
            break;
        case 'left':
            if (this.x > 0) {
                this.x -= this.Xstep;
            }
            break;
        case 'right':
            if (this.x < 600) {
                this.x += this.Xstep;
            }
            break;
    }

    // Reset player and gems when player reaches the water
    if (this.y === -20){
        this.reset();
        resetGemLocations();
        //Increase score
        score.increase("water");
        //Every time player reaches a water, we add new enemy
        addNewEnemy()
        // Increase game level
        var level = parseInt($( ".level" ).text());
        $('.level').html(level + 1);

    } else {
        //check if player reaches a gem
        this.checkGem();
    }
};

/**
* @description Resets the player's location to default
*/
Player.prototype.reset = function() {
    this.x = PLAYER_X_LOC;
    this.y = PLAYER_Y_LOC;
};

/**
* @description Updates number of lives on the screen
*/
Player.prototype.displayLives = function() {
    $('.lives').html(this.lives);
};

/**
* @description Reduces player's lives by 1
*/
Player.prototype.reduceLives = function() {
    this.lives -= 1;
};

/**
* @description Draws the player on the screen
*/
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Check if the player reaches a gem
*/
Player.prototype.checkGem = function() {
    var gem = null;
    // Iterate through gems on the screen
    for (var i =0; i< gems.length; i++){
        gem = gems[i];
        if ((gem.x - 25 === this.x || gem.x + 25 === this.x)
            && (gem.y + 50 === this.y || gem.y - 50 === this.y)) {
            // Remove the gem
            gem.x = OFFSCREEN_LOC;
            gem.y = OFFSCREEN_LOC;
            // Increase score by gem's value
            score.increase(gem.color);
        }
    }
};

/**
* @description Represents a gem
* @param {string} url - The url for gem's image
* @param {string} color - The color of the gem
* @param {string} yLoc - The Y loc of the gem
*/
var Gem = function(url, color, yLoc) {
    // Variables
    this.x = this.getXLoc();
    this.y = yLoc;
    this.height = 118;
    this.width = 70;
    this.color = color;
    this.sprite = url;
};

/**
* @description Gets random X location for gem
* @returns {number} Gem's X location
*/
Gem.prototype.getXLoc = function() {
    var randomXLoc = GEMS_X_LOC[Math.floor(Math.random()*GEMS_X_LOC.length)];
    return randomXLoc;
};

/**
* @description Draws the gem on the screen
*/
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Resets the gem's X location
*/
Gem.prototype.reset = function(color) {
    this.x = this.getXLoc();

    switch(color) {
        case 'blue':
            this.y = GEM_BLUE_Y_LOC;
            break;
        case 'orange':
            this.y = GEM_ORANGE_Y_LOC;
            break;
        case 'green':
            this.y = GEM_GREEN_Y_LOC;
            break;
    }
};

/**
* @description Resets all gems' locations
*/
function resetGemLocations() {
    var gem = null;
    for (var i =0; i< gems.length; i++){
        gem = gems[i];
        gem.reset(gem.color);
    }
}

/**
* @description Adds new enemy
*/
function addNewEnemy() {
    var enemy = new Enemy();
    allEnemies.push(enemy);
}

/**
* @description Represents a score
*/
var Score = function() {
    this.score = 0;
};

/**
* @description Updates score on the screen
*/
Score.prototype.display = function() {
    $('.points').html(this.score);
};

/**
* @description Increase score based on gem's value, or if the player reaches the water
* @param {string} gemColor - The color of the gem
*/
Score.prototype.increase = function(gemColor) {
    switch(gemColor) {
        case 'green':
            this.score += 30;
            break;
        case 'blue':
            this.score += 50;
            break;
        case 'orange':
            this.score += 10;
            break;
        case 'water':
            this.score += 100;
            break;
    }
    if (score !== 0){
        this.display();
    }
};

/**
* @description Resets score to 0 and updates it on the screen
*/
Score.prototype.reset = function() {
    this.score = 0;
    this.display();
};

// Instantiate objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Place gem objects in an array called gems
// Place the score object in a variable called score
var allEnemies = [];
for (var i =0; i < 3; i++){
    var enemy = new Enemy();
    allEnemies.push(enemy);
}
var player = new Player();

var gems = [];
var gem = new Gem('images/Gem-Blue.png', 'blue', GEM_BLUE_Y_LOC);
gems.push(gem);
var gem2 = new Gem('images/Gem-Green.png', 'green', GEM_GREEN_Y_LOC);
gems.push(gem2);
var gem3 = new Gem('images/Gem-Orange.png', 'orange', GEM_ORANGE_Y_LOC);
gems.push(gem3);

var score = new Score();

/**
* @description Listens for key presses and sends the keys to Player.handleInput() method.
*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
