import {
  SMAAPass,
  RenderPass,
  EffectComposer,
} from 'postprocessing';
import * as THREE from 'three';
import Stats from 'stats-js';
import dat from 'dat.gui';
import './style.css';

// global objects
let stats;
let scene;
let renderer;
let composer;
let camera;
let seeds;
let started = true;
const gui = new dat.GUI();
const config = {
  seedSpacing: 17,
  turnFractionTop: 16,
  turnFractionBottom: 10,
  speed: 5,
  degrees: (16 / 10) * 360,
  turnFraction: 16 / 10,
  numberOfSeeds: 1500,
};

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

function getPositionOfSeed(num) {
  // console.log(`GETTING POSITION OF SEED ${num}`);
  // const turnAmount = 360 * config.turnFraction;
  // const totalTurn = num * turnAmount;
  // console.log(`TOTAL TURN: ${totalTurn}`);
  // const distance = ((totalTurn / 360) * config.seedSpacing * 0.5) + config.seedSpacing;
  // console.log(`DISTANCE: ${distance}`);
  // const theta = totalTurn;
  // console.log(`THETA: ${theta}`);
  const distance1 = (config.seedSpacing * Math.sqrt(num + 1));
  const distance2 = -distance1;
  // const theta = num * (config.degrees / (Math.PI * 180));
  const theta = num * (2 * Math.PI * config.turnFraction);


  // const thetaRadian = theta * (Math.PI / 180);
  // console.log(`THETA RADIAN: ${theta}`);
  return {
    x1: distance1 * Math.cos(theta),
    y1: distance1 * Math.sin(theta),
    x2: distance2 * Math.cos(theta),
    y2: distance2 * Math.sin(theta),
  };
}

function deleteSeeds() {
  seeds.map((seed) => {
    scene.remove(seed);
    return null;
  });
}

// particle set up
function setUpSeeds() {
  seeds = [];
  const sphereGeometry = new THREE.SphereGeometry(5, 10, 8);
  const bufferSphereGeometry = new THREE.BufferGeometry()
    .fromGeometry(sphereGeometry);

  for (let i = 0; i < config.numberOfSeeds; i += 2) { // eslint-disable-line
    const object = new THREE.Mesh(
      bufferSphereGeometry,
      new THREE.PointsMaterial({ color: 0x00ff00 }),
    );
    const object2 = new THREE.Mesh(
      bufferSphereGeometry,
      new THREE.PointsMaterial({ color: 0xff0000 }),
    );
    const coords = getPositionOfSeed(i);
    object.position.x = coords.x1;
    object.position.y = coords.y1;
    object.position.z = -100;
    object2.position.x = coords.x2;
    object2.position.y = coords.y2;
    object2.position.z = -100;
    seeds.push(object);
    scene.add(object);
    seeds.push(object2);
    scene.add(object2);
  }
  console.log(seeds);
}

function animate() {
  stats.begin();
  requestAnimationFrame(animate);
  if (started) {
    for (let i = 0; i < config.numberOfSeeds; i += 2) {
      const coords = getPositionOfSeed(i);
      seeds[i].position.x = coords.x1;
      seeds[i].position.y = coords.y1;

      if ((i + 1) < config.numberOfSeeds) {
        seeds[i + 1].position.x = coords.x2;
        seeds[i + 1].position.y = coords.y2;
      }
    }
    config.turnFractionTop += 0.00001 * config.speed;
    config.turnFraction = config.turnFractionTop / config.turnFractionBottom;
  }
  composer.render();
  stats.end();
}

function setUpUI() {
  // add three render to window
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  gui.add(config, 'turnFractionTop', 0, 25);
  gui.add(config, 'turnFractionBottom', 0, 25);
  gui.add(config, 'seedSpacing', 0, 100);
  const fractionControls = gui.add(config, 'turnFraction')
    .step(0.00001);
  fractionControls.onChange(() => {
    started = false;
  });
  fractionControls.onFinishChange(() => {
    started = true;
  });
  gui.add(config, 'speed', 0, 10);
  const numberOfSeedControls = gui.add(config, 'numberOfSeeds', 0, 3000);
  numberOfSeedControls.onChange(() => {
    started = false;
  });
  numberOfSeedControls.onFinishChange(() => {
    deleteSeeds();
    setUpSeeds();
    started = true;
  });
}

function init() {
  // Set Up Stats
  setUpStats();
  setUpScene();
  setUpRenderer();
  setUpUI();
  setUpSeeds();
}

init();
animate();

