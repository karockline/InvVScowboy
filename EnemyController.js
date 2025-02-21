import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";
export default class EnemyController {

enemyMap = [
    [1, 1, 1, 1, 1, 1],
    [3, 2, 3, 2, 3, 2],
    [2, 4, 2, 4, 2, 4],
];

enemyRows = [];

currentDirection = MovingDirection.right;
xVelocity = 0;
yVelocity = 0;
defaultxVelocity = 1;
defaultyVelocity = 1;
moveDownTimerDefault = 30;
moveDownTimer = this.moveDownTimerDefault;
fireBulletTimerDefault = 100;
fireBulletTimer = this.fireBulletTimerDefault;

    constructor(canvas, enemyBulletController, playerbulletController){
        this.canvas = canvas;
        this.enemyBulletController = enemyBulletController;
        this.playerbulletController = playerbulletController;
        
        this.enemyDeathSound = new Audio("resources/sounds/laser-shot.wav");
        this.enemyDeathSound.volume = 1;

        this.createEnemies();
    }

    draw(ctx) {
        this.decrementMoveDownTimer();
        this.updateVelocityAndDirection();
        this.collisionDetection();
        this.drawEnemies(ctx);
        this.resetMoveDownTimer();
        this.fireBullet();
    }

    collisionDetection(){
       this.enemyRows.forEach(enemyRow=>{
          enemyRow.forEach((enemy,enemyIndex)=>{
            if(this.playerbulletController.collideWith(enemy)){
                this.enemyDeathSound.currentTime = 0;
                this.enemyDeathSound.play();
                enemyRow.splice(enemyIndex, 1);
            }
        });
       });

       this.enemyRows = this.enemyRows.filter((enemyRow)=> enemyRow.length > 0);
    }

    fireBullet(){
       this.fireBulletTimer--;
       if(this.fireBulletTimer <= 0){
        this.fireBulletTimer = this.fireBulletTimerDefault;
        const allEnemies = this.enemyRows.flat();
        const enemyIndex = Math.floor(Math.random() * allEnemies.length);
        const enemy = allEnemies[enemyIndex];
        this.enemyBulletController.shoot(enemy.x + enemy.width /2 ,enemy.y,-3);
       }
    }

    resetMoveDownTimer (){
        if(this.moveDownTimer <= 0){
            this.moveDownTimer = this.moveDownTimerDefault;
        }
    }
    decrementMoveDownTimer (){
        if(this.currentDirection === MovingDirection.downLeft || 
           this.currentDirection === MovingDirection.downRight){
            this.moveDownTimer--; 
           }
    }

    updateVelocityAndDirection(){
        for (const enemyRow of this.enemyRows){
            if(this.currentDirection == MovingDirection.right){
                this.xVelocity = this.defaultxVelocity;
                this.yVelocity = 0;
                const rightMostEnemy = enemyRow[enemyRow.length - 1];
                if(rightMostEnemy.x +rightMostEnemy.width >= this.canvas.width){
                    this.currentDirection = MovingDirection.downLeft;
                    break;
                }
            }
            else if (this.currentDirection === MovingDirection.downLeft){
   
                if (this.moveDown(MovingDirection.left)){
                    break;
                }
            } else if(this.currentDirection === MovingDirection.left){
                this.xVelocity = -this.defaultxVelocity;
                this.yVelocity = 0;
                const leftMostEnemy = enemyRow[0];
                if(leftMostEnemy.x <= 0){
                    this.currentDirection = MovingDirection.downRight;
                    break;
                }
            } else if(this.currentDirection === MovingDirection.downRight){
                if (this.moveDown(MovingDirection.right)){
                    break;
                } 
            }
        }
    }
    
    moveDown(newDirection){
        this.xVelocity = 0;
        this.yVelocity = this.defaultyVelocity;
        if(this.moveDownTimer <= 0){
            this.currentDirection = newDirection;
            return true;
        } 
        return false;
    }

    drawEnemies(ctx){
        this.enemyRows.flat().forEach((enemy)=>{
            enemy.move(this.xVelocity, this.yVelocity);
            enemy.draw(ctx);
        })
    }

    createEnemies () {
        this.enemyMap.forEach((row, rowIndex) => {
            this.enemyRows[rowIndex] = [];
            row.forEach((enemyNumber, enemyIndex) => {
                if(enemyNumber > 0) {
                    this.enemyRows[rowIndex].push(
                        new Enemy(enemyIndex * 35, rowIndex * 25, enemyNumber)
                    );
                }
            });
        });
    } 

    collideWith(sprite){
        return this.enemyRows.flat().some(enemy=>enemy.collideWith(sprite));
    }

}