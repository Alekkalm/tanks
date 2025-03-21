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
const svg_t1k = document.getElementById('t1k'); 
const svg_t1b = document.getElementById('t1b');
svg_t1k.style.transformOrigin = 'center center'; //только для поворотов (относительно центра)
svg_t1b.style.transformOrigin = '0 0'; //только для поворотов (относительно левого верхнего угла)
const t1 = {
    svg_t1k: svg_t1k,
	svg_t1b: svg_t1b,
    x: 0, //левый верхний угол
    y: 0, //левый верхний угол
    k_angle: 0, //0 = влево
	b_angle: 0, //0 = влево
    speed: 0,
  };




  //снаряды
const BombsNum = 50;
const bombsPool = [];
const bombTemplate = document.getElementById('bomb'); // Находим шаблон
for (let i = 0; i < BombsNum; i++) {
	
	const bombSVG = bombTemplate.cloneNode(true); // Клонируем шаблон
	bombSVG.removeAttribute('id'); // Убираем id, чтобы не было дубликатов
	bombSVG.style.display = 'none'; // Делаем элемент видимым
	bombSVG.style.transformOrigin = 'center center';
	const bombIdText = bombSVG.querySelector('.bomb_id_text');//ищем по названию класса
	bombIdText.textContent = i;
	document.body.appendChild(bombSVG);
  
	bombsPool.push({
	  svg: bombSVG,
	  x: i * 10,
	  y: 10,
	  angle: 0,
	  speed: 0,
	  busy: false, //занят или свободен
	});
  }







//муравьи
//строка для получения SVG
const antTemplate = document.getElementById('ant-template'); // Находим шаблон

const ants = [];
const numAnts = 50;
const antSize = 20; 
const avoidRadius = 25; 
const followRadius = 150; 

for (let i = 0; i < numAnts; i++) {
	
	const antElem = antTemplate.cloneNode(true); // Клонируем шаблон
	antElem.removeAttribute('id'); // Убираем id, чтобы не было дубликатов
	antElem.style.display = 'block'; // Делаем элемент видимым
	
	antElem.style.position = 'absolute';
	antElem.setAttribute('width', `${antSize}px`);  
	antElem.setAttribute('height', `${(antSize * 73 / 46)}px`); // Сохранение пропорций
	antElem.style.transformOrigin = 'center center';
	document.body.appendChild(antElem);
  
	ants.push({
	  element: antElem,
	  x: Math.random() * (window.innerWidth - antSize),
	  y: Math.random() * (window.innerHeight - (antSize * 73 / 46)),
	  angle: Math.random() * 360,
	  speed: 1 + Math.random() * 2,
	  followMouse: false,
	});
  }




//--------------------------------------------------------
//отладка. получаем размеры муравья
antTemplate.style.transform = `translate(${500}px, ${300}px) rotate(${45}deg)`;

const antWidth = antTemplate.getAttribute('width') //получаем размеры SVG. похоже что тоже без учета трансформации. (на rotate не реагирует).
const antHeight = antTemplate.getAttribute('height'); 
console.log(`antWidth: ${antWidth}, antHeight: ${antHeight}`);

// Получаем bounding box группы
const bbox = antTemplate.getBBox(); //получаем размеры и координаты bounding box элемента SVG до применения любых трансформаций
console.log(`x: ${bbox.x}, y: ${bbox.y}, width: ${bbox.width}, height: ${bbox.height}`);

//получаем 

/*Метод getBoundingClientRect() возвращает объект DOMRect, который содержит координаты и размеры элемента с учетом всех трансформаций: 
*    x, y — координаты верхнего левого угла элемента относительно viewport.
*    width, height — размеры элемента.
*    top, right, bottom, left — координаты границ элемента относительно viewport.
*Важно:
*    getBoundingClientRect() учитывает все трансформации, включая translate, rotate, scale и другие.
*/	
const rect = antTemplate.getBoundingClientRect();
console.log(rect); // { x, y, width, height, top, right, bottom, left }
//получаем размер новой коробки, которая увеличилась из-за поворота муравья.
//отладка. конец.
//-----------------------------------------------------------











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
let ArrowUp_pressed = false;
let ArrowDown_pressed = false;
let ArrowLeft_pressed = false;
let ArrowRight_pressed = false;
let Space_pressed = false;
let Space_pressed_previous = false;
let Space_pressed_front = false;
let keyR_pressed = false;

// Обработчик события нажатия клавиши
document.addEventListener('keydown', (event) => {
  switch (event.code) {
	case 'KeyA': keyA_pressed = true; break; 
    case 'KeyW': keyW_pressed = true; break; 
    case 'KeyS': keyS_pressed = true; break;
    case 'KeyD': keyD_pressed = true; break;
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
	case 'ArrowUp': ArrowUp_pressed = false; break; 
    case 'ArrowDown': ArrowDown_pressed = false; break; 
    case 'ArrowLeft': ArrowLeft_pressed = false; break;
    case 'ArrowRight': ArrowRight_pressed = false; break;
	case 'Space': Space_pressed = false; break;
	case 'KeyR': keyR_pressed = false; break; 
  }
});







function shot(){
	const bomb = bombsPool.find((bomb) => bomb.busy === false);
	if(bomb !== undefined){
		let sumAngle = t1.k_angle + t1.b_angle;
		let dx = Math.cos(sumAngle * Math.PI / 180) * 35; //35 - это длинна дула (от центра башни до конца дула). Чтобы снаряд появлялся на конце дула.
		let dy = Math.sin(sumAngle * Math.PI / 180) * 35; //вниз - положительный угол, вверх - отрицательный. вправо = 0.

		bomb.x = t1.x + 30 + dx; //+30 - это центр танка
		bomb.y = t1.y + 20 + dy; //+20 - центр танка
		bomb.angle = sumAngle;//bombAngle,
		bomb.speed = 2;
		bomb.busy = true;
		bomb.svg.style.display = 'block'; // Делаем элемент видимым
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

	
	



	//муравьи
  ants.forEach((ant, index) => {
    let dx = 0;
    let dy = 0;

    const antCenterX = ant.x + antSize / 2;
    const antCenterY = ant.y + (antSize * 73 / 46) / 2; 

    const distanceToMouse = Math.sqrt(Math.pow(mousex - antCenterX, 2) + Math.pow(mousey - antCenterY, 2));
    
    if (distanceToMouse <= followRadius) {
      const randomFactor = 0.01 + Math.random() * 0.01; // Случайное изменение скорости
      dx = (mousex - antCenterX) * randomFactor; // Движение к курсору
      dy = (mousey - antCenterY) * randomFactor;
      ant.angle = Math.atan2(dy, dx) * 180 / Math.PI; // Поворот к курсору
    } else {
      dx = Math.cos(ant.angle * Math.PI / 180) * ant.speed;
      dy = Math.sin(ant.angle * Math.PI / 180) * ant.speed;
      ant.angle += (Math.random() - 0.5) * 10;
    }

    ants.forEach((otherAnt, otherIndex) => {
      if (index !== otherIndex) {
        const otherAntCenterX = otherAnt.x + antSize / 2;
        const otherAntCenterY = otherAnt.y + (antSize * 73 / 46) / 2;
        const dist = Math.sqrt(Math.pow(antCenterX - otherAntCenterX, 2) + Math.pow(antCenterY - otherAntCenterY, 2));
        if (dist < avoidRadius) {
          const avoidStrength = (avoidRadius - dist) / avoidRadius;
          dx -= (otherAntCenterX - antCenterX) / dist * avoidStrength * 3;
          dy -= (otherAntCenterY - antCenterY) / dist * avoidStrength * 3;
        }
      }
    });

    ant.x += dx;
    ant.y += dy;

    // Обработка столкновений с краями экрана
    if (ant.x < 0 || ant.x > window.innerWidth - antSize || ant.y < 0 || ant.y > window.innerHeight - (antSize * 73 / 46)) {
      ant.angle += 180; // Разворот
      ant.x = Math.max(0, Math.min(ant.x, window.innerWidth - antSize));
      ant.y = Math.max(0, Math.min(ant.y, window.innerHeight - (antSize * 73 / 46)));
    }

    ant.element.style.left = `${ant.x}px`;
    ant.element.style.top = `${ant.y}px`;

    let angle = ant.angle + 90; // Корректировка угла поворота
    ant.element.style.transform = `rotate(${angle}deg)`;
  });	
	









	//танки
	//if(keyA_pressed) t1.x -= 0.1;
	//if(keyD_pressed) t1.x += 0.1;
	if(keyA_pressed) t1.b_angle -= 1;
	if(keyD_pressed) t1.b_angle += 1;
	//if(keyW_pressed) t1.y -= 0.1;
	//if(keyS_pressed) t1.y += 0.1;
	if(ArrowLeft_pressed) t1.k_angle -= 1;
	if(ArrowRight_pressed) t1.k_angle += 1;
	t1.speed = 0;
	if(ArrowUp_pressed){
		t1.speed = 1;
	}
	if(ArrowDown_pressed){
		t1.speed = -1;
	}
	//фронт нажатия
	Space_pressed_front = (!Space_pressed_previous && Space_pressed) ? true : false;
	Space_pressed_previous = Space_pressed;
	//выстрел
	if(Space_pressed){
		//cloneBomb();
		shot();
	}
	
	
	
	//повторно используем dx и dy теперь для танков
	let dx = Math.cos(t1.k_angle * Math.PI / 180) * t1.speed;
    let dy = Math.sin(t1.k_angle * Math.PI / 180) * t1.speed;
	
	t1.x += dx;
    t1.y += dy;


	t1.svg_t1k.style.transform = `translate(${t1.x}px, ${t1.y}px)rotate(${t1.k_angle}deg)`;
	//                                                          |центр вращения башни 15px, 15px|
	t1.svg_t1b.style.transform = `translate(${t1.x}px, ${t1.y}px) translate(15px, 15px) rotate(${t1.k_angle + t1.b_angle}deg) translate(-15px, -15px)`;

	//снаряды
	const bombsToDelete = [];
	const antsToDelete = [];
	const busyBombs = bombsPool.filter((bomb) => bomb.busy === true);
	busyBombs.forEach((bomb, index) => {
		let dx = Math.cos(bomb.angle * Math.PI / 180) * bomb.speed; //вниз - положительный угол, вверх - отрицательный. вправо = 0.
		let dy = Math.sin(bomb.angle * Math.PI / 180) * bomb.speed;

		bomb.x += dx;
		bomb.y += dy;

		// Обработка столкновений с краями экрана
		if (bomb.x < 0 || bomb.x > window.innerWidth - 10 || bomb.y < 0 || bomb.y > window.innerHeight - 10) { //размер снаряда 10 на 10.
			bombsToDelete.push(bomb);
		}
		bomb.svg.style.transform = `translate(${bomb.x}px, ${bomb.y}px)`;
		
		
		//столкновения с муравьями
		const bombRect = bomb.svg.getBoundingClientRect();
		ants.forEach((ant, index) => {
			const antRect = ant.element.getBoundingClientRect();
			if (collision(bombRect, antRect)) { //размер снаряда 10 на 10.
				//ant.element.style.fill = 'red';
				ant.element.setAttribute('fill', 'red');
				//ant.element.setAttribute('display', 'none');
				ant.element.style.display = 'none'; // Делаем элемент невидимым
				//debugger
				antsToDelete.push(ant);
				bombsToDelete.push(bomb);
			}
		});	
	});

	bombsToDelete.forEach((bombToDelete, index) => {
		bombToDelete.svg.style.display = 'none'; // Делаем элемент невидимым
		bombToDelete.busy = false;
	});
	
	bombsOnDisplayNText.textContent = `количество снарядов на дисплее: ${bombsPool.filter((bomb) => bomb.busy === true).length}`;
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