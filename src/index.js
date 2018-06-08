import {
  SMAAPass,
  RenderPass,
  EffectComposer,
} from 'postprocessing';
import * as THREE from 'three';
import Stats from 'stats-js';
import './style.css';

// global objects
let stats;
let scene;
let renderer;
let composer;
let camera;
const seeds = [];
let turnFraction = 16 / 10;

function setUpStats() {
  stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);
}

function setUpScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('rgb(255,255,255)');
}

function setUpRenderer() {
  const camFactor = 2;
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.innerWidth / window.innerHeight);

  camera = new THREE.OrthographicCamera(
    -window.innerWidth / camFactor,
    window.innerWidth / camFactor,
    window.innerHeight / camFactor,
    -window.innerHeight / camFactor,
    1,
    1000,
  );

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const pass = new SMAAPass(
    window.innerWidth * renderer.getPixelRatio(),
    window.innerHeight * renderer.getPixelRatio(),
  );
  pass.renderToScreen = true;
  composer.addPass(pass);

  window.addEventListener('resize', () => {
    // notify the renderer of the size change
    renderer.setSize(window.innerWidth, window.innerHeight);
    // update the camera
    camera.left = -window.innerWidth / camFactor;
    camera.right = window.innerWidth / camFactor;
    camera.top = window.innerHeight / camFactor;
    camera.bottom = -window.innerHeight / camFactor;
    camera.updateProjectionMatrix();
  });
}

function renderWindow() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  return renderer.domElement;
}

function getPositionOfSeed(num) {
  // console.log(`GETTING POSITION OF SEED ${num}`);
  const spacing = 1;
  const turnAmount = 360 * turnFraction;
  const totalTurn = num * turnAmount;
  // console.log(`TOTAL TURN: ${totalTurn}`);
  const distance = ((totalTurn / 360) * spacing) + spacing;
  // console.log(`DISTANCE: ${distance}`);
  const theta = totalTurn;
  // console.log(`THETA: ${theta}`);
  const thetaRadian = theta * (Math.PI / 180);
  // console.log(`THETA RADIAN: ${theta}`);
  return {
    x: distance * Math.cos(thetaRadian),
    y: distance * Math.sin(thetaRadian),
  };
}

// particle set up
function setUpSeeds() {
  const sphereCount = 1000;
  const sphereGeometry = new THREE.SphereGeometry(5, 10, 8);
  const bufferSphereGeometry = new THREE.BufferGeometry()
    .fromGeometry(sphereGeometry);

  for (let i = 0; i < sphereCount; i++) { // eslint-disable-line
    const object = new THREE.Mesh(
      bufferSphereGeometry,
      new THREE.PointsMaterial({ color: Math.random() * 0xffffff }),
    );
    const coords = getPositionOfSeed(i);
    object.position.x = coords.x;
    object.position.y = coords.y;
    object.position.z = -100;
    seeds.push(object);
    scene.add(object);
  }
}

function animate() {
  stats.begin();
  requestAnimationFrame(animate);
  seeds.map((seed, index) => {
    const coords = getPositionOfSeed(index, turnFraction);
    seed.position.x = coords.x;
    seed.position.y = coords.y;
    return seed;
  });
  turnFraction += 0.000001;
  composer.render();
  stats.end();
}


function init() {
  // Set Up Stats
  setUpStats();
  setUpScene();
  setUpRenderer();
  setUpSeeds();
  document.body.appendChild(renderWindow());
}


init();
animate();

