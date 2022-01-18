import * as THREE from './three.js/three.module.js';
import { OrbitControls } from './three.js/OrbitControls.js';
import { GLTFLoader } from './three.js/GLTFLoader.js'

export class Map3d {

    constructor(container) {
        this.data = {};
        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.scene = new THREE.Scene();
        this.scene.name = "MainScene";
        this.container = container;
        this.raycaster = new THREE.Raycaster();
        this.camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.01, 2000000);
        this.mouse = {
            containerPosition: new THREE.Vector2(),
            globalPosition: new THREE.Vector2(),
        }
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.loader = new GLTFLoader();


    }
    init() {

        //  scene background
        this.scene.background = new THREE.Color(0x000000);


        //grid helper
        let helpers = new THREE.Group();
        let axesHelper = new THREE.AxesHelper(15000);
        let gridHelper = new THREE.GridHelper(30000, 30);
        helpers.add(axesHelper, gridHelper);
        helpers.name = "helpers";


        //la camera
        let camera = this.camera;
        camera.position.set(0, 3000, 15000);
        camera.lookAt(0, 0, 0);
        camera.name = "camera"


        //la lumière global

        let lightLeft = new THREE.AmbientLight(0xFFFFFF);
        lightLeft.position.set(-100000, 100000, 0);
        lightLeft.lookAt(0, 0, 0);
        let lightRight = new THREE.DirectionalLight(0xFFFFFF);
        lightRight.position.set(100000, -100000, 0);
        lightRight.lookAt(0, 0, 0);
        let lights = new THREE.Group();
        lights.add(lightLeft, lightRight);
        lights.name = "ambiantLights";


        //ajout des elements de base à la scène 
        this.scene.add(lights, camera, helpers);


        //defini le render

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

        this.container.appendChild(this.renderer.domElement);

        //defini le control camera
        this.controls.minZoom = 0.5;
        this.controls.maxZoom = 2;
    }

}