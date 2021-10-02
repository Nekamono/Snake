//Vamos a usar http://processingjs.org/
// o https://p5js.org/reference/

// Importamos las librerias
let { append, cons, first, isEmpty, isList, length, rest, map, forEach } = functionalLight;

// Actualiza los atributos del objeto y retorna una copia profunda
function update(data, attribute){
	return Object.assign({}, data, attribute);
}

//////////////////////// Mundo inicial

let Mundo = {}
let estadoJuego = 1;
//tamaño de la serpiente
const dx = 13;
const dy = 13;
const largoPantalla = 400;
const anchoPantalla = 400;

////////////////////////
/**
* Contrato: <moveSnake><snake><dir> --> <array>
* Propósito: Actualiza la serpiente. Creando una nueva cabeza y removiendo la cola
* @param snake Variable lista para snake.
* @param dir Variable objeto para dir.
* @example:  
*/
function moveSnake(snake, dir){
	const head = first(snake);
	return cons({ x: head.x + dir.x, y: head.y + dir.y }, snake.slice(0, length(snake) - 1));
}
//tamaño de la serpiente


/**
* Contrato: <drawSnake><snake> --> <>
* Propósito: Dibuja la serpiente
* @param snake Variable lista para snake.
* @example:  
*/
function drawSnake(snake){
	forEach(snake, part => {
		fill(240, 240, 240);
		rect(part.x * dx, part.y * dy, dx, dy);
	});
}

/**
* Contrato: <drawObstacle><obstacle> --> <>
* Propósito: Dibuja un obstaculo
* @param obstacle Variable lista para snake.
* @example:  
*/
function drawObstacle(obstacle){
	forEach(obstacle, part => {
		fill(0, 143, 57);
		rect(part.x * dx, part.y * dy, dx, dy);
	});
}

/**
 * Dibuja la comida
 */
//Esto hace que la comida sea un gato
let img;
function preload(){
  img = loadImage("images/gatitoPrueba.jpg");

  image(img, 0, 0);
}
function drawGatito(food){
	loadImage("images/gatitoPrueba.jpg", img => 
  forEach(food, part =>
  {
  image(img, part.x * dx, part.y * dy, dx, dy);  
	}));
}

/**
* Contrato: <drawFood><food> --> <>
* Propósito: Dibuja la comida
* @param food Variable lista para food.
* @example:  
*/
function drawFood(food){
	forEach(food, part => {
		fill(200, 20, 10);
		rect(part.x * dx, part.y * dy, dx, dy);
	});
}

/**
* Contrato: <eatFood><snake><food> --> <boolean>
* Propósito: Retorna si la cabeza de la serpiente esta en la misma posición que la comida
* @param snake Variable lista para snake.
* @param food Variable lista para food.
* @example:  
*/
function eatFood(snake, food){
	const head = first(snake);
	if (head.x == food.x && head.y == food.y){
		return 1;
	}
	return 0;
}

/**
* Contrato: <growSnake><snake> --> <array>
* Propósito: Agrega una posición más al arreglo Snake
* @param snake Variable lista para snake.
* @example:  
*/
function growSnake(snake){
	const tail = first(snake.slice(-1))
	return append(snake, { x: tail.x - 1, y: tail.y });
}

/**
* Contrato: <choquePared><snake> --> <boolean>
* Propósito: Retorna si la cabeza de la culebra esta en la misma posición que la pared
* @param snake Variable lista para snake.
* @example:  
*/
function choquePared(snake){
	const head = first(snake);
	if (head.x < 0 || head.x > anchoPantalla / dx || head.y < 0 || head.y > largoPantalla / dy){
		return 1
	}
	return 0
}

/**
* Contrato: <choquePared><obstacle><snake> --> <boolean>
* Propósito: Retorna si la cabeza de la culebra esta en la misma posición que alguno de los valores
* @param obstacle Variable lista para obstacle.
* @param snake Variable lista para snake.
* @example:  
*/
function choqueObstacle(obstacle, snake){
  const head = first(snake)
  if(isEmpty(obstacle)){
    return 0;
  }
  const obstacleMadre = first(obstacle);
  if (head.x == obstacleMadre.x && head.y == obstacleMadre.y){
    return 1;
  } else{
    return choqueObstacle(rest(obstacle), snake);
  }
}

/**
* Contrato: <choqueSnake><snake> --> <boolean>
* Propósito: Retorna si la cabeza de la culebra esta en la misma posición el cuerpo de la culebra
* @param snake Variable lista para snake.
* @example:  
*/
function choqueSnake(snake){
  if(length(snake) == 1){
    return 0;
  }
  const head = first(snake);
  const cuerpo = rest(snake);
  const auxCuerpo = first(cuerpo);
  if(head.x == auxCuerpo.x && head.y == auxCuerpo.y){
    return 1;
  }else{
    return choqueSnake(cons(head, rest(cuerpo)));
  }
}

/**
* Contrato: <drawScore><score> --> <>
* Propósito: Dibuja el puntaje
* @param score Variable entero para score.
* @example:  
*/
function drawScore(score){
	textFont('Georgia', 18);
	text("Score: " + score, 10, 380);
}

/**
* Contrato: <drawPerdiste><> --> <>
* Propósito: Muestra el mensaje "Perdiste"
* @param 
* @example:  
*/
function drawPerdiste(){
	fill(200, 20, 10);
	textFont('Georgia', 30);
	text("Perdiste", 140, 200);
}

/**
* Contrato: <reset><> --> <object>
* Propósito: Retorna el objeto mundo sin caracteristicas modificadas
* @param 
* @example:  
*/
function reset(){
	estadoJuego = 1;
	Mundo = { 
    snake: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }], 
    dir: { x: 1, y: 0 }, 
    food: [{ x: randomNum(30), y: randomNum(30) }], 
    obstacle: [], 
    score: 0,
    speed: 8
    };
  frameRate(Mundo.speed);
}

/**
* Contrato: <randomNum><max><min> --> <boolean>
* Propósito: Retorna un valor aleatorio entre max y min
* @param max Variable lista para max.
* @param min Constante 0 para min.
* @example:  
*/
function randomNum(max, min = 0){
	return Math.floor(Math.random() * (max - min)) + min;
}

/**
* Contrato: <setup><> --> <object>
* Propósito: Retorna mundo sin caracteristicas modificadas
* @param 
* @example:  
*/
function setup(){
	createCanvas(anchoPantalla, largoPantalla);
	background(0, 0, 0);

	button = createButton('Reintentar');
	button.position(160, 250);
	button.mousePressed(reset);
	button.style('background-color: transparent')
	button.style('color: #fd1414')
	button.style('border-color: transparent')

	button.style('hover{border-color: #fd1414}')
	menu = createA('index.html', 'Volver al menu');
	menu.position(0, 0);

	Mundo = { 
    snake: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }], 
    dir: { x: 1, y: 0 }, 
    food: [{ x: randomNum(30), y: randomNum(30) }],
    obstacle: [{x: 20, y: 10}],
    score : 0,
    speed : 8,
    alreadyObstacle: false,
    alreadySpeed: false,
    }
  frameRate(Mundo.speed);
}

/**
* Contrato: <drawGame><Mundo> --> <>
* Propósito: Pinta un canvas y el mundo dentro de él
* @param Mundo Variable object para Mundo
* @example:  
*/
function drawGame(Mundo){
	background(0, 0, 0);
	if (estadoJuego == 1){
		menu.hide()
		button.hide();
		drawSnake(Mundo.snake);
		drawFood(Mundo.food);
		drawScore(Mundo.score);
		drawObstacle(Mundo.obstacle);
    drawGatito(Mundo.food);
	}else if (estadoJuego == 0){
		button.show();
		menu.show();
		return drawPerdiste();
	}
}

/**
* Contrato: <onTic><Mundo> --> <object>
* Propósito: Retorna Mundo con caracteristicas modificadas segun la acción
* @param Mundo variable object para Mundo
* @example:  
*/
function onTic(Mundo){
	console.log(Mundo)
  //Modifica cuando se choca con la pared, con un obstaculo o con ella misma
	if (choquePared(Mundo.snake) == 1 || choqueSnake(Mundo.snake) == 1 || choqueObstacle(Mundo.obstacle, Mundo.snake) == 1){
		estadoJuego = 0;
	}
  //Modifica cuando la culebra come
	if (eatFood(Mundo.snake, first(Mundo.food)) == 1){
		return update(Mundo, 
    { snake: growSnake(Mundo.snake), 
    food: [{ x: randomNum(30), y: randomNum(30) }], 
    score: Mundo.score + 10,
    alreadyObstacle: false,
    alreadySpeed: false
    });
	}
  //Modifica cuando la culebra come/aumenta puntos **Cambio de velocidad**
	if (Mundo.score % 30 == 0 && Mundo.score > 0 && Mundo.alreadySpeed == false){
    frameRate(Mundo.speed);
		return update(Mundo, 
    {snake: moveSnake(Mundo.snake, Mundo.dir),  
    speed: Mundo.speed + 2,
    alreadySpeed : true
    });
	}
  //Modifica cuando la culebra come/aumenta puntos **Generación de obstaculos**
  if (Mundo.score % 30 == 0 && Mundo.score > 0 && Mundo.alreadyObstacle == false){
    return update(Mundo, 
    {snake: moveSnake(Mundo.snake, Mundo.dir),
    obstacle: append([{x: randomNum(30), y: randomNum(30)}], Mundo.obstacle),
    alreadyObstacle : true
    });
  }
	return update(Mundo, { snake: moveSnake(Mundo.snake, Mundo.dir) });
}

//Implemente esta función si quiere que su programa reaccione a eventos del mouse
function onMouseEvent(Mundo, event){
	return update(Mundo, {});
}

/**
* Contrato: <onKeyevent><Mundo><keyCode> --> <object>
* Propósito: Realiza una modificación en el mundo segun la tecla presionada
* @param Mundo Variable object para Mundo.
* @param keyCode Variable  para keyCode.
* @example:  
*/
function onKeyEvent(Mundo, keyCode){
	// Cambiamos la dirección de la serpiente. Noten que no movemos la serpiente. Solo la dirección
	switch (keyCode){
		case UP_ARROW:
			if (Mundo.dir.y != 1){
				return update(Mundo, { dir: { y: -1, x: 0 } });
			}else{
				return update(Mundo, {});
			}
			break;
		case DOWN_ARROW:
			if (Mundo.dir.y != -1){
				return update(Mundo, { dir: { y: 1, x: 0 } });
			}else{
				return update(Mundo, {});
			}
			break;
		case LEFT_ARROW:
			if (Mundo.dir.x != 1){
				return update(Mundo, { dir: { y: 0, x: -1 } });
			}else{
				return update(Mundo, {});
			}
			break;
		case RIGHT_ARROW:
			if (Mundo.dir.x != -1){
				return update(Mundo, { dir: { y: 0, x: 1 } });
			}else{
				return update(Mundo, {});
			}
			break;
		default:
			return update(Mundo, {});
	}
}