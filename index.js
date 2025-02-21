import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import bulletController from "./BulletController.js";



const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 300;

const background = new Image();
background.src = "./resources/images/Background_space.png";

const playerbulletController = new bulletController(canvas,10,"red",true);
const enemyBulletController = new bulletController(canvas,4,"white",false);
const enemyController = new EnemyController(canvas, enemyBulletController, playerbulletController) ;
const player = new Player(canvas, 3, playerbulletController);

let isGameOver = false;
let didWin = false;

function game() {
    checkGameOver ();
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    displayGameOver ();
    if(!isGameOver)
    {enemyController.draw(ctx);
    player.draw(ctx);
    playerbulletController.draw(ctx);
    enemyBulletController.draw(ctx);}

    
}  

function displayGameOver(){
    if(isGameOver){
        let text = didWin ? "You Win" : "Game Over";
        let textOffset = didWin ? 3.5 : 5;

        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
    }
}

function checkGameOver(){
    if(isGameOver){
        return;
    }
    if(enemyBulletController.collideWith(player)){
        isGameOver = true;
    }
    if(enemyController.collideWith(player)){
        isGameOver = true;
    }
    if(enemyController.enemyRows.length === 0){
        didWin = true;
        isGameOver = true;
    }
}

setInterval (game, 1000/60);