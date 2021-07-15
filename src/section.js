import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import * as INIT from './functions.js'

// Debug
// const gui = new dat.GUI()
const gui = null
// Canvas
const canvas = document.querySelector('canvas.section_webgl')

// Scene
const scene = new THREE.Scene()
// scene.background = new THREE.Color( 0xff0000 );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>{
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 10
scene.add(camera)

// Init model
var model
const initSectionModel = () => {
    let loader = new THREE.GLTFLoader();
    loader.load('/textures/scene.glb', function(glb){
        model = glb.scene
        model.scale.set(1, 1, 1)

        scene.add(model)
        console.log('loaded glb:', glb)
        animate()
    }, function(xhr){
        console.log('progress xhr:',xhr)
    }, function(error){
        console.log("error:",error)
    });
}
initSectionModel()

// Lights
{
    const directionalLight = new THREE.DirectionalLight(0xf0ff, 1);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
}
{
    const skyColor = 0xf0ff;  // light blue
    const groundColor = 0xf0ff;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
}
{
    const color = 0xf0ff;
    const intensity = .001;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 10, 2);
    scene.add(light);
    scene.add(light.target);
}

function animate(){
    const clock = new THREE.Clock()
    const elapsedTime = clock.getElapsedTime()
    // add rotation
    model.rotation.x = 0.8 * elapsedTime

    renderer.render(scene, camera)
    window.requestAnimationFrame(animate)
}

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
scene.fog = new THREE.FogExp2(0x292929, .1)
renderer.setClearColor(scene.fog.color)

/**
 * Animate
 */
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0
const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2

const onDocumentMouseMove = (event) => {
    mouseX = (event.clientX - windowHalfX)
    mouseY = (event.clientY - windowHalfY)
}
document.addEventListener('mousemove', onDocumentMouseMove)

const updateSphere = (event) => {
    // INIT.sphereMesh.position.y = window.scrollY * .001
}
window.addEventListener('scroll', updateSphere)

// const clock = new THREE.Clock()
// const tick = () =>{
//     targetX =  mouseX * .001
//     targetY =  mouseY * .001

//     const elapsedTime = clock.getElapsedTime()

//     // add rotation
//     // model.rotation.x = 0.8 * elapsedTime

//     // Render
//     renderer.render(scene, camera)

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// tick()