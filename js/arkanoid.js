

function Paddle(x, y, width, height) { //платформа
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

var BallDirs = {
	NONE: 0,
	LEFT: 1,
	RIGHT: 2,
	UP: 4,
	DOWN: 8
};

function Ball(x, y, radius, dir, speed) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.dir = BallDirs.NONE;
	this.speed = speed;
}

var BricksTypes = { //количество попаданий в различные типы кирпичей, необходимое для уничтожения
	DEFAULT: 1,
	ICE: 1,
	WOOD: 2,
	STONE: 3,
	IRON: 4,
	STEEL: 5
};

function Brick(x, y, width, height, type) { //кирпичик
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.lifes = type;
}

function Bricks(hor_num, vert_num, brick_width, brick_height) { //расположение кирпичиков
	this.bricks = new Array();
	for (var i = 0; i < vert_num; i++) {
		this.bricks[i] = new Array();
		for (var j = 0; j < hor_num; j++) {
			this.bricks[i][j] = new Brick(j * brick_width, i * brick_height, brick_width, brick_height, BricksTypes.DEFAULT);
		}
	}
}

function ArkanoidGame(canvas, context) {

	var PADDLE_WIDTH = 80;
	var PADDLE_HEIGHT = 10;
	var PADDLE_SPEED = 1;
	var BALL_RADIUS = 5;
	var BALL_DEFAULT_SPEED = 3;
	var BALL_MAX_SPEED = 6;
	var BRICK_WIDTH = 80;
	var BRICK_HEIGHT = 35;
	var BRICK_SCORE = 1;

	this.level = 0;
	this.lifes = 3;
	this.score = 0;
	this.paddle = new Paddle(canvas.width / 2 - PADDLE_WIDTH / 2, canvas.height - 20, PADDLE_WIDTH, PADDLE_HEIGHT);
	this.ball = new Ball(canvas.width / 2, canvas.height / 2, BALL_RADIUS, BallDirs.NONE, BALL_DEFAULT_SPEED);
	this.gameOver = false;
	this.gameWin = false;
	this.gamePaused = false;
	this.bricks = new Bricks(8, 3, BRICK_WIDTH, BRICK_HEIGHT);

	this.init = function () {
		this.level = 0;
		this.lifes = 3;
		this.score = 0;
		this.gameOver = false;
		this.gameWin = false;
		this.gamePaused = false;
		this.ball.dir = BallDirs.NONE;
		this.initLevel(this.level);
	}

	this.initLevel = function (level) { //инициализация уровней
		switch (level) {
			case 0:
				this.bricks = new Bricks(10, 3, BRICK_WIDTH, BRICK_HEIGHT);
				for (var i = 0; i < this.bricks.bricks.length; i++) {
					for (var j = 0; j < this.bricks.bricks[i].length; j++) {
						this.bricks.bricks[i][j].lifes = BricksTypes.DEFAULT;
					}
				}
				break;

			case 1:
				this.bricks = new Bricks(10, 3, BRICK_WIDTH, BRICK_HEIGHT);
				for (var i = 0; i < this.bricks.bricks.length; i++) {
					for (var j = 0; j < this.bricks.bricks[i].length; j++) {
						this.bricks.bricks[i][j].lifes = BricksTypes.DEFAULT + i;
					}
				}
				break;

			case 2:
				this.bricks = new Bricks(10, 6, BRICK_WIDTH, BRICK_HEIGHT);
				for (var i = 0; i < this.bricks.bricks.length; i++) {
					for (var j = 0; j < this.bricks.bricks[i].length; j++) {
						this.bricks.bricks[i][j].lifes = BricksTypes.DEFAULT + i;
					}
				}
				break;

			case 3:
				this.bricks = new Bricks(10, 7, BRICK_WIDTH, BRICK_HEIGHT);
				for (var i = 0; i < this.bricks.bricks.length; i++) {
					for (var j = 0; j < this.bricks.bricks[i].length; j++) {
						this.bricks.bricks[i][j].lifes = BricksTypes.DEFAULT + i;
					}
				}
				break;

			default:
				break;
		}
	}

	this.drawBall = function () { //Рисование шарика
		context.beginPath();
		context.arc(this.ball.x, this.ball.y, this.ball.radius, 0, 2 * Math.PI, false);
		context.fillStyle = 'white';
		context.fill();
	}

	this.drawBricks = function () { //Рисование кирпичей
		for (var i = 0; i < this.bricks.bricks.length; i++) {
			for (var j = 0; j < this.bricks.bricks[i].length; j++) {
				if (this.bricks.bricks[i][j].lifes > 0) {
					switch (this.bricks.bricks[i][j].lifes) {
						case BricksTypes.ICE: context.fillStyle = '#ffffff'; break;
						case BricksTypes.WOOD: context.fillStyle = '#f59b19'; break;
						case BricksTypes.STONE: context.fillStyle = '#373737'; break;
						case BricksTypes.IRON: context.fillStyle = '#191955'; break;
						case BricksTypes.STEEL: context.fillStyle = '#0fe1ff'; break;
						case BricksTypes.DEFAULT: context.fillStyle = '#ffffff'; break;
						default: context.fillStyle = '#ff0000';
					}
					context.fillRect(this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width - 2, this.bricks.bricks[i][j].height - 2);
				}
			}
		}
	}

	this.draw = function () {
		context.fillStyle = '#000a00';
		context.fillRect(0, 0, canvas.width, canvas.height);

		this.drawBall();

		context.fillStyle = '#f55319';
		context.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);

		this.drawBricks();

		if (this.gamePaused && !this.gameWin && !this.gameOver) {
			context.fillStyle = '#ffff00';
			context.font = 'bold 20px Arial';
			context.fillText('PAUSE!', canvas.width / 2 - 30, canvas.height / 2);
		}

		if (this.gameOver) {
			context.fillStyle = '#ff0000';
			context.font = 'bold 20px Arial';
			context.fillText('GAME OVER:(', canvas.width / 2 - 40, canvas.height / 2);
		}

		if (this.gameWin) {
			context.fillStyle = '#ffff00';
			context.font = 'bold 20px Arial';
			context.fillText('You Win', canvas.width / 2 - 40, canvas.height / 2);
		}

		context.fillStyle = '#ffffdc';
		context.font = 'bold 15px Arial';
		context.fillText('Score: ' + this.score, 5, 300);

		context.fillStyle = '#ffffdc';
		context.font = 'bold 15px Arial';
		context.fillText('Lifes: ' + this.lifes, 5, 325);
	}

	this.update = function () {
		if (this.gamePaused || this.gameWin || this.gameOver) return;

		// обновление позиции шарика
		if (this.ball.dir & BallDirs.RIGHT) this.ball.x += this.ball.speed;
		else if (this.ball.dir & BallDirs.LEFT) this.ball.x -= this.ball.speed;
		if (this.ball.dir & BallDirs.UP) this.ball.y -= this.ball.speed;
		else if (this.ball.dir & BallDirs.DOWN) this.ball.y += this.ball.speed;

		// отскок мяча от нижней площадки
		if ((this.ball.x + this.ball.radius > this.paddle.x && this.ball.x - this.ball.radius < this.paddle.x + this.paddle.width) &&
			(this.ball.y + this.ball.radius > this.paddle.y)) {
			if (this.ball.speed < BALL_MAX_SPEED) this.ball.speed += 0.5;
			if (this.ball.dir & BallDirs.DOWN) {
				this.ball.dir = this.ball.dir - BallDirs.DOWN + BallDirs.UP;
			} else if (this.ball.dir & BallDirs.UP) {
				this.ball.dir = this.ball.dir - BallDirs.UP + BallDirs.DOWN;
			}
		}

		// обновление мяча
		if (this.ball.x - this.ball.radius < 0) {
			this.ball.x = this.ball.radius;
			this.ball.dir = this.ball.dir - BallDirs.LEFT + BallDirs.RIGHT;
		}
		if (this.ball.x + this.ball.radius > canvas.width) {
			this.ball.x = canvas.width - this.ball.radius;
			this.ball.dir = this.ball.dir - BallDirs.RIGHT + BallDirs.LEFT;
		}
		if (this.ball.y - this.ball.radius < 0) {
			this.ball.y = this.ball.radius;
			this.ball.dir = this.ball.dir - BallDirs.UP + BallDirs.DOWN;
		}

		if (this.ball.y + this.ball.radius > canvas.height) {
			// потеря жизни
			this.lifes--;
			this.ball.speed = BALL_DEFAULT_SPEED;
			if (this.lifes == 0) {
				this.gameOver = true;
			} else {
				this.ball.x = canvas.width / 2;
				this.ball.y = canvas.height / 2;
				this.ball.dir = BallDirs.NONE;
			}
		}

		if (this.ball.dir == BallDirs.NONE) {
			this.ball.x = this.paddle.x + this.paddle.width / 2;
			this.ball.y = this.paddle.y - this.ball.radius * 2;
		}

		// отскоки
		for (var i = 0; i < this.bricks.bricks.length; i++) {
			for (var j = 0; j < this.bricks.bricks[i].length; j++) {
				if (this.bricks.bricks[i][j].lifes > 0) {
					if (this.ball.dir == BallDirs.LEFT + BallDirs.UP) {
						if (this.isPointInRect(this.ball.x - this.ball.speed, this.ball.y - 0, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.x = this.bricks.bricks[i][j].x + this.bricks.bricks[i][j].width + this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.LEFT + BallDirs.RIGHT;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
						if (this.isPointInRect(this.ball.x - 0, this.ball.y - this.ball.speed, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.y = this.bricks.bricks[i][j].y + this.bricks.bricks[i][j].height + this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.UP + BallDirs.DOWN;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
					} else if (this.ball.dir == BallDirs.LEFT + BallDirs.DOWN) {
						if (this.isPointInRect(this.ball.x - this.ball.speed, this.ball.y + 0, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.x = this.bricks.bricks[i][j].x + this.bricks.bricks[i][j].width + this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.LEFT + BallDirs.RIGHT;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
						if (this.isPointInRect(this.ball.x - 0, this.ball.y + this.ball.speed, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.y = this.bricks.bricks[i][j].y - this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.DOWN + BallDirs.UP;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
					} else if (this.ball.dir == BallDirs.RIGHT + BallDirs.UP) {
						if (this.isPointInRect(this.ball.x + this.ball.speed, this.ball.y - 0, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.x = this.bricks.bricks[i][j].x - this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.RIGHT + BallDirs.LEFT;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
						if (this.isPointInRect(this.ball.x + 0, this.ball.y - this.ball.speed, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.y = this.bricks.bricks[i][j].y + this.bricks.bricks[i][j].height + this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.UP + BallDirs.DOWN;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
					} else if (this.ball.dir == BallDirs.RIGHT + BallDirs.DOWN) {
						if (this.isPointInRect(this.ball.x + this.ball.speed, this.ball.y + 0, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.x = this.bricks.bricks[i][j].x - this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.RIGHT + BallDirs.LEFT;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
						if (this.isPointInRect(this.ball.x + 0, this.ball.y + this.ball.speed, this.bricks.bricks[i][j].x, this.bricks.bricks[i][j].y, this.bricks.bricks[i][j].width, this.bricks.bricks[i][j].height)) {
							this.ball.y = this.bricks.bricks[i][j].y - this.ball.speed;
							this.ball.dir = this.ball.dir - BallDirs.DOWN + BallDirs.UP;
							this.bricks.bricks[i][j].lifes--;
							this.score += BRICK_SCORE;
							return;
						}
					}
				}
			}
		}

		full_level_life = 0;
		for (var i = 0; i < this.bricks.bricks.length; i++) {
			for (var j = 0; j < this.bricks.bricks[i].length; j++) {
				full_level_life += this.bricks.bricks[i][j].lifes
			}
		}

		if (full_level_life == 0) {
			if (this.level < 3) {
				this.ball.dir = BallDirs.NONE;
				this.level++;
				this.initLevel(this.level);
			} else this.gameWin = true;
		}
	}


	this.isPointInRect = function (x, y, rect_x, rect_y, rect_width, rect_height) {
		if ((x > rect_x && x < rect_x + rect_width) &&
			(y > rect_y && y < rect_y + rect_height))
			return true;
		return false;
	}

	this.isBallIntersectBrick = function (i, j) {
		if ((this.ball.x + this.ball.radius > this.bricks.bricks[i][j].x &&
			this.ball.x - this.ball.radius < this.bricks.bricks[i][j].x + this.bricks.bricks[i][j].width) &&
			(this.ball.y + this.ball.radius > this.bricks.bricks[i][j].y &&
				this.ball.y - this.ball.radius < this.bricks.bricks[i][j].y + this.bricks.bricks[i][j].height))
			return true;
		return false;
	}

	this.render = function () {
		context.clearRect(0, 0, canvas.width, canvas.height);
		this.update();
		this.draw();
	}

	this.togglePause = function () {
		this.gamePaused = !this.gamePaused;
	}

	this.movePaddleLeft = function () {
		if (this.paddle.x > 0)
			this.paddle.x -= 10 * PADDLE_SPEED;
	}

	this.movePaddleRight = function () {
		if (this.paddle.x < canvas.width - this.paddle.width)
			this.paddle.x += 10 * PADDLE_SPEED;
	}

	this.setPaddlePos = function (x) {
		if (this.gamePaused || this.gameWin || this.gameOver) return;
		if (x < 0) x = 0;
		if (x > canvas.width - this.paddle.width) x = canvas.width - this.paddle.width;
		this.paddle.x = x;
	}

	this.startGame = function () {
		if (this.gamePaused) return;
		if (this.ball.dir == BallDirs.NONE) {
			this.ball.dir = BallDirs.RIGHT + BallDirs.UP;
		}
	}
};


function getRandomRange(min, max) {
	return Math.random() * (max - min + 1) + min;
}

var arkanoidGame;

function render() {
	arkanoidGame.render();
}

function checkCanvasIsSupported() {
	canvas = document.getElementById("gameCanvas");
	canvas.width = 800;
	canvas.height = 500;
	canvas.style.cursor = "none";
	if (canvas.getContext) {
		context = canvas.getContext('2d');

		arkanoidGame = new ArkanoidGame(canvas, context);
		arkanoidGame.init();

		setInterval(render, 1000 / 60);
	} else {
		alert("Sorry:( but your browser doesn't support a canvas.");
	}
}

var KeyCodes = {
	SPACE: 32
};

document.onkeydown = function (event) {
	var keyCode;
	if (event == null) {
		keyCode = window.event.keyCode;
	} else {
		keyCode = event.keyCode;
	}
	switch (keyCode) {
		case KeyCodes.SPACE:
			arkanoidGame.togglePause();
			break;
		default:
			break;
	}
}

document.onmousemove = function (event) {
	arkanoidGame.setPaddlePos(event.pageX);
}

document.onclick = function () {
	arkanoidGame.startGame();
}
