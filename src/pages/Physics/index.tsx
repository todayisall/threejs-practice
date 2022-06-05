import { FunctionComponent, useEffect } from "react";
import { initWebGl } from "../common";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CANNON from "cannon-es";
const Physics: FunctionComponent = () => {
  let scene: THREE.Scene;
  let camera: THREE.Camera;
  let controls: any;
  let renderer: THREE.Renderer;

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
    camera.position.set(5, 5, 5);
    renderer = initResult.renderer;
    renderer.shadowMap.enabled = true;
    const gui = new dat.GUI();

    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // light
    const pointLight = new THREE.PointLight("#ffffff", 1, 10);
    pointLight.position.set(2, 5, -1);
    pointLight.castShadow = true;
    scene.add(pointLight);
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // const pointLightHelper = new THREE.PointLightHelper(pointLight)
    // scene.add(pointLightHelper)
    // plane
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: "#ffffff" })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
    // test sphere

    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 32, 32),
      new THREE.MeshStandardMaterial({
        color: "red",
      })
    );
    sphere.castShadow = true;
    sphere.position.y = 0.5 + 2;
    scene.add(sphere);

    initAnimation();
    // 销毁时执行的方法
    return () => {
      gui.destroy();
    };
  }, []);
  return <canvas className="webGl"></canvas>;
};

export default Physics;
