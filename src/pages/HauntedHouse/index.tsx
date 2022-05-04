import { FunctionComponent, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const HauntedHouse: FunctionComponent = () => {
  const params = {
    envMap: "HDR",
    roughness: 0.0,
    metalness: 0.0,
    exposure: 1.0,
    debug: false,
  };
  // Instantiate a loader
  const loader = new GLTFLoader();
  // 位置声音文件
  const posSound = null;
  useEffect(() => {
    const canvas = document.querySelector(".webGl") as HTMLCanvasElement;

    /**
     * scene
     */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    scene.background = new THREE.CubeTextureLoader()
      .setPath("/textures/cube/indoor/")
      .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
    /**
     * camera
     */
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 120);
    scene.add(camera);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    /**
     * 加载桌子
     */
    loader.load(
      // resource URL
      "/models/desk/lifting_desk.gltf",
      function (gltf: any) {
        console.log("gltf", gltf);
        gltf.scene.scale.set(15, 15, 15);
        gltf.scene.position.set(0, -50, 0);
        scene.add(gltf.scene);

        const deskTop = scene.getObjectByName("Table");
        // // 声音文件.
        // if (deskTop?.position) {
        //   posSound = new THREE.PositionalAudio(listener);
        //   const audioLoader = new THREE.AudioLoader();
        //   audioLoader.load("/models/left_desk/audio.mp3", (buffer) => {
        //     posSound.setBuffer(buffer);
        //     posSound.setRefDistance(30);
        //     posSound.posSound.setRolloffFactor(0.8);
        //   });
        // }
        // renderScene();
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );
    /**
     * light
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const geometry = new THREE.PlaneGeometry(200, 200);
    const material = new THREE.MeshBasicMaterial();

    // const planeMesh = new THREE.Mesh(geometry, material);
    // planeMesh.position.y = -50;
    // planeMesh.rotation.x = -Math.PI * 0.5;
    // scene.add(planeMesh);

    /**
     * renderer
     */
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
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

export default HauntedHouse;
