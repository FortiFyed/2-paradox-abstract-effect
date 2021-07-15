import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import * as INIT from './functions.js'

// Debug
// const gui = new dat.GUI()
const gui = null

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Init meshes and lights
INIT.initShapes(scene)
INIT.initLights(scene, gui)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Model
let loader = new THREE.GLTFLoader(), model;
loader.load('/textures/paradox_abstract.glb', function(glb){
    model = glb.scene
    model.scale.set(4, 4, 4)
    model.position.set(-1, 5, -5)
    scene.add(model)

    // console.log('loaded glb:', glb)
    tick()
}, function(xhr){
    // console.log('progress xhr:',xhr)
}, function(error){
    console.log("error:",error)
});

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
    targetY =  mouseY * .001

    INIT.sphereMesh.position.y = window.scrollY * .001
    model.rotation.x = window.scrollY * .01
}
window.addEventListener('scroll', updateSphere)

const clock = new THREE.Clock()

const tick = () =>{
    targetX =  mouseX * .001
    targetY =  mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // add rotation
    INIT.sphereMesh.rotation.y = .5 * elapsedTime
    if(model)
        model.rotation.x = .1 * elapsedTime

    // on mousemove movement
    INIT.sphereMesh.rotation.y += .5 * (targetX - INIT.sphereMesh.rotation.y)
    INIT.sphereMesh.rotation.x += .05 * (targetX - INIT.sphereMesh.rotation.x)
    // if(sphere.position.z < 1.30)
    //     sphere.position.z += -.005 * (targetY - sphere.rotation.x)
    // else if((sphere.position.z + (-.005 * (targetY - sphere.rotation.x))) < sphere.position.z)
    //     sphere.position.z += -.005 * (targetY - sphere.rotation.x)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()