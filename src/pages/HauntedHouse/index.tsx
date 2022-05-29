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
    tempRenderer.setClearColor("#262837");
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
      45,
      window.innerWidth / window.innerHeight,
      1,
      600
    );
    innerCamera.position.set(12, 12, 12);

    return innerCamera;
  };
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
    const doorOpacityTexture = textureLoader.load("/textures/door/opacity.jpg");
    const doorAmbientOcclusionTexture = textureLoader.load(
      "/textures/door/ambientOcclusion.jpg"
    );
    const doorHeightTexture = textureLoader.load("/textures/door/height.png");
    const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
    const doorMetallicTexture = textureLoader.load(
      "/textures/door/metallic.jpg"
    );
    const doorRoughnessTexture = textureLoader.load(
      "/textures/door/roughness.jpg"
    );

    const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
    const bricksAmbientOcclusionTexture = textureLoader.load(
      "/textures/bricks/ambientOcclusion.jpg"
    );
   
    const bricksNormalTexture = textureLoader.load(
      "/textures/bricks/normal.jpg"
    );

    const bricksRoughnessTexture = textureLoader.load(
      "/textures/bricks/roughness.jpg"
    );
    // grass
    const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
    const grassAmbientOcclusionTexture = textureLoader.load(
      "/textures/grass/ambientOcclusion.jpg"
    );
    const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");

    const grassRoughnessTexture = textureLoader.load(
      "/textures/grass/roughness.jpg"
    );
    grassColorTexture.repeat.set(8, 8)
    grassAmbientOcclusionTexture.repeat.set(8, 8)
    grassNormalTexture.repeat.set(8, 8)
    grassRoughnessTexture.repeat.set(8, 8)

    grassColorTexture.wrapS = THREE.RepeatWrapping
    grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
    grassNormalTexture.wrapS = THREE.RepeatWrapping
    grassRoughnessTexture.wrapS = THREE.RepeatWrapping

    grassColorTexture.wrapT = THREE.RepeatWrapping
    grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
    grassNormalTexture.wrapT = THREE.RepeatWrapping
    grassRoughnessTexture.wrapT = THREE.RepeatWrapping
    const canvas = document.querySelector(".webGl") as HTMLCanvasElement;
    /**
     * scene
     */
    scene = initScene();
    scene.fog = new THREE.Fog("#262837", 0, 30);
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);
    /**
     * camera
    //  */
    camera = initCamera();
    scene.add(camera);

    // floor
    const floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(100, 100),
      new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
      })
    );
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.y = 0;
    scene.add(floor);

    // house
    const house = new THREE.Group();
    scene.add(house);

    const walls = new THREE.Mesh(
      new THREE.BoxBufferGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
      })
    );
    walls.position.y = 2.5 / 2;
    house.add(walls);

    // Roof 屋顶
    const roof = new THREE.Mesh(
      new THREE.ConeBufferGeometry(3.5, 1, 4),
      new THREE.MeshStandardMaterial({ color: "#b35f45" })
    );
    roof.position.y = 2.5 + 1 / 2;
    roof.rotation.y = Math.PI / 4;
    house.add(roof);

    // door
    const door = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1.5, 2, 100, 100),
      new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorOpacityTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetallicTexture,
        roughnessMap: doorRoughnessTexture,
      })
    );
    door.position.z = 4 / 2 + 0.01;
    door.position.y = 1;
    house.add(door);

    // bush
    const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });
    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(0.8, 0.2, 2.6);

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(1.4, 0.1, 2.4);
    house.add(bush2);

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.4, 0.4, 0.4);
    bush3.position.set(-1.2, 0.2, 2.6);
    house.add(bush3);

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.15, 0.15, 0.15);
    bush4.position.set(-1.4, 0.05, 2.8);
    house.add(bush1, bush2, bush3, bush4);

    // graves
    const graves = new THREE.Group();
    scene.add(graves);

    const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
    const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 6 + 4;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const grave = new THREE.Mesh(graveGeometry, graveMaterial);
      grave.position.set(x, 0.4, z);
      grave.rotation.y = (Math.random() - 0.5) * 0.4;
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      graves.add(grave);
    }
    // init light
    const ambientLight = new THREE.AmbientLight("0xb9d5ff", 0.3);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight("0xb9d5ff", 0.3);
    light.position.set(4, 5, -2);
    scene.add(light);

    const doorLight = new THREE.PointLight("0xff7d46", 1, 7);
    doorLight.position.set(0, 2.2, 2.7);
    scene.add(doorLight);
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
