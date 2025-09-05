'use strict';

class SnakeGame {
    constructor() {
        this.validateElements();
        
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.gameOverElement = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('final-score');
        this.restartBtn = document.getElementById('restart-btn');

        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        this.baseSpeed = 150;
        this.minSpeed = 60;
        this.lastDirectionChange = 0;
        this.directionChangeDelay = 100;

        this.resetGame();
        this.setupEventListeners();
        this.loadHighScore();
        this.gameLoop();
    }

    validateElements() {
        const requiredElements = ['game-canvas', 'score', 'high-score', 'game-over', 'final-score', 'restart-btn'];
        for (const id of requiredElements) {
            if (!document.getElementById(id)) {
                throw new Error(`Required element with id '${id}' not found`);
            }
        }
    }

    resetGame() {
        this.snake = [
            { x: 10, y: 10 }
        ];
        this.dx = 0;
        this.dy = 0;
        this.food = this.generateFood();
        this.score = 0;
        this.gameRunning = false;
        this.gameStarted = false;
        this.gameOver = false;
        
        this.updateScore();
        this.hideGameOver();
    }

    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        
        return newFood;
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!this.gameStarted) {
                    this.startGame();
                } else {
                    this.togglePause();
                }
            } else if (e.code === 'KeyR') {
                this.resetGame();
            } else if (this.gameRunning && !this.gameOver) {
                this.changeDirection(e);
            }
        });

        this.restartBtn.addEventListener('click', () => {
            this.resetGame();
        });

        this.setupTouchControls();
    }

    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            
            if (Date.now() - touchStartTime < 200) {
                if (!this.gameStarted) {
                    this.startGame();
                    return;
                }
            }

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipeDistance = 30;
            
            if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
                return;
            }
            
            const now = Date.now();
            if (now - this.lastDirectionChange < this.directionChangeDelay) {
                return;
            }

            let newDx = this.dx;
            let newDy = this.dy;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                newDx = deltaX > 0 ? 1 : -1;
                newDy = 0;
            } else {
                newDx = 0;
                newDy = deltaY > 0 ? 1 : -1;
            }

            // 防止180度转向
            const isOppositeDirection = 
                (this.dx === 1 && newDx === -1) ||
                (this.dx === -1 && newDx === 1) ||
                (this.dy === 1 && newDy === -1) ||
                (this.dy === -1 && newDy === 1);

            if (!isOppositeDirection && (newDx !== this.dx || newDy !== this.dy)) {
                this.dx = newDx;
                this.dy = newDy;
                this.lastDirectionChange = now;
            }
        });
    }

    startGame() {
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.gameRunning = true;
            this.dx = 0;
            this.dy = -1;
            this.lastDirectionChange = Date.now();
        }
    }

    togglePause() {
        if (this.gameStarted && !this.gameOver) {
            this.gameRunning = !this.gameRunning;
        }
    }

    changeDirection(e) {
        const now = Date.now();
        if (now - this.lastDirectionChange < this.directionChangeDelay) {
            return;
        }

        let newDx = this.dx;
        let newDy = this.dy;

        switch (e.code) {
            case 'ArrowLeft':
                newDx = -1;
                newDy = 0;
                break;
            case 'ArrowUp':
                newDx = 0;
                newDy = -1;
                break;
            case 'ArrowRight':
                newDx = 1;
                newDy = 0;
                break;
            case 'ArrowDown':
                newDx = 0;
                newDy = 1;
                break;
            default:
                return;
        }

        // 防止180度转向
        const isOppositeDirection = 
            (this.dx === 1 && newDx === -1) ||
            (this.dx === -1 && newDx === 1) ||
            (this.dy === 1 && newDy === -1) ||
            (this.dy === -1 && newDy === 1);

        if (!isOppositeDirection && (newDx !== this.dx || newDy !== this.dy)) {
            this.dx = newDx;
            this.dy = newDy;
            this.lastDirectionChange = now;
        }
    }

    update() {
        if (!this.gameRunning || this.gameOver) return;

        // 防止在update期间改变方向
        const currentDx = this.dx;
        const currentDy = this.dy;
        
        // 如果方向无效（如0,0），不移动
        if (currentDx === 0 && currentDy === 0) {
            return;
        }

        const head = { x: this.snake[0].x + currentDx, y: this.snake[0].y + currentDy };

        // 检查碰撞
        if (head.x < 0 || head.x >= this.tileCount ||
            head.y < 0 || head.y >= this.tileCount ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }

        this.snake.unshift(head);

        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            this.updateScore();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // 清空画布
        this.ctx.fillStyle = '#f9f9f9';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }

        // 绘制蛇
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // 蛇头
                this.ctx.fillStyle = '#2E7D32';
                this.ctx.fillRect(segment.x * this.gridSize + 2, segment.y * this.gridSize + 2, 
                                this.gridSize - 4, this.gridSize - 4);
                
                // 蛇头眼睛
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(segment.x * this.gridSize + 5, segment.y * this.gridSize + 5, 3, 3);
                this.ctx.fillRect(segment.x * this.gridSize + 12, segment.y * this.gridSize + 5, 3, 3);
            } else {
                // 蛇身
                this.ctx.fillStyle = '#4CAF50';
                this.ctx.fillRect(segment.x * this.gridSize + 2, segment.y * this.gridSize + 2, 
                                this.gridSize - 4, this.gridSize - 4);
            }
        });

        // 绘制食物
        this.ctx.fillStyle = '#FF5722';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            2 * Math.PI
        );
        this.ctx.fill();

        // 添加食物光泽效果
        this.ctx.fillStyle = '#FF8A65';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2 - 3,
            this.food.y * this.gridSize + this.gridSize / 2 - 3,
            this.gridSize / 4,
            0,
            2 * Math.PI
        );
        this.ctx.fill();

        // 显示开始提示
        if (!this.gameStarted) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('按空格键开始游戏', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '14px Arial';
            this.ctx.fillText('使用方向键控制蛇的移动', this.canvas.width / 2, this.canvas.height / 2 + 30);
        }

        // 显示暂停提示
        if (this.gameStarted && !this.gameRunning && !this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏暂停', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '16px Arial';
            this.ctx.fillText('按空格键继续', this.canvas.width / 2, this.canvas.height / 2 + 30);
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    endGame() {
        this.gameOver = true;
        this.gameRunning = false;
        this.finalScoreElement.textContent = this.score;
        this.showGameOver();
        this.saveHighScore();
    }

    showGameOver() {
        this.gameOverElement.style.display = 'flex';
    }

    hideGameOver() {
        this.gameOverElement.style.display = 'none';
    }

    saveHighScore() {
        const currentHighScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
        if (this.score > currentHighScore) {
            localStorage.setItem('snakeHighScore', this.score.toString());
            this.highScoreElement.textContent = this.score;
        }
    }

    loadHighScore() {
        const highScore = localStorage.getItem('snakeHighScore') || '0';
        this.highScoreElement.textContent = highScore;
    }

    getGameSpeed() {
        const speedIncrease = Math.floor(this.score / 50) * 10;
        return Math.max(this.baseSpeed - speedIncrease, this.minSpeed);
    }

    gameLoop() {
        this.update();
        this.draw();
        const currentSpeed = this.getGameSpeed();
        setTimeout(() => {
            this.gameLoop();
        }, currentSpeed);
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});