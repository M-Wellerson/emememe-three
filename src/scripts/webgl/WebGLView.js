import * as THREE from 'three';
import glslify from 'glslify';
import AsyncPreloader from 'async-preloader';

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import vertexShader from "./../../glsl/vertex.glsl";
import fragmentShader from "./../../glsl/fragment.glsl";
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader.js';

export default class WebGLView {
	constructor(app) {
		this.app = app;

		this.initThree();
		this.initImage();
		this.initPreProcessing();
		this.initLight();
		this.initControls();
	}

	initThree() {
		this.scene = new THREE.Scene();
		this.clock = new THREE.Clock();

		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 300;

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		this.clock = new THREE.Clock();
	}

	initControls() {
		this.trackball = new TrackballControls(this.camera, this.renderer.domElement);
		this.trackball.rotateSpeed = 2.0;
		this.trackball.enabled = true;
	}

	initImage() {
		const texture = new THREE.TextureLoader().load('https://lh6.ggpht.com/HlgucZ0ylJAfZgusynnUwxNIgIp5htNhShF559x3dRXiuy_UdP3UQVLYW6c=s1200');

		this.planeGeo = new THREE.PlaneGeometry(150, 100, 16, 16);
		this.material = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: {
			  uTime: { value: 0.0 },
			  uTexture: { value: texture }
			},
			side: THREE.DoubleSide
		  });


		this.object3D = new THREE.Mesh(this.planeGeo, this.material);

		this.scene.add(this.object3D);
	}

	initPreProcessing(){
		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new RenderPass(this.scene, this.camera));
		this.pixelPass = new ShaderPass(PixelShader);

		this.pixelPass.uniforms['resolution'].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
		this.pixelPass.uniforms['resolution'].value.multiplyScalar(window.devicePixelRatio);
		this.composer.addPass(this.pixelPass);
	}

	initLight(){
		const light = new THREE.PointLight(0xffffff, 10, 100);
		light.position.set(50, 50, 50);
		this.scene.add(light);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		if (this.trackball) this.trackball.update();
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize(vw, vh) {
		if (!this.renderer) return;
		this.camera.aspect = vw / vh;
		this.camera.updateProjectionMatrix();

		// this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
		// this.fovWidth = this.fovHeight * this.camera.aspect;

		this.renderer.setSize(vw, vh);

		if (this.trackball) this.trackball.handleResize();
	}
}
