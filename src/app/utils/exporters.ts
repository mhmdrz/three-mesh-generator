import { Mesh, Scene, WebGLRenderer } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

function saveArrayBuffer(
  buffer: any,
  link: HTMLAnchorElement,
  name: string
): void {
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
}

export function jsonExporter(
  mesh: Mesh,
  bgMesh: Mesh,
  link: HTMLAnchorElement,
  name: string
): void {
  const data = {
    background: bgMesh.toJSON(),
    mesh: mesh.toJSON(),
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  link.href = URL.createObjectURL(blob);
  link.download = `${name}.json`;
  link.click();
}

export function pngExporter(
  renderer: WebGLRenderer,
  link: HTMLAnchorElement,
  name: string
): void {
  link.href = renderer.domElement.toDataURL('image/png');
  link.download = `${name}.png`;
  link.click();
}

export function glbExporter(
  scene: Scene,
  link: HTMLAnchorElement,
  name: string
): void {
  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    (res) => {
      saveArrayBuffer(res, link, `${name}.glb`);
    },
    {
      trs: true,
      binary: true,
    }
  );
}

export function webmExporter(
  canvas: HTMLCanvasElement,
  link: HTMLAnchorElement,
  stopAfter: number,
  name: string
): void {
  const stream = canvas.captureStream();
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
  });
  let chunks: BlobPart[] = [];

  mediaRecorder.ondataavailable = (event) => {
    chunks.push(event.data);
  };

  mediaRecorder.onstop = (event) => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    chunks = [];
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${name}.webm`;
    link.click();
  };

  mediaRecorder.start();
  setTimeout(() => {
    mediaRecorder.stop();
  }, stopAfter);
}
