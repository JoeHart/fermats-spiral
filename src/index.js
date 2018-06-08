import * as THREE from 'three';
import Stats from 'stats-js';
import './style.css';

const stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms

// Align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild(stats.domElement);
const trails = true;
// Initial scene set up
const scene = new THREE.Scene();
scene.background = new THREE.Color('rgb(255,255,255)');
const camFactor = 2;
const renderer = new THREE.WebGLRenderer();
renderer.autoClearColor = trails;
const camera = new THREE.OrthographicCamera(
  -window.innerWidth / camFactor,
  window.innerWidth / camFactor,
  window.innerHeight / camFactor,
  -window.innerHeight / camFactor,
  1,
  1000,
);

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


function component() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  return renderer.domElement;
}

document.body.appendChild(component());

// const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
// light.color.setHSL(0.6, 1, 0.6);
// light.groundColor.setHSL(0.095, 1, 0.75);
// light.position.set(0, 50, 0);
// scene.add(light);

function getPositionOfSeed(num, turnFraction) {
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
const seeds = [];
let turnFraction = 16 / 10;
// particle set up
function setUpParticles() {
  const sphereCount = 1000;
  const sphereGeometry = new THREE.SphereGeometry(5, 10, 8);
  const bufferSphereGeometry = new THREE.BufferGeometry()
    .fromGeometry(sphereGeometry);

  for (let i = 0; i < sphereCount; i++) { // eslint-disable-line
    const object = new THREE.Mesh(
      bufferSphereGeometry,
      // new THREE.MeshLambertMaterial({
      //   color: Math.random() * 0xffffff,
      // }),
      new THREE.PointsMaterial({ color: Math.random() * 0xffffff }),
    );
    const coords = getPositionOfSeed(i, turnFraction);
    // console.log(`COORD X: ${coords.x}`);
    // console.log(`COORD y: ${coords.y}`);
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
    // console.log(`COORD X: ${coords.x}`);
    // console.log(`COORD y: ${coords.y}`);
    seed.position.x = coords.x;
    seed.position.y = coords.y;
    return seed;
  });
  turnFraction += 0.000001;
  console.log(turnFraction);
  renderer.render(scene, camera);
  stats.end();
}

animate();
setUpParticles();
