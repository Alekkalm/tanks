//получаем первый танк
const svg_t1k = document.getElementById('t1k'); 
const svg_t1b = document.getElementById('t1b');
svg_t1k.style.transformOrigin = 'center center';
svg_t1b.style.transformOrigin = '0 0';
const t1 = {
    svg_t1k: svg_t1k,
	svg_t1b: svg_t1b,
    x: 0,
    y: 0,
    angle: 0,
    speed: 1,
  };



//строка для получения SVG
const antTemplate = document.getElementById('ant-template'); // Находим шаблон

let mousex = -1000;
let mousey = -1000;
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
  }
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
  }
});

function updateAnts() {
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
	
	
	if(keyA_pressed) t1.x -= 0.1;
	if(keyD_pressed) t1.x += 0.1;
	if(keyW_pressed) t1.y -= 0.1;
	if(keyS_pressed) t1.y += 0.1;
	if(ArrowLeft_pressed) t1.angle -= 0.1;
	if(ArrowRight_pressed) t1.angle += 0.1;
	
	//t1.x += 1;
    //t1.y += 1;
	//t1.angle += 1;
	t1.svg_t1k.style.transform = `translate(${t1.x}px, ${t1.y}px)rotate(${t1.angle}deg)`;
	//                                                           |смещение башни по y| |центр вращения башни 35px, 15px|
	t1.svg_t1b.style.transform = `translate(${t1.x}px, ${t1.y}px) translate(0px, 10px) translate(35px, 15px) rotate(${t1.angle}deg) translate(-35px, -15px)`;
  });

  requestAnimationFrame(updateAnts);
}

updateAnts();