import { FunctionComponent, useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { initWebGl } from "../common";
import * as dat from "dat.gui";
import * as THREE from "three";
const Galaxy: FunctionComponent = () => {
  let scene: THREE.Scene;
  let camera: THREE.Camera;
  let controls: any;
  let renderer: THREE.Renderer;
  let gui: any;
  const initAnimation = (fn?: any) => {
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
    const initResult = initWebGl();
    scene = initResult.scene;
    camera = initResult.camera;
    renderer = initResult.renderer;
    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // gui
    gui = new dat.GUI({ width: 360 });

    // Galaxy
    const parameters = {
      count: 100000,
      size: 0.01,
      radius: 3,
      branches: 3,
      spin: 1,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: "#ff6030",
      outsideColor: "#1b3984",
    };

    let galaxyGeometry: THREE.BufferGeometry;
    let galaxyMaterial: THREE.PointsMaterial;
    let galaxy: THREE.Points;

    // const axesHelper = new THREE.AxesHelper();
    // scene.add(axesHelper);
    const randomPos = (radius: number) => {
      return (
        Math.pow(Math.random(), parameters.randomnessPower) *
        parameters.randomness *
        radius *
        (Math.random() < 0.5 ? -1 : 1)
      );
    };
    const insideColor = new THREE.Color(parameters.insideColor);
    const outsideColor = new THREE.Color(parameters.outsideColor);
    const generateGalaxy = () => {
      if (galaxy) {
        galaxyGeometry.dispose();
        galaxyMaterial.dispose();
        scene.remove(galaxy);
      }
      galaxyGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // positions
        const radius = Math.random() * parameters.radius;
        const angle =
          (2 * Math.PI * (i % parameters.branches)) / parameters.branches;
        const spinAngle = parameters.spin * radius;

        const randomX = randomPos(radius);
        const randomY = randomPos(radius);
        const randomZ = randomPos(radius);

        positions[i3] = Math.cos(angle + spinAngle) * radius + randomX;
        positions[i3 + 1] = Math.sin(angle + spinAngle) * radius + randomY;
        positions[i3 + 2] = randomZ;

        // colors
        const mixColor = insideColor.clone();
        mixColor.lerp(outsideColor, radius / parameters.radius);

        colors[i3] = mixColor.r;
        colors[i3 + 1] = mixColor.g;
        colors[i3 + 2] = mixColor.b;
      }

      galaxyGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      galaxyGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
      );

      galaxyMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: true,
        blending: THREE.AdditiveBlending,
        color: "#ff88cc",
        vertexColors: true,
      });

      galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
      scene.add(galaxy);
    };
    generateGalaxy();

    gui
      .add(parameters, "count")
      .min(100)
      .max(1000000)
      .step(100)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "size")
      .min(0.01)
      .max(0.5)
      .step(0.01)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "radius")
      .min(0.01)
      .max(50)
      .step(0.01)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "branches")
      .min(2)
      .max(16)
      .step(1)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "spin")
      .min(-5)
      .max(5)
      .step(0.01)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "randomness")
      .min(0)
      .max(2)
      .step(0.001)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "randomnessPower")
      .min(0)
      .max(12)
      .step(0.01)
      .onFinishChange(generateGalaxy);
    gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
    gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);
    initAnimation();

    // 销毁时执行的方法
    return () => {
      gui.destroy();
    };
  }, []);
  return <canvas className="webGl"></canvas>;
};

export default Galaxy;
