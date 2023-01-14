const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "black";

// player colors
const paddle1Color = "white";
const paddle2Color = "white";

const player1ScoreColor = "blue";
const player2ScoreColor = "red";

const lineColor = "white";
const paddleBorder = "black";
const ballColor = "white"
const ballBorderColor = "black";
const ballRadius = 12.5;
const paddleSpeed = 60;


let intervalID;
let ballSpeed = 1.125;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;

let player1Score = 0;
let player2Score = 0;

let paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0
};

let paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100
};

let linePosition = {
    width: 7,
    height: gameHeight,
    x: 250,
    y: 0
}

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    createBall();
    nextTick();

};
function nextTick(){
    intervalID = setTimeout(() => {
        clearBoard();
        drawPaddles();
        moveBall();
        drawBall(ballX, ballY);
        checkCollision();
        nextTick();
    
    },10)
};
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0,0, gameWidth, gameHeight);
    
};
function drawPaddles(){
    ctx.strokeStyle = paddleBorder;

    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

    ctx.fillStyle = lineColor;
    ctx.fillRect(linePosition.x, linePosition.y, linePosition.width, linePosition.height);
    ctx.strokeRect(linePosition.x, linePosition.y, linePosition.width, linePosition.height);

    
};
function createBall(){
    ballSpeed = 1;
    if(Math.round(Math.random()) == 1){
        ballXDirection = 1;
    }
    else {
        ballXDirection = -1;
    }
    if(Math.round(Math.random()) == 1){
        ballYDirection = Math.random()*1;
    }
    else {
        ballYDirection = Math.random()*-1;
    }

    ballX = gameWidth / 2;
    ballY = gameHeight / 2;

    drawBall(ballX, ballY);
};
function moveBall(){
    ballX += (ballSpeed * ballXDirection);
    ballY += (ballSpeed * ballYDirection);
};
function drawBall(ballX, ballY){
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

};
function checkCollision(){
    if(ballY <= 0 + ballRadius) {
        ballYDirection *= -1;
    }
    if(ballY >= gameHeight - ballRadius) {
        ballYDirection *= -1;
    }

    if(ballX <= 0) {
        player2Score += 1;
        updateScore();
        createBall();
        return;
    }
    if(ballX >= gameWidth) {
        player1Score += 1;
        updateScore();
        createBall();
        return;
    }

    if(ballX <= (paddle1.x + paddle1.width + ballRadius)){
        if(ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
            ballX = (paddle1.x + paddle1.width + ballRadius); //if ball gets stuck
            ballXDirection *= -1;
            ballSpeed += 1;
        }
    }
    if(ballX >= (paddle2.x - ballRadius)){
        if(ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
            ballX = (paddle2.x - ballRadius); //if ball gets stuck
            ballXDirection *= -1;
            ballSpeed += 1;
        }
    }
};
function changeDirection(event){
    const keyPressed = event.keyCode;
    //console.log(keyPressed);
    const paddle1Up = 87;
    const paddle1Down = 83;
    const paddle2Up = 38;
    const paddle2Down = 40;

    switch(keyPressed) {
        case(paddle1Up):
            if(paddle1.y > 0) {
                paddle1.y -= paddleSpeed;
            }
            break;

        case(paddle1Down):
            if(paddle1.y < gameHeight - paddle1.height){
                paddle1.y += paddleSpeed;
            }
            break;
        case(paddle2Up):
            if(paddle2.y > 0) {
                paddle2.y -= paddleSpeed;
            }
            break;
        case(paddle2Down):
            if(paddle2.y < gameHeight - paddle2.height) {
                paddle2.y += paddleSpeed;
            }
            break;
    
    }
};
function updateScore(){
    scoreText.textContent = `${player1Score} : ${player2Score}`;

    if(player1Score > player2Score) {
        scoreText.style.color = player1ScoreColor;
    }
    else if(player1Score < player2Score) {
        scoreText.style.color = player2ScoreColor;
    }
    else {
        scoreText.style.color = "black";
    }

    if(player1Score == 5 || player2Score == 5) {
        clearInterval(intervalID);
        if(player1Score == 5) {
            scoreText.textContent = "Player 1 wins!";
            scoreText.style.color = player1ScoreColor;
            //wait 1000ms
            delay(1000).then(() => resetGame());
        }
        else {
            scoreText.textContent = "Player 2 wins!";
            scoreText.style.color = player2ScoreColor;
            delay(1000).then(() => resetGame());

        }
    }
};


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetGame(){
    player1Score = 0;
    player2Score = 0;

    paddle1 = {
        width: 25,
        height: 100,
        x: 0,
        y: 0
    };
    
    paddle2 = {
        width: 25,
        height: 100,
        x: gameWidth - 25,
        y: gameHeight - 100
    };

    ballX = 0;
    ballY = 0;
    ballSpeed = 1;
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    clearInterval(intervalID);
    gameStart();
    
};