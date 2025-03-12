//получаем первый танк
const t1shassi = fetch('svg/t1-shassi.SVG')
    .then(response => response.text())
    .then(svg => {
      document.getElementById('ant-template').innerHTML = svg;
    });






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
  });

  requestAnimationFrame(updateAnts);
}

updateAnts();