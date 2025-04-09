import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  IcosahedronGeometry,
  Mesh,
  ObjectLoader,
  PerspectiveCamera,
  Scene,
  ShaderLib,
  ShaderMaterial,
  TorusKnotGeometry,
  UniformsUtils,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { convexPointGenerator } from '../points/points';
import {
  randomColorFragmentPhong,
  randomColorWithNoiseFragmentPhong,
} from '../shaders/fragment';
import { phongMaterialGenerator } from '../shaders/materials';
import { staticWithUVPhong } from '../shaders/vertex';
import { GeometryTypes } from '../types.enum';
import { jsonExporter } from '../utils/exporters';
import { getRandomFloat } from '../utils/randoms';
import {
  testMaterialGenerator,
  testStandardMaterialGenerator,
} from './testing';
import * as testMesh from '../../assets/testMesh.json';
import { backgroundParser, convexParser, getHex } from '../utils/parsers';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss'],
})
export class TestingComponent implements AfterViewInit {
  @ViewChild('canvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('jsonLink')
  jsonLinkRef!: ElementRef<HTMLAnchorElement>;

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  get jsonLink(): HTMLAnchorElement {
    return this.jsonLinkRef.nativeElement;
  }

  resizeObservable!: Observable<Event>;
  resizeSub!: Subscription;

  mainScene!: Scene;

  startTime: number = Date.now();

  backgroundMesh!: Mesh;

  selectedMaterial!: ShaderMaterial;
  selectedMesh!: Mesh;

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

    const renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    const controls = new OrbitControls(camera, this.canvas);

    this.generateLight();

    this.addIcosahedron();
    // this.addTorusKnot();
    // this.addConvex();

    // const parsedBg = backgroundParser(testMesh);
    // this.backgroundMesh = parsedBg.mesh;
    // this.backgroundMesh.position.set(0, 0, -100);
    // this.mainScene.add(this.backgroundMesh);

    // const parsed = convexParser(testMesh);
    // this.selectedMaterial = parsed.material;
    // this.selectedMesh = parsed.mesh;
    // this.mainScene.add(this.selectedMesh);

    const rotationSpeed = 0.005;
    const render = () => {
      requestAnimationFrame(render);
      let time = 0.00025 * (Date.now() - this.startTime);

      // this.selectedMesh.rotation.y += rotationSpeed;
      // this.selectedMaterial.uniforms['time'].value = time;

      controls.update();
      renderer.render(this.mainScene, camera);
    };
    render();

    this.resizeRenderer(renderer, camera);
    this.resizeEventHandler(renderer, camera);
  }

  addIcosahedron(): void {
    const geometry = new IcosahedronGeometry(30, 30);
    this.selectedMaterial = testMaterialGenerator();
    this.selectedMesh = new Mesh(geometry, this.selectedMaterial);
    this.mainScene.add(this.selectedMesh);
  }

  addTorusKnot(): void {
    const geometry = new TorusKnotGeometry(20, 5, 300, 20, 2, 1);
    this.selectedMaterial = testMaterialGenerator();
    this.selectedMesh = new Mesh(geometry, this.selectedMaterial);
    this.mainScene.add(this.selectedMesh);
  }

  addConvex(): void {
    const points = convexPointGenerator();
    const geometry = new ConvexGeometry(points);
    this.selectedMaterial = testMaterialGenerator();
    this.selectedMesh = new Mesh(geometry, this.selectedMaterial);
    this.mainScene.add(this.selectedMesh);
  }

  generateLight(): void {
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
