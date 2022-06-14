import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const guiAmbientLight = gui.addFolder('Ambient Light');
const guiPointLight = gui.addFolder('Point Light');
const guiDirectionalLight = gui.addFolder('Directional Light');
const guiSpotLight = gui.addFolder('Spot Light');

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Parameters
 */
 const lightParameters = {
    ambient: {
        color: '#ffffff',
        intensity: 0.5
    },
    point: {
        color: '#2a07cf',
        intensity: 0.5,
        positionX: 2.3,
        positionY: 0,
        positionZ: 0,
    },
    directional: {
        color: '#ff0000',
        intensity: 0.3,
        positionX: 1,
        positionY: 1,
        positionZ: 1,
    },
    spot: {
        color: '#ff00ff',
        intensity: 0.7,
        positionX: 1,
        positionY: 3,
        positionZ: 1,
    }
};

const { ambient, point, directional, spot } = lightParameters;

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(ambient.color)
ambientLight.intensity = ambient.intensity
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(directional.color, directional.intensity)
directionalLight.position.set(directional.positionX, directional.positionY, directional.positionZ)
scene.add(directionalLight)


// Point light
const pointLight = new THREE.PointLight(point.color, point.intensity, 10, 2)
pointLight.position.set(point.positionX, point.positionY, point.positionZ)
scene.add(pointLight)


// Spot light
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

spotLight.target.position.x = - 0.75
scene.add(spotLight.target)

// Helpers

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2, 'blue')
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
window.requestAnimationFrame(() =>
{
    spotLightHelper.update()
})

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * light GUI
 */
 guiAmbientLight.addColor(lightParameters.ambient, 'color').onChange((val) => {
    ambientLight.color = new THREE.Color(val);
});
guiAmbientLight.add(lightParameters.ambient, 'intensity', 0, 1, 0.01).onChange((val) => {   
    ambientLight.intensity = val;
});

guiPointLight.addColor(lightParameters.point, 'color').onChange((val) => {
    pointLight.color = new THREE.Color(val);
});
guiPointLight.add(lightParameters.ambient, 'intensity', 0, 1, 0.01).onChange((val) => {   
    pointLight.intensity = val;
});
guiPointLight.add(lightParameters.point, 'positionX', -50, 50, 0.1).onChange((val) => {
    pointLight.position.x = val;
    pointLightHelper.parent.updateMatrixWorld();
    pointLightHelper.update();
});
guiPointLight.add(lightParameters.point, 'positionY', -50, 50, 0.1).onChange((val) => {
    pointLight.position.y = val;
    pointLightHelper.parent.updateMatrixWorld();
    pointLightHelper.update();
});
guiPointLight.add(lightParameters.point, 'positionZ', -50, 50, 0.1).onChange((val) => {
    pointLight.position.z = val;
    pointLightHelper.parent.updateMatrixWorld();
    pointLightHelper.update();
});

guiDirectionalLight.addColor(lightParameters.directional, 'color').onChange((val) => {
    directionalLight.color = new THREE.Color(val);
});
guiDirectionalLight.add(lightParameters.directional, 'intensity', 0, 1, 0.01).onChange((val) => {   
    directionalLight.intensity = val;
});
guiDirectionalLight.add(lightParameters.directional, 'positionX', -50, 50, 0.1).onChange((val) => {
    directionalLight.position.x = val;
});
guiDirectionalLight.add(lightParameters.directional, 'positionY', -50, 50, 0.1).onChange((val) => {
    directionalLight.position.y = val;
});
guiDirectionalLight.add(lightParameters.directional, 'positionZ', -50, 50, 0.1).onChange((val) => {
    directionalLight.position.z = val;
});

guiSpotLight.addColor(lightParameters.directional, 'color').onChange((val) => {
    spotLight.color = new THREE.Color(val);
});
guiSpotLight.add(lightParameters.spot, 'intensity', 0, 1, 0.01).onChange((val) => {   
    spotLight.intensity = val;
});
guiSpotLight.add(lightParameters.spot, 'positionX', -50, 50, 0.1).onChange((val) => {
    spotLight.position.x = val;
});
guiSpotLight.add(lightParameters.spot, 'positionY', -50, 50, 0.1).onChange((val) => {
    spotLight.position.y = val;
});
guiSpotLight.add(lightParameters.spot, 'positionZ', -50, 50, 0.1).onChange((val) => {
    spotLight.position.z = val;
});

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()