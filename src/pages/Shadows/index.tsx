import { FunctionComponent, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const Shadows: FunctionComponent = () => {
  useEffect(() => {
    const canvas = document.querySelector(".webGl") as HTMLCanvasElement;

    /**
     * scene
     */
    const scene = new THREE.Scene();

    /**
     * camera
     */
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    scene.add(camera);

    /**
     * light
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    /**
     * plane
     */
    const plane = new THREE.PlaneGeometry(6, 6);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const planeMesh = new THREE.Mesh(plane, planeMaterial);
    planeMesh.rotation.x = -Math.PI / 4;
    scene.add(planeMesh);

    const geometry = new THREE.SphereGeometry(1, 32, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    /**
     * renderer
     */
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
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

    // animations
    const tick = () => {
      requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
    };
    tick();
  }, []);

  return <canvas className="webGl"></canvas>;
};

export default Shadows;
