import { FunctionComponent, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as dat from "dat.gui";
import TWEEN from "@tweenjs/tween.js";

const HauntedHouse: FunctionComponent = () => {
  const params = {
    envMap: "HDR",
    roughness: 0.0,
    metalness: 0.0,
    exposure: 1.0,
    debug: false,
  };

  let isPlaying = false;
  let deskStatus = "up"; // down
  let posSound: any = null;

  // Instantiate a loader
  const loader = new GLTFLoader();

  useEffect(() => {
    const canvas = document.querySelector(".webGl") as HTMLCanvasElement;
    /**
     * scene
     */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // 第一种方式 6张图片的环境贴图
    // scene.background = new THREE.CubeTextureLoader()
    //   .setPath("/textures/cube/indoor/")
    //   .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

    /**
     * camera
    //  */
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      600
    );
    camera.position.set(0, 30, 130);
    const listener = new THREE.AudioListener();
    camera.add(listener);
    scene.add(camera);

    // const helper = new THREE.CameraHelper(camera);
    // scene.add(helper);
    // const axesHelper = new THREE.AxesHelper(100);
    // scene.add(axesHelper);

    const startAnimation = () => {
      const deskTop = scene.getObjectByName("Table");
      const deskPositionY = [1.2, 0.75];
      if (deskTop?.position && !isPlaying) {
        posSound.play();
        const gentTween = new TWEEN.Tween(deskTop.position)
          .to(
            {
              y: deskPositionY[deskStatus === "up" ? 0 : 1],
            },
            2000
          )
          .onComplete((obj) => {
            isPlaying = false;
          })
          .start();
        isPlaying = true;
      }
    };

    const panelControls = new (function () {
      this.deskStatus = deskStatus;
    })();
    const controlsGUI = new dat.GUI({ name: "Controls" });
    controlsGUI
      .add(panelControls, "deskStatus", ["up", "down"])
      .onChange((value) => {
        deskStatus = value;
        startAnimation();
      });
    scene.add(controlsGUI);
    /**
     * 加载桌子
     */
    loader.load(
      // resource URL
      "/models/desk/lifting_desk.gltf",
      function (gltf: any) {
        console.log("gltf", gltf);
        gltf.scene.scale.set(50, 50, 50);
        gltf.scene.position.set(0, -50, 0);
        scene.add(gltf.scene);

        const deskTop = scene.getObjectByName("Table");
        // 声音文件.
        if (deskTop?.position) {
          posSound = new THREE.PositionalAudio(listener);
          const audioLoader = new THREE.AudioLoader();
          audioLoader.load("/models/desk/audio.mp3", (buffer) => {
            posSound.setBuffer(buffer);
            posSound.setRefDistance(30);
            // posSound.posSound.setRolloffFactor(0.8);
          });
        }
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
     * renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.render(scene, camera);

    // 加载环境贴图
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    new RGBELoader().load("/textures/cube/indoorHDR/px.hdr", (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      pmremGenerator.dispose();
      scene.background = envMap;
      scene.environment = envMap;
    });

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
      TWEEN.update();
      requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
    };
    tick();
    return () => {
      // Clean up the subscription
      controlsGUI.destroy();
    };
  }, []);

  return <canvas className="webGl"></canvas>;
};

export default HauntedHouse;
