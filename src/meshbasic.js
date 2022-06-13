import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import './style.css';

const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();

let parameters = {
  sphereParam :{
      radius: 0.5,
      heightSegments: 16,
      widthSegments: 16,
  },
  planeParam: {
      width: 1,
      height: 1,
      heightSegments: 100,
      widthSegments: 100,
  },
  torusParam: {
      radius: 0.45,
      tube: 0.24,
      radialSegments: 16,
      tabularSegments: 32,
      arc: 6.9
  },
  materialParam: {
    color: '#747dfe',
    opacity: 0.5,
    transparent: false,
    side: 'Front Side',
    wireframe: false,
  },
};
const { sphereParam, planeParam , torusParam, materialParam } = parameters;

const material = new THREE.MeshBasicMaterial({ 
   ...materialParam
});

const gui = new dat.GUI();
const sphereGui = gui.addFolder('sphere');
const planeGui = gui.addFolder('plane');
const torusGui = gui.addFolder('torus');
const materialGui = gui.addFolder('material')



/**
 * Geometry
 */
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(sphereParam.radius, sphereParam.widthSegments, sphereParam.heightSegments),
    material
);
sphere.position.set(-1.5, 0, 0);


const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(planeParam.width ,planeParam.height, planeParam.widthSegments, planeParam.heightSegments),
    material
);

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(torusParam.radius, torusParam.tube, torusParam.radialSegments, torusParam.tabularSegments, torusParam.arc),
    material
);
torus.position.set(1.5, 0, 0);

scene.add(sphere, plane, torus);

const regenerateShpereGeometry = () => {
    const newSphereGeometry = new THREE.SphereBufferGeometry(sphereParam.radius, sphereParam.widthSegments, sphereParam.heightSegments)
    sphere.geometry.dispose();
    sphere.geometry = newSphereGeometry;
}

const regeneratePlaneGeometry = () => {
    const newPlaneGeometry = new THREE.PlaneBufferGeometry(planeParam.width ,planeParam.height, planeParam.widthSegments, planeParam.heightSegments);
    plane.geometry.dispose();
    plane.geometry = newPlaneGeometry;
}

const regenerateTorusGeometry = () => {
    const newTorusGeometry =  new THREE.TorusBufferGeometry(torusParam.radius, torusParam.tube, torusParam.radialSegments, torusParam.tabularSegments, torusParam.arc);
    torus.geometry.dispose();
    torus.geometry = newTorusGeometry;
}

const updateWireframe = (val) => {
  material.wireframe = val;
};

/**
 * GUI Sphere
 */
sphereGui.add(parameters.sphereParam, 'radius', 0, 5, 0.01).onChange(regenerateShpereGeometry);
sphereGui.add(parameters.sphereParam, 'widthSegments', 3, 50, 0.1).onChange(regenerateShpereGeometry)
sphereGui.add(parameters.sphereParam, 'heightSegments', 2, 50, 0.1).onChange(regenerateShpereGeometry)


/**
 * GUI Plane
 */
 planeGui.add(parameters.planeParam, 'widthSegments', 1, 30, 0.01).onChange(regeneratePlaneGeometry);
 planeGui.add(parameters.planeParam, 'heightSegments', 1, 30, 0.01).onChange(regeneratePlaneGeometry);


 /**
  * GUI Torus
  */
torusGui.add(parameters.torusParam, 'radius', 0, 1, 0.01).onChange(regenerateTorusGeometry);
torusGui.add(parameters.torusParam, 'tube', 0, 1, 0.01).onChange(regenerateTorusGeometry);
torusGui.add(parameters.torusParam, 'radialSegments', 1, 30, 0.01).onChange(regenerateTorusGeometry);
torusGui.add(parameters.torusParam, 'tabularSegments', 3, 100, 0.01).onChange(regenerateTorusGeometry);

/**
 * GUI Material
 */
materialGui.add(parameters.materialParam, 'wireframe').onChange((val) => {
  material.wireframe = val;
  material.needsUpdate = true;
});
materialGui.add(parameters.materialParam, 'transparent').onChange((val) => {
  material.transparent = val;
  material.needsUpdate = true;
});
materialGui.add(parameters.materialParam, 'opacity', 0, 1, 0.01).onChange((val) => {
  material.opacity = val;
  material.needsUpdate = true;
});
materialGui.add(parameters.materialParam, 'side', [ 'Front Side', 'Back Side', 'Double Side' ]).onChange((val) => {
  if (val === 'Front Side') {
    material.side = THREE.FrontSide;
  } else if (val === 'Back Side') {
    material.side = THREE.BackSide;
  } else {
    material.side = THREE.DoubleSide;
  }
  material.needsUpdate = true;
});
materialGui.addColor(parameters.materialParam, 'color').onChange((val) => {
  material.color = new THREE.Color(val);
  material.needsUpdate = true;
});



/**
 * Camera
 */
 const sizes = {
    height: window.innerHeight,
    width: window.innerWidth
};

window.addEventListener('resize', () => {
    sizes.height = window.innerHeight;
    sizes.width = window.innerWidth;

    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    
});

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height);
camera.position.set(1, 1, 3);
scene.add(camera);

/**
 * Render
 */
const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const clock = new THREE.Clock();

const tick = () => {

    const elapsedTime = clock.getElapsedTime();
    sphere.rotation.y = elapsedTime * 0.1;
    sphere.rotation.x = elapsedTime * 0.15;

    plane.rotation.y = elapsedTime * 0.1;
    plane.rotation.x = elapsedTime * 0.15;

    torus.rotation.y = elapsedTime * 0.1;
    torus.rotation.x = elapsedTime * 0.15;

    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick();


