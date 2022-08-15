import { useEffect } from 'react';

let timer;
let cursor = { x: 0, y: 0 };
let particles = [];

const applyProperties = (target, properties) => {
  for (const key in properties) {
    target.style[key] = properties[key];
  }
};

// Particles
class Particle {
  lifeSpan: number;
  initialStyles: any;
  velocity: { x: number; y: number };
  position: { x: number; y: number };
  element: HTMLElement;
  constructor() {
    this.lifeSpan = 20; //ms
    this.initialStyles = {
      'position': 'fixed',
      'display': 'block',
      'width': '12px',
      'height': '12px',
      'border-radius': '50%',
      'pointer-events': 'none',
      'backgroundColor': '#D61C11',
      'will-change': 'transform',
      'z-index': '9999999',
    };
  }
  init(x, y) {
    this.position = { x: x - 6, y: y - 6 };

    this.element = document.createElement('span');
    applyProperties(this.element, this.initialStyles);
    this.update();

    document.querySelector('.drawing-cursor')?.appendChild(this.element);
  }
  update() {
    this.lifeSpan--;

    this.element.style.transform =
      'translate3d(' + this.position.x + 'px,' + this.position.y + 'px, 0) scale(' + this.lifeSpan / 20 + ')';
    this.element.style.opacity = '0.5';
  }
  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}

const addParticle = (x, y) => {
  const particle = new Particle();
  particle.init(x, y);
  particles.push(particle);
};

const onMousemove = (e) => {
  cursor.x = e.clientX;
  cursor.y = e.clientY;

  addParticle(cursor.x, cursor.y);
};

const updateParticles = () => {
  // Updated particles
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }
  // Remove dead particles
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].lifeSpan < 0) {
      particles[i].destroy();
      particles.splice(i, 1);
    }
  }
};
const loop = () => {
  timer = requestAnimationFrame(loop);
  updateParticles();
};

const destroyDrawingCursor = () => {
  document.removeEventListener('mousemove', onMousemove);
  cancelAnimationFrame(timer);
  cursor = { x: 0, y: 0 };
  particles = [];
};
const mountDrawingCursor = () => {
  document.querySelector('.drawing-cursor').innerHTML = '';
  document.addEventListener('mousemove', onMousemove);
  loop();
};

export const useDrawingCursor = (isDrawing) => {
  useEffect(() => {
    if (isDrawing) {
      mountDrawingCursor();
    }
    return () => {
      destroyDrawingCursor();
    };
  }, [isDrawing]);
};
