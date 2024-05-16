const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const $sprite = document.querySelector("#sprite");
const $bricks = document.querySelector("#bricks");

canvas.width = 448;
canvas.height = 400;
// VARIABLES DE LA PELOTA
const ballRadius = 3;
//POSICION DE LA PELOTA

let x = canvas.width / 2;
let y = canvas.height - 30;

//VELOCIDAD DE LA PELOTA
let dx = -3;
let dy = -3;
//VARIABLES DE LA PALETA
const paddleHeight = 10;
const paddleWidth = 50;

let rightPressed = false;
let leftPressed = false;

//VARIABLES DE LOS LADRILLOS
const brickRowsCount = 6;
const brickColumnCount = 13;
const brickWidth = 30;
const brickHeigth = 14;
const brickPadding = 1;
const brickOffsetTop = 80;
const brickOffsetLeft = 16;
const bricks = [];

const BRICK_STATUS = {
  ACTIVED: 1,
  DESTROYED: 0,
};

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowsCount; r++) {
    //calcula la posicion del ladrillo en la pantalla
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
    const brickY = r * (brickHeigth + brickPadding) + brickOffsetTop;
    //asignar un color aleatorio a cada ladrillo
    const random = Math.floor(Math.random() * 8);
    //guardar la info de cada ladrillo
    bricks[c][r] = {
      x: brickX,
      y: brickY,
      status: BRICK_STATUS.ACTIVED,
      color: random,
    };
  }
}

const PADDLE_SENSIBILITY = 8;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  // ctx.fillStyle = 'red'
  // ctx.fillRect(
  //     paddleX,
  //     paddleY,
  //     paddleWidth,
  //     paddleHeight
  // )
  ctx.drawImage(
    //la imagen
    $sprite,
    29, //donde empieza a rocortar
    174,
    paddleWidth, // tamaño del recorte
    paddleHeight,
    paddleX, //posicion del dibujo
    paddleY,
    paddleWidth, //ancho del dibujo
    paddleHeight //alto del dibujo

    //clipX
    //clipY
  );
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowsCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const clipX = currentBrick.color * 32

      ctx.drawImage(
        $bricks,
        clipX,
        0,
        31,
        14,
        currentBrick.x,
        currentBrick.y,
        brickWidth,
        brickHeigth

      )
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowsCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const isBallSameXAsBrick = 
      x > currentBrick.x &&
      x < currentBrick.x + brickWidth

      const isBallSameYAsBrick = 
      y > currentBrick.y &&
      y < currentBrick.y + brickHeigth
        if(isBallSameXAsBrick && isBallSameYAsBrick) {
          dy = -dy
          currentBrick.status = BRICK_STATUS.DESTROYED
        }
    } 
  }
}
function ballMovement() {
  //REBOTAR LAS PELOTAS EN LOS LATERALES
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  //REBOTAR EN LA PARTE DE ARRIBA
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  //CUANDO LA PELOTA TOCA LA PALA
  const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth;

  const isBallTouchingPaddle = y + dy > paddleY;
  if (isBallSameXAsPaddle && isBallTouchingPaddle) {
    dy = -dy; // cambia la direccion de la pelota
  } else if (y + dy > canvas.height - ballRadius) {
    //CUANDO LA PELOTA TOCA EL SUELO
    console.log("Game Over");
    document.location.reload();
  }

  x += dx;
  y += dy;
}
function paddleMovement() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += PADDLE_SENSIBILITY;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= PADDLE_SENSIBILITY;
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  function keyDownHandler(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = true;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = false;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = false;
    }
  }
}

function draw() {
  console.log(rightPressed, leftPressed);
  cleanCanvas();
  //DIBUJAR ELEMENTOS
  drawBall();
  drawPaddle();
  drawBricks();
  //COLICIONES Y MOVIMIENTOS
  collisionDetection();
  ballMovement();
  paddleMovement();

  window.requestAnimationFrame(draw);
}
draw();
initEvents();
