import * as THREE from 'three';
import './style.css';
// Initial scene set up
const scene = new THREE.Scene();
scene.background = new THREE.Color('rgb(255,255,255)');
const camFactor = 2;
const renderer = new THREE.WebGLRenderer();
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

const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
light.color.setHSL(0.6, 1, 0.6);
light.groundColor.setHSL(0.095, 1, 0.75);
light.position.set(0, 50, 0);
scene.add(light);

function getPositionOfSeed(num) {
  // console.log(`GETTING POSITION OF SEED ${num}`);
  const turnAmount = 30;
  const spacing = 15;
  const totalTurn = num * turnAmount;
  // console.log(`TOTAL TURN: ${totalTurn}`);
  const distance = Math.floor(totalTurn / 360) * spacing;
  // console.log(`DISTANCE: ${distance}`);
  const theta = totalTurn - (distance * 360);
  // console.log(`THETA: ${theta}`);
  const thetaRadian = theta * (Math.PI / 180);
  // console.log(`THETA RADIAN: ${theta}`);
  return {
    x: distance * Math.cos(thetaRadian),
    y: distance * Math.sin(thetaRadian),
  };
}

// particle set up
function setUpParticles() {
  const sphereCount = 1000;
  const sphereGeometry = new THREE.SphereGeometry(5, 10, 8);
  const bufferSphereGeometry = new THREE.BufferGeometry()
    .fromGeometry(sphereGeometry);

  for (let i = 0; i < sphereCount; i++) { // eslint-disable-line
    const object = new THREE.Mesh(
      bufferSphereGeometry,
      new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff,
      }),
    );
    const coords = getPositionOfSeed(i);
    // console.log(`COORD X: ${coords.x}`);
    // console.log(`COORD y: ${coords.y}`);
    object.position.x = coords.x;
    object.position.y = coords.y;
    object.position.z = -100;
    scene.add(object);
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
setUpParticles();
