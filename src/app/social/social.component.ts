import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  TetrahedronGeometry,
  TorusKnotGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { convexPointGenerator } from '../points/points';
import { phongMaterialGenerator } from '../shaders/materials';
import { GeometryTypes } from '../types.enum';
import { glbExporter, pngExporter } from '../utils/exporters';
import { getRandomFloat, getRandomInt } from '../utils/randoms';
import {
  socialBgGenerator,
  socialBgGradientGenerator,
  socialConvexPointsGenerator,
  socialPhongMaterialGenerator,
  socialStandardMaterialCover,
  socialStandardMaterialProfile,
} from './social';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

/* 
Opensea:
profile 350x350
cover: 1400x400
promotions: 600x600
twitter:
cover: 1500x500
profile: 400x400
*/
@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
})
export class SocialComponent implements AfterViewInit {
  @ViewChild('canvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('downloadLink')
  linkRef!: ElementRef<HTMLAnchorElement>;

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  get link(): HTMLAnchorElement {
    return this.linkRef.nativeElement;
  }

  resizeObservable!: Observable<Event>;
  resizeSub!: Subscription;

  mainScene!: Scene;

  startTime: number = Date.now();

  selectedMaterial!: ShaderMaterial;
  selectedMesh!: Mesh;

  ngAfterViewInit(): void {
    this.mainScene = new Scene();
    const camera = new PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 250);

    const renderer = new WebGLRenderer({
      canvas: this.canvas,
      // alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setClearColor(0x000000);
    const controls = new OrbitControls(camera, this.canvas);

    this.generateLight();
    // this.backgroundGenerator();

    // this.addConvex();
    this.coverGeometries();
    // this.coverWord();
    // this.profileGeometry();

    const rotationSpeed = 0.005;
    const render = () => {
      requestAnimationFrame(render);
      let time = 0.00025 * (Date.now() - this.startTime);

      // this.selectedMesh.rotation.y += rotationSpeed;

      // console.log(this.selectedMesh.rotation.y);

      controls.update();
      renderer.render(this.mainScene, camera);
    };
    render();

    this.resizeRenderer(renderer, camera);
    this.resizeEventHandler(renderer, camera);

    // setTimeout(() => {
    //   pngExporter(renderer, this.link, 'cover');
    // }, 3000);
  }

  addConvex(): void {
    const points = socialConvexPointsGenerator();
    const geometry = new ConvexGeometry(points);
    this.selectedMaterial = socialPhongMaterialGenerator();
    this.selectedMesh = new Mesh(geometry, this.selectedMaterial);
    this.mainScene.add(this.selectedMesh);
  }

  coverGeometries(): void {
    const points = socialConvexPointsGenerator();
    const geometryConvex = new ConvexGeometry(points);
    const materialConvex = socialStandardMaterialCover();
    const meshConvex = new Mesh(geometryConvex, materialConvex);
    meshConvex.scale.set(0.7, 0.7, 0.7);
    this.mainScene.add(meshConvex);
    // const geometryTorus = new TorusKnotGeometry(16, 6, 128, 8, 2, 3);
    // const materialTorus = socialStandardMaterialMiddle();
    // const meshTorus = new Mesh(geometryTorus, materialConvex);
    // meshTorus.position.set(70, 0, 0);
    // this.mainScene.add(meshTorus);
    const geometryTetra = new TetrahedronGeometry(35);
    const materialTetra = socialStandardMaterialCover();
    const meshTetra = new Mesh(geometryTetra, materialTetra);
    meshTetra.position.set(80, 0, 0);
    meshTetra.rotation.set(40, 0, 0);
    this.mainScene.add(meshTetra);
    const geometryIco = new IcosahedronGeometry(30);
    const materialIco = socialStandardMaterialCover();
    const meshIco = new Mesh(geometryIco, materialIco);
    meshIco.position.set(-80, 0, 0);
    // meshTetra.rotation.set(40, 0, 0);
    this.mainScene.add(meshIco);
  }

  profileGeometry(): void {
    const points = socialConvexPointsGenerator();
    const geometryConvex = new ConvexGeometry(points);
    const materialConvex = socialStandardMaterialProfile();
    const meshConvex = new Mesh(geometryConvex, materialConvex);
    this.mainScene.add(meshConvex);
  }

  coverWord(): void {
    const loader = new FontLoader();
    loader.load('../../assets/font.json', (font) => {
      const geometry = new TextGeometry('C', {
        font: font,
        size: 80,
        height: 15,
        bevelEnabled: true,
        bevelThickness: 6,
        bevelSize: 4,
        bevelOffset: 0,
      });
      const material = new MeshPhongMaterial({
        color: 0xc10005,
      });
      const mesh = new Mesh(geometry, material);
      mesh.position.set(-40, -35, 0);
      this.mainScene.add(mesh);
    });
  }

  backgroundGenerator(): void {
    const geometry = new PlaneGeometry(window.innerWidth, window.innerHeight);
    const material = socialBgGenerator();
    const mesh = new Mesh(geometry, material);
    mesh.position.set(0, 0, -100);
    this.mainScene.add(mesh);
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
