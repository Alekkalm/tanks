'use strict'; //всегда объявлять переменные

//FPS
let lastTimeOneSec = performance.now(); // Время последнего кадра
let lastTime = performance.now(); // Время последнего кадра
let frameCount = 0; // Счётчик кадров
let fps = 0; // Текущее значение FPS
const fpsDisplay = document.getElementById('fpsDisplay');
const fpsDT = document.getElementById('fpsDT');
const codeDT = document.getElementById('codeDT');
let fpsMaxDelta = 0;
let codeMaxDelta = 0;
const fpsMaxDT = document.getElementById('fpsMaxDT');
const codeMaxDT = document.getElementById('codeMaxDT');

//дисплей отладочной информации
//const bombsOnDisplayNText = document.getElementById('bombsOnDisplayN');
//let frameDropN = 0;
//let updateFunctionIsBusy = false;
//const frameDropNText = document.getElementById('frameDropN'); 
//let frameN = 0;
//const frameNText = document.getElementById('frameN'); 
const t1HP = document.getElementById('t1HP');
const t2HP = document.getElementById('t2HP');
const gameStatusDOMElement = document.getElementById('gameStatus');
let gameStatus = "идет игра";//завершение игры, бой закончен!.
const gameTimeDOMElement = document.getElementById('gameTime');
let startTime = performance.now(); // Фиксируем время загрузки страницы
let gameTime = 0;
const gameEndingTimeDOMElement = document.getElementById('gameEndingTime');
let startGameEndingTime = 0; 
let gameEndingTime = 0;


//танки
//получаем первый танк
const svg_t1 = document.getElementById('t1'); 
const svg_t1k = svg_t1.getElementById('t1k'); 
const svg_t1b = svg_t1.getElementById('t1b');
const svg_t1hp = document.getElementById('t1_hp'); 
svg_t1.style.transformOrigin = 'center center'; //только для поворотов (относительно центра)
svg_t1b.style.transformOrigin = '0 0'; //только для поворотов (относительно левого верхнего угла)
const t1 = {
    svg_t: svg_t1,
	svg_tk: svg_t1k,
	svg_tb: svg_t1b,
	svg_hp: svg_t1hp,
    x: 0, //левый верхний угол
    y: 30, //левый верхний угол
    k_angle: 0, //0 = влево
	b_angle: 0, //0 = влево
	speed: 0,
	k_angleSpeed: 0,
	kRect: svg_t1k.getBoundingClientRect(), //DOMRect { x: 0, y: 10, width: 70, height: 50, top: 10, right: 70, bottom: 60, left: 0 }
                                            //если переместиться как t2, то: DOMRect { x: 1850, y: 10, width: 70, height: 50, top: 10, right: 1920, bottom: 60, left: 1850 }
	initialBoundingBox:[{x:0, y:10},{x:70, y:10},
				 		{x:0, y:60},{x:70, y:60}],
	boundingBox:[{x:0, y:10},{x:70, y:10},
				 {x:0, y:60},{x:70, y:60}],
	s: 50*70,
	center: { x: 35, y: 35 }, //координаты центра вращения, для пересчета boundingBox.
	bText: svg_t1b.querySelector('.b_text'),//текст на башне
	hp: 150,
	prevHp: 150,//предыдущий hp. чтобы обнаружить фронт
	hpText: svg_t1hp.querySelector('.hp'),//svg_t1.querySelector('.hp'),//текст health Point
	exploding: false,
	destroyedFront: false,
	destroyed: false,
	};
//получаем второй танк
const svg_t2 = document.getElementById('t2'); 
const svg_t2k = svg_t2.getElementById('t2k'); 
const svg_t2b = svg_t2.getElementById('t2b');
const svg_t2hp = document.getElementById('t2_hp'); 
svg_t2.style.transformOrigin = 'center center'; //только для поворотов (относительно центра)
svg_t2b.style.transformOrigin = '0 0'; //только для поворотов (относительно левого верхнего угла)
const t2 = {
    svg_t: svg_t2,
	svg_tk: svg_t2k,
	svg_tb: svg_t2b,
	svg_hp: svg_t2hp,
    x: window.innerWidth - 70, //правый верхний угол минус длину танка
    y: 30, //левый верхний угол
    k_angle: 180, //0 = влево
	b_angle: 0, //0 = влево
    speed: 0,
	k_angleSpeed: 0,
	kRect: svg_t2k.getBoundingClientRect(),
	initialBoundingBox:[{x:0, y:10},{x:70, y:10},
						{x:0, y:60},{x:70, y:60}],
	boundingBox:[{x:0, y:0},{x:0, y:0},
				 {x:0, y:0},{x:0, y:0}],
	s: 50*70,
	center: { x: 35, y: 35 }, //координаты центра вращения, для пересчета boundingBox.
	bText: svg_t2b.querySelector('.b_text'),//текст на башне
	hp: 150,
	prevHp: 150,//предыдущий hp. чтобы обнаружить фронт
	hpText: svg_t2hp.querySelector('.hp'),//svg_t2.querySelector('.hp'),//текст health Point
	exploding: false,
	destroyedFront: false,
	destroyed: false,
  };

  const tanks = [];
  tanks.push(t1);
  tanks.push(t2);

//взрыв от танка
function cloneParicles(svg){
	const particleTemplate = svg.getElementById('particleTemplate'); // Находим шаблон
	for (let i = 0; i < 49; i++) {
		const particlePolygon = particleTemplate.cloneNode(true); // Клонируем шаблон
		particlePolygon.removeAttribute('id'); // Убираем id, чтобы не было дубликатов
		svg.appendChild(particlePolygon); 
	}
}

const tank1ExplosionSVG = document.getElementById('tank1Explosion');
cloneParicles(tank1ExplosionSVG);
tank1ExplosionSVG.style.transform = `translate(-200px, 0px)`;//прячем за пределы экрана

const tank2ExplosionSVG = document.getElementById('tank2Explosion');
cloneParicles(tank2ExplosionSVG);
tank2ExplosionSVG.style.transform = `translate(-200px, 0px)`;//прячем за пределы экрана



  //снаряды
  function fillBombsPool(bombsPool, bombsNum){
	for (let i = 0; i < bombsNum; i++) {
		
		const bombSVG = bombTemplate.cloneNode(true); // Клонируем шаблон
		bombSVG.removeAttribute('id'); // Убираем id, чтобы не было дубликатов
		bombSVG.style.display = 'block'; // Делаем элемент видимым
		bombSVG.style.transformOrigin = 'center center';
		bombSVG.style.transform = `translate(-100px, 0px)`;//прячем за пределы экрана
		const bombIdText = bombSVG.querySelector('.bomb_id_text');//ищем по названию класса
		bombIdText.textContent = i;
		//document.body.appendChild(bombSVG);
		document.body.insertBefore(bombSVG, svg_t1); // Добавляем ПЕРЕД(порядок отрисовки) танком t1 (чтобы тексты танка были всегда видны, даже если наехали на снаряд)
	
		bombsPool.push({
		svg: bombSVG,
		x: - 100, //уводим за пределы экрана
		y: 0, 
		width: 10,
		height: 10,
		//   initialBoundingBox:[{x:0, y:0},{x:10, y:0},
		// 					  {x:0, y:10},{x:10, y:10}],
		//   boundingBox:[{x:-100, y:0},{x:-90, y:0},
		// 	           {x:-100, y:10},{x:-90, y:10}],
		//   center: { x: 5, y: 5 }, //координаты центра вращения, для пересчета boundingBox.
		angle: 0,
		speed: 0,
		flying: false, //в полете
		exploding: false, //в процессе взрыва
		});
	}
}
const BombsNum = 50;
const t1BombsPool = [];
const t2BombsPool = [];
const bombTemplate = document.getElementById('bomb'); // Находим шаблон
fillBombsPool(t1BombsPool, BombsNum);
fillBombsPool(t2BombsPool, BombsNum);
const BombsPool = [...t1BombsPool, ...t2BombsPool];

  //стены
  const wallsNum = 30;
  const walls = [];
  const wallTemplate = document.getElementById('wallTemplate'); // Находим шаблон
  for (let i = 0; i < wallsNum; i++) {
	  
	  const wallSVG = wallTemplate.cloneNode(true); // Клонируем шаблон
	  wallSVG.removeAttribute('id'); // Убираем id, чтобы не было дубликатов
	  wallSVG.style.display = 'block'; // Делаем элемент видимым
	  wallSVG.style.transformOrigin = 'center center';
	  const wallIdText = wallSVG.querySelector('.wall_id_text');//ищем по названию класса
	  wallIdText.textContent = i;
	  //document.body.appendChild(wallSVG);
	  document.body.insertBefore(wallSVG, svg_t1); // Добавляем ПЕРЕД(порядок отрисовки) танком t1 (чтобы тексты танка были всегда видны, даже если наехали на стену)
	  
	  const x = Math.random() * (window.innerWidth - 30 - 200) + 100; //30 - ширина стены, 200 - два танка по диагонали, 100 - один танк по диагонали (чтобы мог развернуться)
	  const y = Math.random() * (window.innerHeight - 30- 50) + 50; //50 - место для текстов вверху.
	  wallSVG.style.transform = `translate(${x}px, ${y}px)`;
	  walls.push({
		svg: wallSVG,
		x: x,
		y: y,
		width: 30,
		height: 30,
		angle: 0,
		id: i,
	  });
	}


//окно "Победа"
function showWinPopup(titleString, noticeString) {
    const overlay = document.getElementById('winOverlay');
    overlay.style.opacity = '1';
    //overlay.querySelector('.win-popup').style.transform = 'scale(1)';
 	overlay.querySelector('.win-title').textContent = `${titleString}`;
	overlay.querySelector('.win-notice').textContent = `${noticeString}`;

	// Запускаем конфетти
    confetti({
		particleCount: 150,
		spread: 70,
		origin: { y: 0.6 },
		zIndex: 1001
	  });

	// Проигрываем звук победы
    //const winSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
	const winSound = new Audio('sound/mixkit-cheering-crowd-loud-whistle-610.wav');
    winSound.play();
  }

  function hideWinPopup() {
    const overlay = document.getElementById('winOverlay');
    overlay.style.opacity = '0';
    //overlay.querySelector('.win-popup').style.transform = 'scale(0.8)';

     // Через 0.3s (длительность анимации) скрываем полностью
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300);
  }

  // Вешаем обработчик на кнопку закрытия
  document.getElementById('winCloseBtn').addEventListener('click', hideWinPopup);

//муравьи
//строка для получения SVG
// const antTemplate = document.getElementById('ant-template'); // Находим шаблон

// const ants = [];
// const numAnts = 50;
// const antSize = 20; 
// const avoidRadius = 25; 
// const followRadius = 150; 

// for (let i = 0; i < numAnts; i++) {
	
// 	const antElem = antTemplate.cloneNode(true); // Клонируем шаблон
// 	antElem.removeAttribute('id'); // Убираем id, чтобы не было дубликатов
// 	antElem.style.display = 'block'; // Делаем элемент видимым
	
// 	antElem.style.position = 'absolute';
// 	antElem.setAttribute('width', `${antSize}px`);  
// 	antElem.setAttribute('height', `${(antSize * 73 / 46)}px`); // Сохранение пропорций
// 	antElem.style.transformOrigin = 'center center';
// 	document.body.appendChild(antElem);
  
// 	ants.push({
// 	  element: antElem,
// 	  x: Math.random() * (window.innerWidth - antSize),
// 	  y: Math.random() * (window.innerHeight - (antSize * 73 / 46)),
// 	  angle: Math.random() * 360,
// 	  speed: 1 + Math.random() * 2,
// 	  followMouse: false,
// 	});
//   }




// //--------------------------------------------------------
// //отладка. получаем размеры муравья
// antTemplate.style.transform = `translate(${500}px, ${300}px) rotate(${45}deg)`;

// const antWidth = antTemplate.getAttribute('width') //получаем размеры SVG. похоже что тоже без учета трансформации. (на rotate не реагирует).
// const antHeight = antTemplate.getAttribute('height'); 
// console.log(`antWidth: ${antWidth}, antHeight: ${antHeight}`);

// // Получаем bounding box группы
// const bbox = antTemplate.getBBox(); //получаем размеры и координаты bounding box элемента SVG до применения любых трансформаций
// console.log(`x: ${bbox.x}, y: ${bbox.y}, width: ${bbox.width}, height: ${bbox.height}`);

// //получаем 

// /*Метод getBoundingClientRect() возвращает объект DOMRect, который содержит координаты и размеры элемента с учетом всех трансформаций: 
// *    x, y — координаты верхнего левого угла элемента относительно viewport.
// *    width, height — размеры элемента.
// *    top, right, bottom, left — координаты границ элемента относительно viewport.
// *Важно:
// *    getBoundingClientRect() учитывает все трансформации, включая translate, rotate, scale и другие.
// */	
// const rect = antTemplate.getBoundingClientRect();
// console.log(rect); // { x, y, width, height, top, right, bottom, left }
// //получаем размер новой коробки, которая увеличилась из-за поворота муравья.
// //отладка. конец.
// //-----------------------------------------------------------











//обработчики мыши и клавиш
let mousex = -1000;
let mousey = -1000;


document.addEventListener('mousemove', (event) => {
  mousex = event.clientX;
  mousey = event.clientY;
});

document.addEventListener('mouseout', () => {
  mousex = -1000;
  mousey = -1000;
});

//нажатые клавиши
let T1Left_pressed = false;
let T1Forward_pressed = false;
let T1Backward_pressed = false;
let T1Right_pressed = false;
let T1bLeft_pressed = false;
let T1bRight_pressed = false;
let T1Fire_pressed = false;
let T1Fire_pressed_previous = false;
let T1Fire_pressed_front = false;

let T2Left_pressed = false;
let T2Forward_pressed = false;
let T2Backward_pressed = false;
let T2Right_pressed = false;
let T2bLeft_pressed = false;
let T2bRight_pressed = false;
let T2Fire_pressed = false;
let T2Fire_pressed_previous = false;
let T2Fire_pressed_front = false;

let keyR_pressed = false;

//коды клавиш:
//https://www.w3.org/TR/uievents-code/#key-alphanumeric-section
// Обработчик события нажатия клавиши
document.addEventListener('keydown', (event) => {
  switch (event.code) {
	case 'KeyA': T1Left_pressed = true; break; 
    case 'KeyW': T1Forward_pressed = true; break; 
    case 'KeyS': T1Backward_pressed = true; break;
    case 'KeyD': T1Right_pressed = true; break;
	case 'KeyQ': T1bLeft_pressed = true; break;
    case 'KeyE': T1bRight_pressed = true; break;
	case 'Space': T1Fire_pressed = true; break;

	case 'ArrowLeft': T2Left_pressed = true; break; 
    case 'ArrowUp': T2Forward_pressed = true; break; 
    case 'ArrowDown': T2Backward_pressed = true; break;
    case 'ArrowRight': T2Right_pressed = true; break;
	case 'KeyI': T2bLeft_pressed = true; break;
    case 'KeyP': T2bRight_pressed = true; break;
	case 'KeyO': T2Fire_pressed = true; break;

	case 'KeyR': keyR_pressed = true; break; 
  }
  //console.log(event.code);
});

// Обработчик события отпускания клавиши
document.addEventListener('keyup', (event) => {
  switch (event.code) {
	case 'KeyA': T1Left_pressed = false; break; 
    case 'KeyW': T1Forward_pressed = false; break; 
    case 'KeyS': T1Backward_pressed = false; break;
    case 'KeyD': T1Right_pressed = false; break;
	case 'KeyQ': T1bLeft_pressed = false; break;
    case 'KeyE': T1bRight_pressed = false; break;
	case 'Space': T1Fire_pressed = false; break;

	case 'ArrowLeft': T2Left_pressed = false; break; 
    case 'ArrowUp': T2Forward_pressed = false; break; 
    case 'ArrowDown': T2Backward_pressed = false; break;
    case 'ArrowRight': T2Right_pressed = false; break;
	case 'KeyI': T2bLeft_pressed = false; break;
    case 'KeyP': T2bRight_pressed = false; break;
	case 'KeyO': T2Fire_pressed = false; break;

	case 'KeyR': keyR_pressed = false; break; 
  }
});



// --- Трансформации ---
// 1. Сдвиг (Translate)
function translate(point, dx, dy) {
    return { x: point.x + dx, y: point.y + dy };
}

//масштабирование у нас не используется
// 2. Масштабирование (Scale)
function scale(point, sx, sy, center = { x: 0, y: 0 }) {
    return {
        x: center.x + (point.x - center.x) * sx,
        y: center.y + (point.y - center.y) * sy
    };
}

// 3. Поворот (Rotate)
function rotate(point, angleDegrees, center = { x: 0, y: 0 }) {
    const angleRad = angleDegrees * Math.PI / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const x = point.x - center.x;
    const y = point.y - center.y;
    return {
        x: center.x + (x * cos - y * sin),
        y: center.y + (x * sin + y * cos)
    };
}




//для тех кто только движется и не поворачивается.
//не используется
function translateBoundingBox(a){
	a.initialBoundingBox.forEach((point, index)=>{a.boundingBox[index] = translate(point, a.x, a.y)});
}

function recalcBoundingBox(a){
	a.initialBoundingBox.forEach((point, index)=>{
		const p1 = rotate(point, a.k_angle, a.center);
		const p2 = translate(p1, a.x, a.y);
		a.boundingBox[index].x = p2.x;
		a.boundingBox[index].y = p2.y;
	});
}


// document.addEventListener('click', () => {
//     const silentSound = new AudioContext();
//     silentSound.close(); // "Разогреваем" аудио-систему
// }, { once: true }); // Только при первом клике

const shotSound = new Audio('sound/mixkit-war-explosions-2773.wav');
//shotSound.preload = 'auto';
//shotSound.load();
// // Проверяем, можно ли воспроизвести без задержки
// shotSound.play().then(() => {
//     shotSound.pause();
//     shotSound.currentTime = 0;
// }).catch(e => console.log("Предзагрузка звука:", e));




function shot(tank, bombsPool){
	const bomb = bombsPool.find((bomb) => bomb.flying === false && bomb.exploding === false );
	if(bomb !== undefined){
		let sumAngle = tank.k_angle + tank.b_angle;
		let dx = Math.cos(sumAngle * Math.PI / 180) * 35; //35 - это длинна дула (от центра башни до конца дула). Чтобы снаряд появлялся на конце дула.
		let dy = Math.sin(sumAngle * Math.PI / 180) * 35; //вниз - положительный угол, вверх - отрицательный. вправо = 0.

		bomb.x = tank.x + 30 + dx; //+30 - это центр танка
		bomb.y = tank.y + 30 + dy; //+30 - центр танка
		bomb.angle = sumAngle;//bombAngle,
		bomb.speed = 8;
		bomb.flying = true;
		//bomb.svg.style.display = 'block'; // Делаем элемент видимым
		const bombCircle = bomb.svg.querySelector('.bomb');//ищем по названию класса
		const bombText = bomb.svg.querySelector('.bomb_id_text');//ищем по названию класса
		//const explosion = bomb.svg.querySelector('.explosion');//ищем по названию класса
		bombCircle.style.opacity = 1;
		bombText.style.opacity = 1;
		//explosion.style.opacity = 0;
		//shotSound.currentTime = 0; // Перематываем звук в начало
		shotSound.play();
	}
}





function collision(a, b){
	const a_CenterX = a.x + a.width/2;
	const a_CenterY = a.y + a.height/2;
	const b_CenterX = b.x + b.width/2;
	const b_CenterY = b.y + b.height/2;
	const dist = Math.sqrt(Math.pow(a_CenterX - b_CenterX, 2) + Math.pow(a_CenterY - b_CenterY, 2)); //расстояние между центрами
	const a_diametr = (a.width + a.height)/2; //диаметр - среднее между шириной и высотой.
	const b_diametr = (b.width + b.height)/2; //диаметр - среднее между шириной и высотой.
	return dist < (a_diametr + b_diametr)/2;
}

function rectCollision(a, b){
	const a_LeftTopX = a.x;
	const a_LeftTopY = a.y;
	const a_RightTopX = a.x + a.width;
	const a_RightTopY = a.y;
	const a_LeftBottomX = a.x;
	const a_LeftBottomY = a.y + a.height;
	const a_RightBottomX = a.x + a.width;
	const a_RightBottomY = a.y + a.height;

	const b_LeftX = b.x ;
	const b_RightX = b.x + b.width;
	const b_TopY = b.y;
	const b_BottomY = b.y + b.height;

	const collision = b_LeftX < a_LeftTopX && a_LeftTopX < b_RightX &&
					  b_TopY < a_LeftTopY 	&& a_LeftTopY < b_BottomY ||
					  b_LeftX < a_RightTopX && a_RightTopX < b_RightX &&
					  b_TopY < a_RightTopY 	&& a_RightTopY < b_BottomY ||
					  b_LeftX < a_LeftBottomX && a_LeftBottomX < b_RightX &&
					  b_TopY < a_LeftBottomY 	&& a_LeftBottomY < b_BottomY ||
					  b_LeftX < a_RightBottomX && a_RightBottomX < b_RightX &&
					  b_TopY < a_RightBottomY 	&& a_RightBottomY < b_BottomY
	return collision;
}

// Функция вычисления площади треугольника
function calculateArea(x1, y1, x2, y2, x3, y3) {
	return Math.abs((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1)) / 2;
}

function bombTankCollision(b, t){
    
	//точка внутри четырехугольника
	//метод площадей

	//представим снаряд в виде точки с координатами центра
	const bx = b.x+5;
	const by = b.y+5;

	//площадь танка = t.s

	//площади 4-х треугольников, образованых точкой снаряда и точками углов танка
	const s1 = calculateArea(bx, by, t.boundingBox[0].x, t.boundingBox[0].y, t.boundingBox[1].x, t.boundingBox[1].y);
	const s2 = calculateArea(bx, by, t.boundingBox[1].x, t.boundingBox[1].y, t.boundingBox[2].x, t.boundingBox[2].y);
	const s3 = calculateArea(bx, by, t.boundingBox[2].x, t.boundingBox[2].y, t.boundingBox[3].x, t.boundingBox[3].y);
	const s4 = calculateArea(bx, by, t.boundingBox[3].x, t.boundingBox[3].y, t.boundingBox[0].x, t.boundingBox[0].y);

	// Учитываем погрешность вычислений (из-за float)
    //const epsilon = 1e-10;
	const epsilon = 100; //при тесте оказалось что разность между суммами площадей треугольников и площадью танка почти 61
    return Math.abs(s1 + s2 + s3 + s4 - t.s) < epsilon;
}

function point2rectCollision(px,py,x1,y1,x2,y2,x3,y3,x4,y4){
	//площади 4-х треугольников, образованых точкой и точками углов прямоугольника
	const s1 = calculateArea(px, py, x1, y1, x2, y2);
	const s2 = calculateArea(px, py, x2, y2, x3, y3);
	const s3 = calculateArea(px, py, x3, y3, x4, y4);
	const s4 = calculateArea(px, py, x4, y4, x1, y1);
	//площадь прямоугольника
	const sr = calculateArea(x1, y1, x2, y2, x3, y3) * 2;
	// Учитываем погрешность вычислений (из-за float)
	const epsilon = sr*0.03; //3% от площади прямоугольника
    return Math.abs(s1 + s2 + s3 + s4 - sr) < epsilon;
}

function rect2rectCollision(r1x1,r1y1,r1x2,r1y2,r1x3,r1y3,r1x4,r1y4,r2x1,r2y1,r2x2,r2y2,r2x3,r2y3,r2x4,r2y4){
	//(поиск предлагает Separating Axis Theorem (SAT). нужно построить нормали к сторонам прямоугольников, и спроецировать на них прямоугольники
	//если проекции не пересекаются хотябы на одной из нормали, то пересечения нет.)
	//мы пока пойдем другим путем:
	//если хотябы один угол прямоугольника внутри другого (и наоборот), то коллизия.
	return 	point2rectCollision(r1x1,r1y1, r2x1,r2y1,r2x2,r2y2,r2x3,r2y3,r2x4,r2y4) ||
			point2rectCollision(r1x2,r1y2, r2x1,r2y1,r2x2,r2y2,r2x3,r2y3,r2x4,r2y4) ||
			point2rectCollision(r1x3,r1y3, r2x1,r2y1,r2x2,r2y2,r2x3,r2y3,r2x4,r2y4) ||
			point2rectCollision(r1x4,r1y4, r2x1,r2y1,r2x2,r2y2,r2x3,r2y3,r2x4,r2y4) ||

			point2rectCollision(r2x1,r2y1, r1x1,r1y1,r1x2,r1y2,r1x3,r1y3,r1x4,r1y4) ||
			point2rectCollision(r2x2,r2y2, r1x1,r1y1,r1x2,r1y2,r1x3,r1y3,r1x4,r1y4) ||
			point2rectCollision(r2x3,r2y3, r1x1,r1y1,r1x2,r1y2,r1x3,r1y3,r1x4,r1y4) ||
			point2rectCollision(r2x4,r2y4, r1x1,r1y1,r1x2,r1y2,r1x3,r1y3,r1x4,r1y4);
}

function t_recCollision(t,rx1,ry1,rx2,ry2,rx3,ry3,rx4,ry4){
	return rect2rectCollision( 	t.boundingBox[0].x, t.boundingBox[0].y, t.boundingBox[1].x, t.boundingBox[1].y,
								t.boundingBox[2].x, t.boundingBox[2].y, t.boundingBox[3].x, t.boundingBox[3].y,
			 					rx1,ry1,rx2,ry2,rx3,ry3,rx4,ry4);
}

function t_windowCollision(t){
	const w = window.innerWidth;
	const h = window.innerHeight;
	return 	t.boundingBox[0].x < 0 || t.boundingBox[1].x < 0 || t.boundingBox[2].x < 0 || t.boundingBox[3].x < 0 ||
			t.boundingBox[0].x > w || t.boundingBox[1].x > w || t.boundingBox[2].x > w || t.boundingBox[3].x > w ||
			t.boundingBox[0].y < 0 || t.boundingBox[1].y < 0 || t.boundingBox[2].y < 0 || t.boundingBox[3].y < 0 ||
			t.boundingBox[0].y > h || t.boundingBox[1].y > h || t.boundingBox[2].y > h || t.boundingBox[3].y > h ;
}
function t1collision(){
	let c = t_windowCollision(t1);
	//с блоками стен
	walls.forEach((w, index) => {
			if (t_recCollision(t1, w.x,w.y, w.x+w.width,w.y, w.x+w.width,w.y+w.height, w.x,w.y+w.height)) { 
			c = true;
		}
	})
	//с танком
	if (t_recCollision(t1, t2.boundingBox[0].x, t2.boundingBox[0].y, t2.boundingBox[1].x, t2.boundingBox[1].y,
						   t2.boundingBox[2].x, t2.boundingBox[2].y, t2.boundingBox[3].x, t2.boundingBox[3].y)) { 
		c = true;
	}
	return c;
}

function t2collision(){
	let c = t_windowCollision(t2);
	//с блоками стен
	walls.forEach((w, index) => {
			if (t_recCollision(t2, w.x,w.y, w.x+w.width,w.y, w.x+w.width,w.y+w.height, w.x,w.y+w.height)) { 
			c = true;
		}
	})
	//с танком
	if (t_recCollision(t1, t2.boundingBox[0].x, t2.boundingBox[0].y, t2.boundingBox[1].x, t2.boundingBox[1].y,
						   t2.boundingBox[2].x, t2.boundingBox[2].y, t2.boundingBox[3].x, t2.boundingBox[3].y)) { 
		c = true;
	}
	return c;
}

// ankBombCollision(a, b){
// 	const a_LeftTopX = a.x;
// 	const a_LeftTopY = a.y;
// 	const a_RightTopX = a.x + a.width;
// 	const a_RightTopY = a.y;
// 	const a_LeftBottomX = a.x;
// 	const a_LeftBottomY = a.y + a.height;
// 	const a_RightBottomX = a.x + a.width;
// 	const a_RightBottomY = a.y + a.height;

// 	const b_LeftTopX = b.x;
// 	const b_LeftTopY = b.y;
// 	const b_RightTopX = b.x + b.width;
// 	const b_RightTopY = b.y;
// 	const b_LeftBottomX = b.x;
// 	const b_LeftBottomY = b.y + b.height;
// 	const b_RightBottomX = b.x + b.width;
// 	const b_RightBottomY = b.y + b.height;
// t
// 	const d11_x = 
// 	const d12_x =
// 	const d13_x =
// 	const d14_x =


// 	const collision = b_LeftX < a_LeftTopX && a_LeftTopX < b_RightX &&
// 					  b_TopY < a_LeftTopY 	&& a_LeftTopY < b_BottomY ||
// 					  b_LeftX < a_RightTopX && a_RightTopX < b_RightX &&
// 					  b_TopY < a_RightTopY 	&& a_RightTopY < b_BottomY ||
// 					  b_LeftX < a_LeftBottomX && a_LeftBottomX < b_RightX &&
// 					  b_TopY < a_LeftBottomY 	&& a_LeftBottomY < b_BottomY ||
// 					  b_LeftX < a_RightBottomX && a_RightBottomX < b_RightX &&
// 					  b_TopY < a_RightBottomY 	&& a_RightBottomY < b_BottomY
// 	return collision;
// }


const bombToTankSound = new Audio('sound/mixkit-hitting-metal-armor-2775.wav');
const bombToPerimetrSound = new Audio('sound/mixkit-sword-pierces-armor-2761.wav');
const tankToTankSound = new Audio('sound/mixkit-knife-fast-hit-2184.wav');
const tankExplosionSound = new Audio('sound/mixkit-explosion-with-rocks-debris-1703.wav');
const ambientSound = new Audio('sound/8-bit launge.mp3');
ambientSound.loop = true;
ambientSound.play();

// Если браузер блокирует автоматическое воспроизведение аудио/видео на сайте, вы можете вручную дать разрешение. Вот как это сделать в популярных браузерах:

//1. Разрешить автовоспроизведение в Google Chrome
// Откройте настройки сайта:
// Нажмите на 🔒 (замок) в адресной строке → "Настройки сайта" (или "Site Settings").
// Либо введите в адресную строку:
// chrome://settings/content/sound
// Разрешите автовоспроизведение:
// В разделе "Автовоспроизведение" выберите "Разрешить" (или добавьте сайт в исключения).
// Можно также выбрать "Ограничить", но добавить нужный сайт в список разрешённых.
// Проверьте настройки звука:
// Убедитесь, что сайт не заблокирован в разделе "Звук" (chrome://settings/content/sound)

// 2. Разрешить автовоспроизведение в Mozilla Firefox
//     Откройте настройки:
//         Введите в адресную строку:
//     about:preferences#privacy
//     Прокрутите до "Разрешения" → "Настроить" рядом с "Автовоспроизведение".
// Добавьте сайт в исключения:
//     Выберите "Разрешить аудио и видео" для нужного сайта.

// 3. Разрешить автовоспроизведение в Microsoft Edge
//     Перейдите в настройки сайта:
//         Введите в адресную строку:
//         edge://settings/content/mediaAutoplay
//     Выберите "Разрешить" или добавьте сайт в исключения.

// 4. Разрешить автовоспроизведение в Safari (macOS/iOS)
//     Откройте Safari → Настройки → Веб-сайты.
//     Выберите "Автовоспроизведение" и разрешите его для нужного сайта.

// Если проблема остаётся
//     Обновите страницу после изменения настроек.
//     Попробуйте отключить блокировщики рекламы (например, uBlock Origin, AdBlock).
//     Проверьте, не отключён ли JavaScript для сайта.
// После этих действий сайт сможет воспроизводить медиа без ошибки play() method is not allowed. 🎧

function triggerExplosion(element) {
	const bomb = element.svg.querySelector('.bomb');//ищем по названию класса
	const bombText = element.svg.querySelector('.bomb_id_text');//ищем по названию класса
	const explosion = element.svg.querySelector('.explosion');//ищем по названию класса
	const animation = explosion.animate([
	  { transform: 'scale(1)', opacity: 1 },
	  { transform: 'scale(1.5)', opacity: 0.8, filter: 'brightness(2)' },
	  { transform: 'scale(0.5)', opacity: 0, filter: 'brightness(5)' }
	], {
	  duration: 1000,
	  easing: 'ease-out',
	  fill: 'forwards'
	});

	// const animation = explosion.animate([
	// 	{ opacity: 1 },
	//   ], {
	// 	duration: 1000,
	// 	fill: 'forwards'
	//   });
	//explosion.style.opacity = 1;
	bomb.style.opacity = 0;
	bombText.style.opacity = 0;
	element.exploding = true;

	animation.finished.then(() => {
		//freeBomb(element); //освобождаем снаряд
		element.exploding = false;
	  });
  }


// function freeBomb(element){
// 	const bomb = element.svg.querySelector('.bomb');//ищем по названию класса
// 	const bombText = element.svg.querySelector('.bomb_id_text');//ищем по названию класса
// 	//const explosion = element.svg.querySelector('.explosion');//ищем по названию класса
// 	bomb.style.opacity = 1;
// 	bombText.style.opacity = 1;
// 	element.x = -100;
// 	element.svg.style.transform = `translate(${element.x}px, ${element.y}px)`;//прячем за пределы экрана
// }

function triggerTankExplosion(element) {
	//const tankExplosionSVG = document.getElementById('tankExplosion');
	let tankExplosionSVG;
	if(element == t1) tankExplosionSVG = tank1ExplosionSVG;
	else tankExplosionSVG = tank2ExplosionSVG;

	tankExplosionSVG.style.transform = `translate(${element.x + element.center.x - 100}px, ${element.y + element.center.y - 100}px)`;//100,100 - это центр картинки explosion 
	const circles = tankExplosionSVG.querySelectorAll('.particles');//ищем по названию класса
	//console.log(`circles.length: ${circles.length}`);
	circles.forEach((circle, index) => {
		const randomDistance = Math.random()*100;//0-100
		const randomAngle = Math.random()*360;//0-360
		const randomX = Math.cos(randomAngle)*randomDistance;
		const randomY = Math.sin(randomAngle)*randomDistance;
		const randomRotation = (Math.random() - 0.5)*2*360;//+- 360
		const animation = circle.animate([
		{ transform: 'translate(0, 0) scale(1)', opacity: 1 },
		{ transform: `translate(${randomX/5}px, ${randomY/5}px) rotate(${randomRotation/5}deg) scale(2)`, offset: 0.2}, //offset указывает на каком проценте анимации должен быть достигнут ключевой кадр.
		{ transform: `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg) scale(0.5)`, opacity: 0.7}
		], {
		duration: 1500,//длительность анимации (милисекунд)
		easing: 'ease-out',//определяет скорость течения анимации (вначале быстро, в конце медленно)
		fill: 'forwards'//после анимации объект будет иметь стили последнего кадра
		});

		//bomb.style.opacity = 0;
		//bombText.style.opacity = 0;
		element.exploding = true;

		animation.finished.then(() => {
			element.exploding = false;
		});
	})
  }


function updateAnts() {
	
	// if(updateFunctionIsBusy){ //если функция работает, а мы её еще раз вызвали, то выходим. (проверка, вдруг не успевает выполниться за один кадр а уже пора выполняться для следующего кадра).
	// 	frameDropN += 1; //количество пропущеных кадров (для отображения).
	// 	return;
	// }
	//updateFunctionIsBusy = true; //ставим признак что функция еще работает
	//frameN += 1;//счетчик кадров отрисованых
	let lastTimeCode = performance.now();
	//frameNText.textContent = `кадр: ${frameN}`;
	
	//FPS
	//-----------
	const now = performance.now(); // Текущее время
	const OneSecDelta = now - lastTimeOneSec; // Время, прошедшее с последнего кадра
	
	const delta = now - lastTime; // Время, прошедшее с последнего кадра
	fpsDT.textContent = `FPS дельта Т: ${delta.toFixed(2)}`;
	if(fpsMaxDelta < delta) {
		fpsMaxDelta = delta;
		fpsMaxDT.textContent = `FPS макс.дельта Т: ${fpsMaxDelta.toFixed(2)}`;
	}


	lastTime = now; 
	
	frameCount++; // Увеличиваем счётчик кадров

	// Если прошла секунда, обновляем FPS
	if (OneSecDelta >= 1000) {
		fps = frameCount; // FPS равно количеству кадров за последнюю секунду
		frameCount = 0; // Сбрасываем счётчик кадров
		lastTimeOneSec = now; // Обновляем время последнего кадра
	}
	// Обновляем текст на экране
    fpsDisplay.textContent = `FPS: ${fps}`;

	//если нажата клавиша R, то сбрасываем показания макс.дельта Т.
	if(keyR_pressed){
		fpsMaxDelta = 0;
 		codeMaxDelta = 0;
	}
	//-------

	
	



// 	//муравьи
//   ants.forEach((ant, index) => {
//     let dx = 0;
//     let dy = 0;

//     const antCenterX = ant.x + antSize / 2;
//     const antCenterY = ant.y + (antSize * 73 / 46) / 2; 

//     const distanceToMouse = Math.sqrt(Math.pow(mousex - antCenterX, 2) + Math.pow(mousey - antCenterY, 2));
    
//     if (distanceToMouse <= followRadius) {
//       const randomFactor = 0.01 + Math.random() * 0.01; // Случайное изменение скорости
//       dx = (mousex - antCenterX) * randomFactor; // Движение к курсору
//       dy = (mousey - antCenterY) * randomFactor;
//       ant.angle = Math.atan2(dy, dx) * 180 / Math.PI; // Поворот к курсору
//     } else {
//       dx = Math.cos(ant.angle * Math.PI / 180) * ant.speed;
//       dy = Math.sin(ant.angle * Math.PI / 180) * ant.speed;
//       ant.angle += (Math.random() - 0.5) * 10;
//     }

//     ants.forEach((otherAnt, otherIndex) => {
//       if (index !== otherIndex) {
//         const otherAntCenterX = otherAnt.x + antSize / 2;
//         const otherAntCenterY = otherAnt.y + (antSize * 73 / 46) / 2;
//         const dist = Math.sqrt(Math.pow(antCenterX - otherAntCenterX, 2) + Math.pow(antCenterY - otherAntCenterY, 2));
//         if (dist < avoidRadius) {
//           const avoidStrength = (avoidRadius - dist) / avoidRadius;
//           dx -= (otherAntCenterX - antCenterX) / dist * avoidStrength * 3;
//           dy -= (otherAntCenterY - antCenterY) / dist * avoidStrength * 3;
//         }
//       }
//     });

//     ant.x += dx;
//     ant.y += dy;

//     // Обработка столкновений с краями экрана
//     if (ant.x < 0 || ant.x > window.innerWidth - antSize || ant.y < 0 || ant.y > window.innerHeight - (antSize * 73 / 46)) {
//       ant.angle += 180; // Разворот
//       ant.x = Math.max(0, Math.min(ant.x, window.innerWidth - antSize));
//       ant.y = Math.max(0, Math.min(ant.y, window.innerHeight - (antSize * 73 / 46)));
//     }

//     ant.element.style.left = `${ant.x}px`;
//     ant.element.style.top = `${ant.y}px`;

//     let angle = ant.angle + 90; // Корректировка угла поворота
//     ant.element.style.transform = `rotate(${angle}deg)`;
//   });	
	









	//танки
	//T1
	if(t1.destroyed==false && gameStatus != "бой закончен!"){

		if(T1bLeft_pressed) t1.b_angle -= 1;
		if(T1bRight_pressed) t1.b_angle += 1;
		t1.k_angleSpeed = 0;
		if(T1Left_pressed) t1.k_angleSpeed = -1; //через скорость а не напрямую, чтобы при коллизиях можно было вернуть обратно
		if(T1Right_pressed) t1.k_angleSpeed = 1;
		t1.speed = 0;
		if(T1Forward_pressed){
			t1.speed = 1;
		}
		if(T1Backward_pressed){
			t1.speed = -1;
		}
		//фронт нажатия
		T1Fire_pressed_front = (!T1Fire_pressed_previous && T1Fire_pressed) ? true : false;
		T1Fire_pressed_previous = T1Fire_pressed;
		//выстрел
		if(T1Fire_pressed_front){
			//cloneBomb();
			shot(t1,t1BombsPool);
		}

		//повторно используем dx и dy теперь для танков
		t1.k_angle += t1.k_angleSpeed;

		let dx = Math.cos(t1.k_angle * Math.PI / 180) * t1.speed;
		let dy = Math.sin(t1.k_angle * Math.PI / 180) * t1.speed;
		
		t1.x += dx;
		t1.y += dy;
		recalcBoundingBox(t1);
		if(t1collision()){
			tankToTankSound.play(); //наезд на периметр, стену, другой танк
			t1.x -= dx;
			t1.y -= dy;
			t1.k_angle -= t1.k_angleSpeed;
			recalcBoundingBox(t1);
		}
		t1.svg_t.style.transform = `translate(${t1.x}px, ${t1.y}px) rotate(${t1.k_angle}deg)`;
		t1.svg_hp.style.transform = `translate(${t1.x}px, ${t1.y-30}px)`; 
		//здесь 35 и 25 - расстояние до центра башни относительно левого верхнего угла корпуса (родительского svg).
		//(20 - смещение по x, плюс 15 до центра башни; 10 - смещение по y, плюс 15 до центра башни)
		t1.svg_tb.style.transform = `translate(35px, 35px) rotate(${t1.b_angle}deg) translate(-35px, -35px)`;
		//t1.kRect = t1.svg_tk.getBoundingClientRect(); //после перемещения, пересчитываем BoundingRectangle корпуса танка
	}
	
	
	//Т2
	if(t2.destroyed==false && gameStatus != "бой закончен!"){

		if(T2bLeft_pressed) t2.b_angle -= 1;
		if(T2bRight_pressed) t2.b_angle += 1;
		t2.k_angleSpeed = 0;
		if(T2Left_pressed) t2.k_angleSpeed = -1;
		if(T2Right_pressed) t2.k_angleSpeed = 1;
		t2.speed = 0;
		if(T2Forward_pressed){
			t2.speed = 1;
		}
		if(T2Backward_pressed){
			t2.speed = -1;
		}
		//фронт нажатия
		T2Fire_pressed_front = (!T2Fire_pressed_previous && T2Fire_pressed) ? true : false;
		T2Fire_pressed_previous = T2Fire_pressed;
		//выстрел
		if(T2Fire_pressed_front){
			//cloneBomb();
			shot(t2, t2BombsPool);
		}

		t2.k_angle += t2.k_angleSpeed;

		let dx = Math.cos(t2.k_angle * Math.PI / 180) * t2.speed;
		let dy = Math.sin(t2.k_angle * Math.PI / 180) * t2.speed;
		
		t2.x += dx;
		t2.y += dy;
		recalcBoundingBox(t2);
		if(t2collision()){
			tankToTankSound.play(); //наезд на периметр, стену, другой танк
			t2.x -= dx;
			t2.y -= dy;
			t2.k_angle -= t2.k_angleSpeed;
			recalcBoundingBox(t2);
		}
		t2.svg_t.style.transform = `translate(${t2.x}px, ${t2.y}px) rotate(${t2.k_angle}deg)`;
		t2.svg_hp.style.transform = `translate(${t2.x}px, ${t2.y-30}px)`; 
		//здесь 35 и 25 - расстояние до центра башни относительно левого верхнего угла корпуса (родительского svg).
		//(20 - смещение по x, плюс 15 до центра башни; 10 - смещение по y, плюс 15 до центра башни)
		t2.svg_tb.style.transform = `translate(35px, 35px) rotate(${t2.b_angle}deg) translate(-35px, -35px)`;
		//t2.kRect = t2.svg_tk.getBoundingClientRect();//после перемещения, пересчитываем BoundingRectangle корпуса танка
	}

	//снаряды
	const bombsToDelete = [];
	//const antsToDelete = [];
	const t1flyingBombs = t1BombsPool.filter((bomb) => bomb.flying === true);
	const t2flyingBombs = t2BombsPool.filter((bomb) => bomb.flying === true);
	const flyingBombs = [...t1flyingBombs, ...t2flyingBombs];
	flyingBombs.forEach((bomb, index) => {
		let dx = Math.cos(bomb.angle * Math.PI / 180) * bomb.speed; //вниз - положительный угол, вверх - отрицательный. вправо = 0.
		let dy = Math.sin(bomb.angle * Math.PI / 180) * bomb.speed;

		bomb.x += dx;
		bomb.y += dy;
		bomb.svg.style.transform = `translate(${bomb.x}px, ${bomb.y}px)`;
		//recalcBoundingBox(bomb);

		// Обработка столкновений
		//с краями экрана
		if (bomb.x < 0 || bomb.x > window.innerWidth - 10 || bomb.y < 0 || bomb.y > window.innerHeight - 10) { //размер снаряда 10 на 10.
			bombsToDelete.push(bomb);
			bombToPerimetrSound.play();
		}
		//с блоками стен
		walls.forEach((wall, index) => {
			if (rectCollision(bomb, wall)) { 
				bombsToDelete.push(bomb);
				bombToPerimetrSound.play();
			}
		})
	
		
		// //столкновения с муравьями
		// const bombRect = bomb.svg.getBoundingClientRect();
		// ants.forEach((ant, index) => {
		// 	const antRect = ant.element.getBoundingClientRect();
		// 	if (collision(bombRect, antRect)) { //размер снаряда 10 на 10.
		// 		//ant.element.style.fill = 'red';
		// 		ant.element.setAttribute('fill', 'red');
		// 		//ant.element.setAttribute('display', 'none');
		// 		ant.element.style.display = 'none'; // Делаем элемент невидимым
		// 		//debugger
		// 		antsToDelete.push(ant);
		// 		bombsToDelete.push(bomb);
		// 	}
		// });	
	});

	//с танками
	t1flyingBombs.forEach((bomb, index) => {
			if (bombTankCollision(bomb, t2)) { 
				bombsToDelete.push(bomb);
				t2.hp -=20;
				bombToTankSound.play();
			}
	});
	t2flyingBombs.forEach((bomb, index) => {
			if (bombTankCollision(bomb, t1)) { 
				bombsToDelete.push(bomb);
				t1.hp -=20;
				bombToTankSound.play();
			}
	});	

	bombsToDelete.forEach((bombToDelete, index) => {
		//bombToDelete.svg.style.display = 'none'; // Делаем элемент невидимым
		triggerExplosion(bombToDelete);
		//bombToDelete.x = -100;
		bombToDelete.speed = 0;
		bombToDelete.flying = false;
		bombToDelete.svg.style.transform = `translate(${bomb.x}px, ${bomb.y}px)`;//прячем за пределы экрана
	});
	
	//взрыв танка
	t1.destroyedFront = false;
	if (t1.hp <= 0 && t1.prevHp > 0) {
		t1.destroyedFront = true;
		tankExplosionSound.play(); 
		triggerTankExplosion(t1);
	}
	t1.prevHp = t1.hp;

	t2.destroyedFront = false;
	if (t2.hp <= 0 && t2.prevHp > 0) { 
		t2.destroyedFront = true; 
		tankExplosionSound.play();
		triggerTankExplosion(t2);
	}
	t2.prevHp = t2.hp;

	t1.destroyed = t1.hp <= 0;
	t2.destroyed = t2.hp <= 0;

	//завершение игры
	if((t1.destroyedFront || t2.destroyedFront) && gameStatus != "завершение игры"){
		gameStatus = "завершение игры"; //по фронту, чтобы когда игра закончилась, эта строка не затирала статус "игра окончена"
		startGameEndingTime = performance.now();
	} 
	if(gameStatus == "завершение игры" && gameEndingTime >= 10){
		gameStatus = "бой закончен!"
		let titleString="";
		let noticeString="";
		if(t1.destroyed==true && t2.destroyed==false){
			titleString = "Победил Танк2 !!!";
			noticeString = `с сохраненным HP: ${t2.hp.toFixed(0)}`;
		} 
		if(t1.destroyed==false && t2.destroyed==true){
			titleString = "Победил Танк1 !!!";
			noticeString = `с сохраненным HP: ${t1.hp.toFixed(0)}`;
		} 
		if(t1.destroyed==true && t2.destroyed==true){
			titleString = "Ничья. )))";
		} 
		//alert(alertString);
		showWinPopup(titleString, noticeString);
	}

	t1.bText.textContent = t1BombsPool.filter((bomb) => bomb.flying === false && bomb.exploding === false).length.toString();
	t2.bText.textContent = t2BombsPool.filter((bomb) => bomb.flying === false && bomb.exploding === false).length.toString();
	t1.hpText.textContent = t1.hp;
	t2.hpText.textContent = t2.hp;
	t1HP.textContent = t1.hp;
	t2HP.textContent = t2.hp;
	gameStatusDOMElement.textContent = gameStatus;
	
	//отсчет времени игры
	if(gameStatus != "бой закончен!"){
    	gameTime = (performance.now() - startTime) / 1000; // Переводим в секунды
	}
    gameTimeDOMElement.textContent = gameTime.toFixed(0) + ' сек';

	//отсчет времени завершения игры
	if(gameStatus == "завершение игры") {
		gameEndingTime = (performance.now() - startGameEndingTime) / 1000; // Переводим в секунды
	}
    gameEndingTimeDOMElement.textContent = gameEndingTime.toFixed(0) + ' сек';

	//bombsOnDisplayNText.textContent = `количество снарядов на дисплее: ${flyingBombs.length}`;
	//frameDropNText.textContent = `пропущено кадров: ${frameDropN}`; 
	const codeDelta = performance.now() - lastTimeCode;
	codeDT.textContent = `код дельта Т: ${codeDelta.toFixed(2)}`;
	if(codeMaxDelta < codeDelta){
		codeMaxDelta = codeDelta;
		codeMaxDT.textContent = `код макс.дельта Т: ${codeMaxDelta.toFixed(2)}`;
	}
  requestAnimationFrame(updateAnts);
  //updateFunctionIsBusy = false; //сбрасываем признак что функция работает
}

updateAnts();