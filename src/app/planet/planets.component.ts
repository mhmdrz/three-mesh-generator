import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { phongMaterialGenerator } from '../shaders/materials';
import { classicPerlin3D, simplex } from '../shaders/noises';
import { GeometryTypes } from '../types.enum';
import { planetMaterialGenerator } from './planets';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.scss'],
})
export class PlanetsComponent implements AfterViewInit {
  @ViewChild('canvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  resizeObservable!: Observable<Event>;
  resizeSub!: Subscription;

  mainScene!: Scene;

  startTime: number = Date.now();

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
    camera.position.set(0, 0, 200);

    const renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    const controls = new OrbitControls(camera, this.canvas);

    this.generateLight();

    this.generatePlanet();

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

  generatePlanet(): void {
    const geometry = new SphereGeometry(70, 200, 200);
    this.selectedMaterial = planetMaterialGenerator();
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
