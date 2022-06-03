import { FunctionComponent, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Particles: FunctionComponent = () => {
  let scene: THREE.Scene;
  let camera: THREE.Camera;
  let controls: any;
  let renderer: THREE.Renderer;
  const initWebGl = () => {
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
    const innerRenderer = new THREE.WebGLRenderer({ canvas });

    innerRenderer.setPixelRatio(window.devicePixelRatio);
    innerRenderer.setSize(window.innerWidth, window.innerHeight);
    innerRenderer.render(innerScene, initCamera);

    const innerControls = new OrbitControls(
      initCamera,
      innerRenderer.domElement
    );
    innerControls.enableDamping = true;

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
      controls: innerControls,
    };
  };
  const initAnimation = (fn: any) => {
    // animations
    const tick = () => {
      requestAnimationFrame(tick);

      if (fn) {
        fn();
      }
      controls.update();

      renderer.render(scene, camera);
    };
    tick();
  };
  useEffect(() => {
    //   init webGL
    const initResult = initWebGl();
    scene = initResult.scene;
    camera = initResult.camera;
    controls = initResult.controls;
    renderer = initResult.renderer;

    // particles
    // Geometry
    const particlesGeometry = new THREE.BufferGeometry();

    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      sizeAttenuation: true,
    });
    particlesMaterial.color = new THREE.Color("#ff88cc");
    particlesMaterial.blending = THREE.AdditiveBlending;
    particlesMaterial.vertexColors = true;
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const clock = new THREE.Clock();
    const renderWave = (clock: any, count: number, particlesGeometry: any) => {
      particlesGeometry.attributes.position.needsUpdate = true;
      const elapseTime = clock.getElapsedTime();

      for (let index = 0; index < count; index++) {
        const i3 = index * 3;
        const x = particlesGeometry.attributes.position.array[i3];
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
          elapseTime + x
        );
      }
    };
    // 初始化动画
    initAnimation(renderWave.bind(null, clock, count, particlesGeometry));
  }, []);

  return <canvas className="webGl"></canvas>;
};

export default Particles;
