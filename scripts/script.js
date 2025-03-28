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
const bombsOnDisplayNText = document.getElementById('bombsOnDisplayN');
let frameDropN = 0;
let updateFunctionIsBusy = false;
const frameDropNText = document.getElementById('frameDropN'); 
let frameN = 0;
const frameNText = document.getElementById('frameN'); 

 







//танки
//получаем первый танк
const svg_t1 = document.getElementById('t1'); 
const svg_t1k = svg_t1.getElementById('t1k'); 
const svg_t1b = svg_t1.getElementById('t1b');
svg_t1.style.transformOrigin = 'center center'; //только для поворотов (относительно центра)
svg_t1b.style.transformOrigin = '0 0'; //только для поворотов (относительно левого верхнего угла)
const t1 = {
    svg_t: svg_t1,
	svg_tk: svg_t1k,
	svg_tb: svg_t1b,
    x: 0, //левый верхний угол
    y: 0, //левый верхний угол
    k_angle: 0, //0 = влево
	b_angle: 0, //0 = влево
    speed: 0,
	kRect: svg_t1k.getBoundingClientRect(), //DOMRect { x: 0, y: 10, width: 70, height: 50, top: 10, right: 70, bottom: 60, left: 0 }
  };                                        //если переместиться как t2, то: DOMRect { x: 1850, y: 10, width: 70, height: 50, top: 10, right: 1920, bottom: 60, left: 1850 }
//получаем второй танк
const svg_t2 = document.getElementById('t2'); 
const svg_t2k = svg_t2.getElementById('t2k'); 
const svg_t2b = svg_t2.getElementById('t2b');
svg_t2.style.transformOrigin = 'center center'; //только для поворотов (относительно центра)
svg_t2b.style.transformOrigin = '0 0'; //только для поворотов (относительно левого верхнего угла)
const t2 = {
    svg_t: svg_t2,
	svg_tk: svg_t2k,
	svg_tb: svg_t2b,
    x: window.innerWidth - 70, //правый верхний угол минус длину танка
    y: 0, //левый верхний угол
    k_angle: 180, //0 = влево
	b_angle: 0, //0 = влево
    speed: 0,
	kRect: svg_t2k.getBoundingClientRect(),
  };




  //снаряды
const BombsNum = 50;
const bombsPool = [];
const bombTemplate = document.getElementById('bomb'); // Находим шаблон
for (let i = 0; i < BombsNum; i++) {
	
	const bombSVG = bombTemplate.cloneNode(true); // Клонируем шаблон
	bombSVG.removeAttribute('id'); // Убираем id, чтобы не было дубликатов
	bombSVG.style.display = 'block'; // Делаем элемент видимым
	bombSVG.style.transformOrigin = 'center center';
	bombSVG.style.transform = `translate(-100px, 0px)`;//прячем за пределы экрана
	const bombIdText = bombSVG.querySelector('.bomb_id_text');//ищем по названию класса
	bombIdText.textContent = i;
	document.body.appendChild(bombSVG);
  
	bombsPool.push({
	  svg: bombSVG,
	  x: - 100, //уводим за пределы экрана
	  y: 0, 
	  angle: 0,
	  speed: 0,
	  flying: false, //в полете
	  exploding: false, //в процессе взрыва
	  
	});
  }







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
let keyA_pressed = false;
let keyW_pressed = false;
let keyS_pressed = false;
let keyD_pressed = false;
let keyQ_pressed = false;
let keyE_pressed = false;
let ShiftLeft_pressed = false;
let ShiftLeft_pressed_previous = false;
let ShiftLeft_pressed_front = false;

let T2Left_pressed = false;
let T2Forward_pressed = false;
let T2Backward_pressed = false;
let T2Right_pressed = false;
let T2bLeft_pressed = false;
let T2bRight_pressed = false;
let T2Fire_pressed = false;
let T2Fire_pressed_previous = false;
let T2Fire_pressed_front = false;

let ArrowUp_pressed = false;
let ArrowDown_pressed = false;
let ArrowLeft_pressed = false;
let ArrowRight_pressed = false;
let Space_pressed = false;
let Space_pressed_previous = false;
let Space_pressed_front = false;
let keyR_pressed = false;

//коды клавиш:
//https://www.w3.org/TR/uievents-code/#key-alphanumeric-section
// Обработчик события нажатия клавиши
document.addEventListener('keydown', (event) => {
  switch (event.code) {
	case 'KeyA': keyA_pressed = true; break; 
    case 'KeyW': keyW_pressed = true; break; 
    case 'KeyS': keyS_pressed = true; break;
    case 'KeyD': keyD_pressed = true; break;
	case 'KeyQ': keyQ_pressed = true; break;
    case 'KeyE': keyE_pressed = true; break;
	case 'ShiftLeft': ShiftLeft_pressed = true; break;

	case 'KeyK': T2Left_pressed = true; break; 
    case 'KeyO': T2Forward_pressed = true; break; 
    case 'KeyL': T2Backward_pressed = true; break;
    case 'Semicolon': T2Right_pressed = true; break;
	case 'KeyI': T2bLeft_pressed = true; break;
    case 'KeyP': T2bRight_pressed = true; break;
	//case 'ShiftRight': T2Fire_pressed = true; break;
	case 'AltRight': T2Fire_pressed = true; break;

	case 'ArrowUp': ArrowUp_pressed = true; break; 
    case 'ArrowDown': ArrowDown_pressed = true; break; 
    case 'ArrowLeft': ArrowLeft_pressed = true; break;
    case 'ArrowRight': ArrowRight_pressed = true; break;
	case 'Space': Space_pressed = true; break;
	case 'KeyR': keyR_pressed = true; break; 
  }
  //console.log(event.code);
});

// Обработчик события отпускания клавиши
document.addEventListener('keyup', (event) => {
  switch (event.code) {
	case 'KeyA': keyA_pressed = false; break; 
    case 'KeyW': keyW_pressed = false; break; 
    case 'KeyS': keyS_pressed = false; break;
    case 'KeyD': keyD_pressed = false; break;
	case 'KeyQ': keyQ_pressed = false; break;
    case 'KeyE': keyE_pressed = false; break;
	case 'ShiftLeft': ShiftLeft_pressed = false; break;

	case 'KeyK': T2Left_pressed = false; break; 
    case 'KeyO': T2Forward_pressed = false; break; 
    case 'KeyL': T2Backward_pressed = false; break;
    case 'Semicolon': T2Right_pressed = false; break;
	case 'KeyI': T2bLeft_pressed = false; break;
    case 'KeyP': T2bRight_pressed = false; break;
	//case 'ShiftRight': T2Fire_pressed = false; break;
	case 'AltRight': T2Fire_pressed = false; break;


	case 'ArrowUp': ArrowUp_pressed = false; break; 
    case 'ArrowDown': ArrowDown_pressed = false; break; 
    case 'ArrowLeft': ArrowLeft_pressed = false; break;
    case 'ArrowRight': ArrowRight_pressed = false; break;
	case 'Space': Space_pressed = false; break;
	case 'KeyR': keyR_pressed = false; break; 
  }
});







function shot(tank){
	const bomb = bombsPool.find((bomb) => bomb.flying === false && bomb.exploding === false );
	if(bomb !== undefined){
		let sumAngle = tank.k_angle + tank.b_angle;
		let dx = Math.cos(sumAngle * Math.PI / 180) * 35; //35 - это длинна дула (от центра башни до конца дула). Чтобы снаряд появлялся на конце дула.
		let dy = Math.sin(sumAngle * Math.PI / 180) * 35; //вниз - положительный угол, вверх - отрицательный. вправо = 0.

		bomb.x = tank.x + 30 + dx; //+30 - это центр танка
		bomb.y = tank.y + 30 + dy; //+30 - центр танка
		bomb.angle = sumAngle;//bombAngle,
		bomb.speed = 2;
		bomb.flying = true;
		//bomb.svg.style.display = 'block'; // Делаем элемент видимым
		const bombCircle = bomb.svg.querySelector('.bomb');//ищем по названию класса
		const bombText = bomb.svg.querySelector('.bomb_id_text');//ищем по названию класса
		//const explosion = bomb.svg.querySelector('.explosion');//ищем по названию класса
		bombCircle.style.opacity = 1;
		bombText.style.opacity = 1;
		//explosion.style.opacity = 0;
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


function updateAnts() {
	
	if(updateFunctionIsBusy){ //если функция работает, а мы её еще раз вызвали, то выходим. (проверка, вдруг не успевает выполниться за один кадр а уже пора выполняться для следующего кадра).
		frameDropN += 1; //количество пропущеных кадров (для отображения).
		return;
	}
	updateFunctionIsBusy = true; //ставим признак что функция еще работает
	frameN += 1;//счетчик кадров отрисованых
	let lastTimeCode = performance.now();
	frameNText.textContent = `кадр: ${frameN}`;
	
	//FPS
	//-----------
	const now = performance.now(); // Текущее время
	const OneSecDelta = now - lastTimeOneSec; // Время, прошедшее с последнего кадра
	
	const delta = now - lastTime; // Время, прошедшее с последнего кадра
	fpsDT.textContent = `FPS дельта Т: ${delta}`;
	if(fpsMaxDelta < delta) {
		fpsMaxDelta = delta;
		fpsMaxDT.textContent = `FPS макс.дельта Т: ${fpsMaxDelta}`;
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
	//if(keyA_pressed) t1.x -= 0.1;
	//if(keyD_pressed) t1.x += 0.1;
	if(keyQ_pressed) t1.b_angle -= 1;
	if(keyE_pressed) t1.b_angle += 1;
	//if(keyW_pressed) t1.y -= 0.1;
	//if(keyS_pressed) t1.y += 0.1;
	if(keyA_pressed) t1.k_angle -= 1;
	if(keyD_pressed) t1.k_angle += 1;
	t1.speed = 0;
	if(keyW_pressed){
		t1.speed = 1;
	}
	if(keyS_pressed){
		t1.speed = -1;
	}
	//фронт нажатия
	Space_pressed_front = (!Space_pressed_previous && Space_pressed) ? true : false;
	Space_pressed_previous = Space_pressed;
	//выстрел
	if(Space_pressed){
		//cloneBomb();
		shot(t1);
	}

	//повторно используем dx и dy теперь для танков
	let dx = Math.cos(t1.k_angle * Math.PI / 180) * t1.speed;
	let dy = Math.sin(t1.k_angle * Math.PI / 180) * t1.speed;
	
	t1.x += dx;
	t1.y += dy;
	t1.svg_t.style.transform = `translate(${t1.x}px, ${t1.y}px)rotate(${t1.k_angle}deg)`;
	//здесь 35 и 25 - расстояние до центра башни относительно левого верхнего угла корпуса (родительского svg).
	//(20 - смещение по x, плюс 15 до центра башни; 10 - смещение по y, плюс 15 до центра башни)
	t1.svg_tb.style.transform = `translate(35px, 35px) rotate(${t1.b_angle}deg) translate(-35px, -35px)`;
	t1.kRect = t1.svg_tk.getBoundingClientRect(); //после перемещения, пересчитываем BoundingRectangle корпуса танка
	
	//Т2
	if(T2bLeft_pressed) t2.b_angle -= 1;
	if(T2bRight_pressed) t2.b_angle += 1;
	if(T2Left_pressed) t2.k_angle -= 1;
	if(T2Right_pressed) t2.k_angle += 1;
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
	if(T2Fire_pressed){
		//cloneBomb();
		shot(t2);
	}

	//повторно используем dx и dy теперь для танков
	dx = Math.cos(t2.k_angle * Math.PI / 180) * t2.speed;
    dy = Math.sin(t2.k_angle * Math.PI / 180) * t2.speed;
	
	t2.x += dx;
    t2.y += dy;
	t2.svg_t.style.transform = `translate(${t2.x}px, ${t2.y}px)rotate(${t2.k_angle}deg)`;
	//здесь 35 и 25 - расстояние до центра башни относительно левого верхнего угла корпуса (родительского svg).
	//(20 - смещение по x, плюс 15 до центра башни; 10 - смещение по y, плюс 15 до центра башни)
	t2.svg_tb.style.transform = `translate(35px, 35px) rotate(${t2.b_angle}deg) translate(-35px, -35px)`;
	t2.kRect = t2.svg_tk.getBoundingClientRect();//после перемещения, пересчитываем BoundingRectangle корпуса танка


	//снаряды
	const bombsToDelete = [];
	const antsToDelete = [];
	const flyingBombs = bombsPool.filter((bomb) => bomb.flying === true);
	flyingBombs.forEach((bomb, index) => {
		let dx = Math.cos(bomb.angle * Math.PI / 180) * bomb.speed; //вниз - положительный угол, вверх - отрицательный. вправо = 0.
		let dy = Math.sin(bomb.angle * Math.PI / 180) * bomb.speed;

		bomb.x += dx;
		bomb.y += dy;

		// Обработка столкновений с краями экрана
		if (bomb.x < 0 || bomb.x > window.innerWidth - 10 || bomb.y < 0 || bomb.y > window.innerHeight - 10) { //размер снаряда 10 на 10.
			bombsToDelete.push(bomb);
		}
		bomb.svg.style.transform = `translate(${bomb.x}px, ${bomb.y}px)`;
		
		
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

	bombsToDelete.forEach((bombToDelete, index) => {
		//bombToDelete.svg.style.display = 'none'; // Делаем элемент невидимым
		triggerExplosion(bombToDelete);
		//bombToDelete.x = -100;
		bombToDelete.speed = 0;
		bombToDelete.flying = false;
		bombToDelete.svg.style.transform = `translate(${bomb.x}px, ${bomb.y}px)`;//прячем за пределы экрана
	});
	
	
	bombsOnDisplayNText.textContent = `количество снарядов на дисплее: ${bombsPool.filter((bomb) => bomb.flying === true).length}`;
	frameDropNText.textContent = `пропущено кадров: ${frameDropN}`; 
	const codeDelta = performance.now() - lastTimeCode;
	codeDT.textContent = `код дельта Т: ${codeDelta}`;
	if(codeMaxDelta < codeDelta){
		codeMaxDelta = codeDelta;
		codeMaxDT.textContent = `код макс.дельта Т: ${codeMaxDelta}`;
	}
  requestAnimationFrame(updateAnts);
  updateFunctionIsBusy = false; //сбрасываем признак что функция работает
}

updateAnts();