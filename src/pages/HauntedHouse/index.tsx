import { FunctionComponent, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";

const HauntedHouse: FunctionComponent = () => {
  let scene: any = null;
  let camera: any = null;
  let renderer: any = null;
  let controls: any = null;

  // Instantiate a loader
  const loader = new GLTFLoader();

  const animations = () => {
    // animations
    const tick = () => {
      requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
    };
    tick();
  };

  // 注册事件
  const registerEvents = (canvas: any) => {
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
  };
  // 初始化渲染器
  const initRenderer = (canvas: any) => {
    /**
     * renderer
     */
    const tempRenderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });

    tempRenderer.setPixelRatio(window.devicePixelRatio);
    tempRenderer.setSize(window.innerWidth, window.innerHeight);
    tempRenderer.physicallyCorrectLights = true;
    tempRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    tempRenderer.render(scene, camera);

    return tempRenderer;
  };
  // 初始化场景
  const initScene = () => {
    /**
     * scene
     */
    const innerScene = new THREE.Scene();
    innerScene.background = new THREE.Color(0x000000);

    return innerScene;
  };

  const initCamera = () => {
    const innerCamera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      600
    );
    innerCamera.position.set(-10, -80, 70);

    return innerCamera;
  };
  useEffect(() => {
    const canvas = document.querySelector(".webGl") as HTMLCanvasElement;
    /**
     * scene
     */
    scene = initScene();
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);
    /**
     * camera
    //  */
    camera = initCamera();
    scene.add(camera);

    // init floor
    const floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(100, 100),
      new THREE.MeshStandardMaterial({
        color: 0x7cfc00,
      })
    );
    scene.add(floor);

    const house = new THREE.Group();
    scene.add(house);

    const walls = new THREE.Mesh(
      new THREE.BoxBufferGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({ color: "#ac8e82" })
    );
    walls.position.y = 2.5 / 2;
    house.add(walls);
    // init light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 10);
    scene.add(light);
    /**
     * renderer
     */
    renderer = initRenderer(canvas);

    controls = new OrbitControls(camera, renderer.domElement);

    registerEvents(canvas);
    animations();
  }, []);

  return <canvas className="webGl"></canvas>;
};

export default HauntedHouse;
