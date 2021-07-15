import * as THREE from 'three'
import {GLTFLoader} from './GLTFLoader.js';

var mapThemes = ['NormalMap', 'DottedMap', 'RoundedMap', 'RoadMap']
export var sphereMesh, torus, torus2
export var materialArray = [], meshArray = [] 

export const initShapes = (scene) => {
    // Sphere
    const loader = new THREE.TextureLoader()
    const normalMap = loader.load (`/textures/${mapThemes[0]}.png`)

    const sphereGeo = new THREE.SphereBufferGeometry(.5, 64, 64)
    const sphereMaterial = new THREE.MeshStandardMaterial()
    sphereMaterial.metalness = .7
    sphereMaterial.roughness = .2
    sphereMaterial.normalMap = normalMap
    sphereMaterial.color = new THREE.Color(0x292929)
    materialArray.push(sphereMaterial)

    sphereMesh = new THREE.Mesh(sphereGeo, sphereMaterial)
    scene.add(sphereMesh)
    meshArray.push(sphereMesh)

    // Torus
    const torusGeo = new THREE.TorusGeometry(1, .1, 30, 3);
    const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x292929 });
    torus = new THREE.Mesh(torusGeo, torusMaterial);
    scene.add(torus);

    // Moving Torus
    const torus2Geo = new THREE.TorusGeometry(4, 1, 30, 100);
    const torus2Material = new THREE.MeshStandardMaterial({ color: 0x292929 });
    torus2 = new THREE.Mesh(torus2Geo, torus2Material);
    torus2.scale.set(0.1, 0.1, 0.1)
    scene.add(torus2);
}

const lightConrtols = (scene, gui, lightSource) => {
    const lightFolder = gui.addFolder('light 2')

    lightFolder.add(lightSource.position, 'y').min(-3).max(3).step(0.01)
    lightFolder.add(lightSource.position, 'x').min(-6).max(6).step(0.01)
    lightFolder.add(lightSource.position, 'z').min(-3).max(3).step(0.01)
    lightFolder.add(lightSource, 'intensity').min(0).max(10).step(0.01)

    const lightFolderColor = { color: 0x8500fc }
    lightFolder.addColor(lightFolderColor, 'color').onChange(() => {
        lightSource.color.set(lightFolderColor.color)
    })

    const pointLightHelper = new THREE.PointLightHelper(lightSource, 1)
    scene.add(pointLightHelper)
}
export const initLights = (scene, gui) => {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xfc0067, .1)
    ambientLight.position.set(0,0,0)
    scene.add(ambientLight)

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xfc0067, .1)
    directionalLight.position.set(0,0,0)
    scene.add(directionalLight)

    // PointLight 1
    const pointLight = new THREE.PointLight(0xffffff, 0.1)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)

    // PointLight 2
    const pointLight2 = new THREE.PointLight(0xff0000, 2)
    // const pointLight2 = new THREE.PointLight(0xfc0067, 2)
    pointLight2.position.set(-1.86, 1, -1.65)
    pointLight2.intensity = 10
    scene.add(pointLight2)

    // PointLight 3
    const pointLight3 = new THREE.PointLight(0xf0ff, 2)
    // const pointLight3 = new THREE.PointLight(0x8500fc, 2)
    pointLight3.position.set(5.83, -2.51, -3)
    pointLight3.intensity = 10
    scene.add(pointLight3)

    // light controls
    // lightConrtols(scene, gui, pointLight3)
}

// section script
export var model
export const initSectionModel = (scene) => {
    let loader = new THREE.GLTFLoader();
    loader.load('/textures/scene.glb', function(glb){
        model = glb.scene
        model.scale.set(1,1,1)

        scene.add(model)
        console.log('glb:', glb)
        // animate();
    }, function(xhr){
        console.log('xhr:',xhr)
    }, function(error){
        console.log("error:",error)
    });
}