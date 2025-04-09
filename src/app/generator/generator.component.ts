import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AmbientLight,
  Clock,
  Color,
  DirectionalLight,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SpotLight,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { randomSelector } from '../utils/randoms';
import {
  staticBgColorGenerator,
  staticBgGradientGenerator,
} from '../backgrounds/backgrounds';
import {
  randomGeometrySelector,
  singleGeometrySelector,
} from '../geometries/geometries';
import { idGenerator } from '../utils/id';
import {
  glbExporter,
  jsonExporter,
  pngExporter,
  webmExporter,
} from '../utils/exporters';
import * as Stats from 'stats.js';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasLink')
  canvasLinkRef!: ElementRef<HTMLAnchorElement>;

  @ViewChild('jsonLink')
  jsonLinkRef!: ElementRef<HTMLAnchorElement>;

  @ViewChild('pngLink')
  pngLinkRef!: ElementRef<HTMLAnchorElement>;

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  get canvasLink(): HTMLAnchorElement {
    return this.canvasLinkRef.nativeElement;
  }

  get jsonLink(): HTMLAnchorElement {
    return this.jsonLinkRef.nativeElement;
  }

  get pngLink(): HTMLAnchorElement {
    return this.pngLinkRef.nativeElement;
  }

  resizeObservable!: Observable<Event>;
  resizeSub!: Subscription;

  mainScene!: Scene;

  clock: Clock = new Clock();
  // startTime: number = this.clock.startTime;
  startTime: number = Date.now();

  spotLight!: SpotLight;

  backgroundMesh!: Mesh;

  selectedMaterial!: ShaderMaterial;
  selectedMesh!: Mesh;

  meshID: string = idGenerator(6);

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.mainScene = new Scene();
    // TODO: change camera position
    const camera = new PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 150);

    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    const controls = new OrbitControls(camera, this.canvas);

    this.backgroundGenerator();
    this.generateLight();

    const selectedGeometry = randomGeometrySelector();
    this.selectedMaterial = selectedGeometry.material;
    this.selectedMesh = selectedGeometry.mesh;
    this.mainScene.add(this.selectedMesh);

    const rotationSpeed = 0.005;
    const render = () => {
      requestAnimationFrame(render);
      let delta = this.clock.getDelta();
      let time = 0.00025 * (Date.now() - this.startTime);

      this.selectedMesh.rotation.y += rotationSpeed;
      this.selectedMaterial.uniforms['time'].value = time;

      controls.update();
      renderer.render(this.mainScene, camera);
      stats.update();
    };
    render();

    this.resizeRenderer(renderer, camera);
    this.resizeEventHandler(renderer, camera);

    // EXPORTING!!
    // setTimeout(() => {
    //   pngExporter(renderer, this.pngLink, this.meshID);
    // }, 10);
    // webmExporter(this.canvas, this.canvasLink, 21000, this.meshID);
    // setTimeout(() => {
    //   jsonExporter(
    //     this.selectedMesh,
    //     this.backgroundMesh,
    //     this.jsonLink,
    //     this.meshID
    //   );
    // }, 22000);
  }

  backgroundGenerator(): void {
    const materials = [staticBgColorGenerator(), staticBgGradientGenerator()];
    const geometry = new PlaneGeometry(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    const material = randomSelector(materials);
    this.backgroundMesh = new Mesh(geometry, material);
    this.backgroundMesh.position.set(0, 0, -100);
    this.mainScene.add(this.backgroundMesh);
  }

  generateLight(): void {
    // TODO: Check for new ways to add lights (randomize it)
    const color = new Color(0xffffff);
    const directional = new DirectionalLight(color, 1.0);
    directional.position.set(0, 20, 75);
    this.mainScene.add(directional);
    const ambient = new AmbientLight(color, 0.3);
    this.mainScene.add(ambient);
  }

  resizeEventHandler(renderer: WebGLRenderer, camera: PerspectiveCamera): void {
    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSub = this.resizeObservable.subscribe({
      next: () => {
        this.resizeRenderer(renderer, camera);
      },
      error: (err) => console.log(err),
    });
  }

  resizeRenderer(renderer: WebGLRenderer, camera: PerspectiveCamera): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (renderer && camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
    }
  }
}
