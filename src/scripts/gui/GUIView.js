import * as THREE from 'three';
import Tweakpane from 'tweakpane';
import Stats from 'stats.js';

export default class GUIView {

	constructor(app) {
		this.app = app;

		this.postProcessing = false;
		this.density = 1;
		this.pixel = 1;

		this.initPane();
		// this.initStats();

		this.enable();
	}

	initPane() {
		let folder;
		
		this.pane = new Tweakpane();
		// this.pane.containerElem_.classList.add('full');

		folder = this.pane.addFolder({ title: 'Parameters' });
		folder.addInput(this, 'pixel', { label: 'pixel', min: 1, max: 400, step: 1 }).on('change', this.onPixel.bind(this));
	}

	initStats() {
		this.stats = new Stats();
		document.body.appendChild(this.stats.dom);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	enable() {
		this.pane.hidden = false;
		if (this.stats) this.stats.dom.style.display = '';

		if (!this.pane.containerElem_.classList.contains('full')) return;
		this.app.el.style.width = `calc(100vw - ${this.pane.containerElem_.offsetWidth}px)`;
		this.app.resize();
	}

	disable() {
		this.pane.hidden = true;
		if (this.stats) this.stats.dom.style.display = 'none';

		if (!this.pane.containerElem_.classList.contains('full')) return;
		this.app.el.style.width = ``;
		this.app.resize();
	}

	toggle() {
		if (!this.pane.hidden) this.disable();
		else this.enable();
	}
	onPixel(value) {
		this.app.webgl.pixelPass.uniforms.pixelSize.value = value;
	}
}