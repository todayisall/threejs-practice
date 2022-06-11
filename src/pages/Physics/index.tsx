import { Fragment, FunctionComponent, useEffect } from "react";
import { initStats, initWebGl } from "../common";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import { Color } from "three";
const Physics: FunctionComponent = () => {
  let scene: THREE.Scene;
  let camera: THREE.Camera;
  let controls: any;
  let renderer: THREE.Renderer;
  let stats: any;
  //   物理世界对象
  let world: any;
  const initAnimation = (fn?: any) => {
    // animations
    const tick = () => {
      requestAnimationFrame(tick);
      stats.update();
      if (fn) {
        fn();
      }
      controls.update();

      renderer.render(scene, camera);
    };
    tick();
  };

  const createSphere = (world: any) => {
    // 球体
    const radius = 1; // m
    const sphereBody = new CANNON.Body({
      mass: 5, // kg
      shape: new CANNON.Sphere(radius),
    });
    sphereBody.position.set(0, 10, 0); // m
    world.addBody(sphereBody);

    // threeJS
    const geometry = new THREE.SphereGeometry(radius);
    const material = new THREE.MeshStandardMaterial();
    const sphereMesh = new THREE.Mesh(geometry, material);
    sphereMesh.castShadow = true;
    sphereMesh.position.set(0, 10, 0);
    scene.add(sphereMesh);
    return {
      sphereBody,
      sphereMesh,
    };
  };
  useEffect(() => {
    const initResult = initWebGl();
    scene = initResult.scene;
    scene.background = new Color(0x444444);
    camera = initResult.camera;
    camera.position.set(5, 5, 5);
    renderer = initResult.renderer;
    renderer.shadowMap.enabled = true;
    const gui = new dat.GUI();
    stats = initStats();
    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const textureLoader = new THREE.TextureLoader();
    const galaxyTexture = textureLoader.load("/images/galaxy.jpeg");

    scene.add(
      new THREE.Mesh(
        new THREE.SphereBufferGeometry(100, 32, 32),
        new THREE.MeshBasicMaterial({
          side: THREE.BackSide,
          map: galaxyTexture,
        })
      )
    );
    // light
    const pointLight = new THREE.PointLight("#ffffff", 1, 10);
    pointLight.position.set(2, 5, -1);
    pointLight.castShadow = true;
    scene.add(pointLight);
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const planeGeometry = new THREE.PlaneGeometry(30, 30, 18, 18);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    });
    const lineSegments = new THREE.LineSegments(planeGeometry, lineMaterial);
    lineSegments.rotation.x = -Math.PI / 2;
    scene.add(lineSegments);
    // floor
    const plane = new THREE.Mesh(
      planeGeometry,
      new THREE.MeshStandardMaterial({
        color: 0x156289,
        emissive: 0x072534,
        flatShading: true,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true,
      })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    /**
     * Physics
     */
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    const defaultMaterial = new CANNON.Material("default");
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      }
    );

    world.addContactMaterial(defaultContactMaterial);
    world.defaultContactMaterial = defaultContactMaterial;
    const { sphereBody, sphereMesh } = createSphere(world);
    // 地板
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
    world.addBody(groundBody);

    // 物理世界的刷新频率
    const animationPhysics = () => {
      world.fixedStep();
      sphereMesh.position.copy(sphereBody.position);
    };
    initAnimation(animationPhysics);
    // 销毁时执行的方法
    return () => {
      gui.destroy();
      // 移除多余的控制面板
      document.querySelector(".statusPanel")?.remove();
    };
  }, []);
  return <canvas className="webGl"></canvas>;
};

export default Physics;
