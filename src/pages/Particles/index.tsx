import { FunctionComponent, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { initWebGl } from "../common";

const Particles: FunctionComponent = () => {
  let scene: THREE.Scene;
  let camera: THREE.Camera;
  let controls: any;
  let renderer: THREE.Renderer;

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
    renderer = initResult.renderer;

    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

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
    // ???????????????
    initAnimation(renderWave.bind(null, clock, count, particlesGeometry));
  }, []);

  return <canvas className="webGl"></canvas>;
};

export default Particles;
