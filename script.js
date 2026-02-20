const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.7;

let lanes = [
canvas.width / 6,
canvas.width / 2,
canvas.width * 5/6
];

let currentLane = 1;

let player = {
x: lanes[currentLane],
y: canvas.height - 120,
width: 40,
height: 80
};

let cars = [];
let roadLines = [];
let speed = 6;
let score = 0;
let highScore = localStorage.getItem("carHighScore") || 0;
document.getElementById("highScore").innerText = highScore;

let gameOver = false;

/* Spawn enemy cars */
function spawnCar(){
let lane = Math.floor(Math.random()*3);
cars.push({
x: lanes[lane],
y: -100,
width:40,
height:80
});
}

/* Draw player car */
function drawPlayer(){
ctx.fillStyle="cyan";
ctx.fillRect(player.x-20,player.y,player.width,player.height);
}

/* Draw enemy cars */
function drawCars(){
ctx.fillStyle="red";
cars.forEach(car=>{
ctx.fillRect(car.x-20,car.y,car.width,car.height);
car.y += speed;
});
}

/* Road animation */
function drawRoad(){
ctx.strokeStyle="white";
ctx.lineWidth=4;
for(let i=0;i<canvas.height;i+=40){
ctx.beginPath();
ctx.moveTo(canvas.width/3,i+((score*2)%40));
ctx.lineTo(canvas.width/3,i+20+((score*2)%40));
ctx.stroke();

ctx.beginPath();
ctx.moveTo(canvas.width*2/3,i+((score*2)%40));
ctx.lineTo(canvas.width*2/3,i+20+((score*2)%40));
ctx.stroke();
}
}

/* Collision */
function detectCollision(){
cars.forEach(car=>{
if(
player.x < car.x+car.width &&
player.x+player.width > car.x &&
player.y < car.y+car.height &&
player.y+player.height > car.y
){
endGame();
}
});
}

function endGame(){
gameOver=true;
document.getElementById("gameOverScreen").classList.remove("hidden");
if(score>highScore){
localStorage.setItem("carHighScore",score);
}
}

function restartGame(){
cars=[];
score=0;
speed=6;
gameOver=false;
document.getElementById("gameOverScreen").classList.add("hidden");
loop();
}

function update(){
ctx.clearRect(0,0,canvas.width,canvas.height);
drawRoad();
drawPlayer();
drawCars();
detectCollision();

score++;
document.getElementById("score").innerText=score;

if(score%300===0) speed+=0.5;

cars=cars.filter(car=>car.y<canvas.height);
}

function loop(){
if(!gameOver){
update();
requestAnimationFrame(loop);
}
}

setInterval(spawnCar,1500);

/* Swipe Controls */
let startX=0;
let startY=0;

canvas.addEventListener("touchstart",e=>{
startX=e.touches[0].clientX;
startY=e.touches[0].clientY;
});

canvas.addEventListener("touchend",e=>{
let endX=e.changedTouches[0].clientX;
let diffX=endX-startX;

if(diffX>50 && currentLane<2){
currentLane++;
player.x=lanes[currentLane];
}
if(diffX<-50 && currentLane>0){
currentLane--;
player.x=lanes[currentLane];
}
});

loop();
