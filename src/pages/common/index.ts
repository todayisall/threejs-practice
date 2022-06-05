import * as THREE from "three";

export const initWebGl = () => {
  const canvas = document.querySelector(".webGl") as HTMLCanvasElement;

  /**
   * scene
   */
  const innerScene = new THREE.Scene();

  /**
   * camera
   */
  const initCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  initCamera.position.z = 5;
  innerScene.add(initCamera);

  /**
   * renderer
   */
  const innerRenderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });

  innerRenderer.setPixelRatio(window.devicePixelRatio);
  innerRenderer.setSize(window.innerWidth, window.innerHeight);
  innerRenderer.render(innerScene, initCamera);

  window.addEventListener("resize", () => {
    innerRenderer.setSize(window.innerWidth, window.innerHeight);
    initCamera.aspect = window.innerWidth / window.innerHeight;
    initCamera.updateProjectionMatrix();
  });
  window.addEventListener("dblclick", () => {
    // 兼容safari
    const fullscreenElement = document.fullscreenElement;
    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        canvas?.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });

  return {
    canvas,
    scene: innerScene,
    renderer: innerRenderer,
    camera: initCamera,
  };
};
