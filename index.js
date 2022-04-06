const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const themeBtn = document.getElementById('theme-btn');
const bgLight = "#F1F1F1"
const bgDark = "#1D1D1D"
const fontLight = "#FFFFFF"
const fontDark = "#000000"
const chompSound = new Audio("chomp.mp3");

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y
    }
    
}

let speed = 5;

let bgColour = bgLight;
let fontColour = fontDark;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;
let xVelocity = 0;
let yVelocity = 0;
let appleX = 5;
let appleY = 5;
let score = 0;

let darkMode = false;


//game loop
function drawGame() {
    changeSnakePosition();
    let result = isGameOver();
    if (result){
        return;
    }

    clearScreen();
    checkAppleCollision();

    drawScore();
    drawSnake();
    drawApple();
    setTimeout(drawGame, 1000/speed);

}

function clearScreen() {
    ctx.fillStyle = bgColour;
    ctx.fillRect(0,0,canvas.width, canvas.height)
}

function drawSnake(){
    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)
    ctx.fillStyle = 'green';
    for (let i = 0 ; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);

    }
    snakeParts.push(new SnakePart(headX, headY)); //put an item at the end of the list near the head
    if(snakeParts.length > tailLength){
        snakeParts.shift(); // remove the furtherst item from the snakeparts if we ahve more than our tail size
    }
    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

function changeSnakePosition(){
    headX = headX + xVelocity;
    headY = headY + yVelocity;

    //walls
    if (headX < 0){ //left wa;;
        headX = tileCount;
    }
    else if (headX >= tileCount) {
        headX = 0;
    }
    else if (headY < 0){
        headY = tileCount;
    }
    else if (headY >= tileCount) {
        headY = 0;
    }
}

function checkAppleCollision () {
    if (appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++
        chompSound.play();
        speed ++;
    }
}

function drawScore() {
    ctx.fillStyle = fontColour;
    ctx.font = "10px Verdana";
    ctx.fillText("Score " + score, canvas.width - 50, 10);

}

function isGameOver() {
    let gameOver = false;
    if (yVelocity === 0 && xVelocity === 0){
        return false;
    }
    
    for (let i = 0; i < snakeParts.length; i ++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }
    if (gameOver) {
        ctx.fillStyle = fontColour;
        ctx.font ="50px Verdana";
        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
        ctx.font ="10px Verdana";
        ctx.fillText("Press Enter to restart", canvas.width / 2.5, canvas.height / 1.5);

    }

    return gameOver;
}

function restartGame(){
    gameOver = false;
    headX = 10;
    headY = 10;
    tailLength = 2;
    xVelocity = 0;
    yVelocity = 0;
    appleX = 5;
    appleY = 5;
    score = 0;
    speed = 5;
    snakeParts.length = 0;
    clearScreen();
    drawGame();
}

document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    //up arrow
    if (event.keyCode == 38) {
        if (yVelocity == 1) return;
        yVelocity = -1;
        xVelocity = 0
    }
    //down arrow
    if (event.keyCode == 40) {
        if(yVelocity == -1) return;
        
        yVelocity = 1;
        xVelocity = 0
    }
    //left arrow
    if (event.keyCode == 37) {
        if (xVelocity == 1) return;
        yVelocity = 0;
        xVelocity = -1
    }
    //right arrow
    if (event.keyCode == 39) {
        if (xVelocity == -1) return;
        yVelocity = 0;
        xVelocity = 1
    }

    if (event.keyCode == 13){
            console.log("Restart")
            restartGame();
    }
    
}


themeBtn.addEventListener('click', toggleTheme);

function toggleTheme() {
    var body = document.querySelector("body");
    var heading = document.querySelector("h1");
    if (darkMode == false) {
        body.setAttribute("class", "body-dark");
        heading.setAttribute("class", "h1-dark");
        bgColour = bgDark;
        fontColour = fontLight;
        themeBtn.innerHTML = "Light Mode";
        darkMode = true;
        
    }
    else {
        body.setAttribute("class", "");
        heading.setAttribute("class", "");
        bgColour = bgLight;
        fontColour = fontDark;
        themeBtn.innerHTML = "Dark Mode";
        darkMode = false;
    }
    clearScreen()
}

drawGame();