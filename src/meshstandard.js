import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import './style.css';

const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight, ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();

const env0Texture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg'
]);
const env1Texture = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg'
  ]);
  const env2Texture = cubeTextureLoader.load([
    '/textures/environmentMaps/2/px.jpg',
    '/textures/environmentMaps/2/nx.jpg',
    '/textures/environmentMaps/2/py.jpg',
    '/textures/environmentMaps/2/ny.jpg',
    '/textures/environmentMaps/2/pz.jpg',
    '/textures/environmentMaps/2/nz.jpg'
  ]);

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
    materialParam : {
        envMap: env0Texture,
        metalness: 1,
        roughness: 0,
        color: '#ffffff'
    }
};
const { sphereParam, planeParam , torusParam, materialParam} = parameters;

 const material = new THREE.MeshStandardMaterial({
    ...materialParam
 });

const gui = new dat.GUI();
const sphereGui = gui.addFolder('sphere');
const planeGui = gui.addFolder('plane');
const torusGui = gui.addFolder('torus');
const materialGui = gui.addFolder('material');

/**
 * Sphere Geomatry
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

sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2));
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2));
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array,2));


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
 * Material
 */
materialGui.add(material, 'metalness', 0, 1, 0.01);
materialGui.add(material, 'roughness', 0, 1, 0.01);
materialGui.addColor(materialParam, 'color').onChange((val) => {
    material.color = new THREE.Color(val);
    material.needsUpdate = true;
});
materialGui.add(materialParam, 'envMap', [ '1', '2', '3' ]).onChange((val) => {
    if (val === '1') {
        material.envMap = env0Texture;
    } else if (val === '2') {
        material.envMap = env1Texture;
    } else {
        material.envMap = env2Texture;
    }
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


