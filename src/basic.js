import * as THREE from 'three';
import './style.css';

//scene
const scene = new THREE.Scene();

//box or object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: '#715ee6' });
const box = new THREE.Mesh(geometry, material);
scene.add(box);

const size = {
  width: window.innerWidth,
  height: window.innerHeight
};

//resize
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  //update camera aspect ratio
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  //update renderer
  renderer.setSize(size.width, size.height);
})

//camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height );
camera.position.set(0, 0, 3);
scene.add(camera);

//renderer
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);

const tick = () => {
  window.requestAnimationFrame(tick);
  renderer.render(scene, camera);
};

tick();