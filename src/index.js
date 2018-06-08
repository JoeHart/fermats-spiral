import * as THREE from 'three';
import './style.css';
// Initial scene set up
const scene = new THREE.Scene();
scene.background = new THREE.Color('rgb(255,255,255)');
const camFactor = 2;
const fieldSize = 400;
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
    object.position.x = (Math.random() * fieldSize * 2) - fieldSize;
    object.position.y = (Math.random() * fieldSize * 2) - fieldSize;
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
