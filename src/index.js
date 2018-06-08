import * as THREE from 'three.js';

// Initial scene set up
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, // FOV
  window.innerHeight / window.innerHeight,
  0.1,
  10000,
);

const renderer = new THREE.WebGLRenderer();

function component() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  return renderer.domElement;
}

document.body.appendChild(component());

scene.background = new THREE.Color(0xf0f0f0);
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
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
    object.position.x = (Math.random() * 800) - 400;
    object.position.y = (Math.random() * 800) - 400;
    object.position.z = (Math.random() * 800) - 400;
    scene.add(object);
  }
}


function animate() {
  requestAnimationFrame(animate);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

animate();
setUpParticles();
