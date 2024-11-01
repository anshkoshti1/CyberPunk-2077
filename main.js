import '../cyberpunk/style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import gsap from 'gsap';
// import LocomotiveScroll from 'locomotive-scroll';
// const locomotiveScroll = new LocomotiveScroll();



// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 3.5;

// objects
// const geometry = new THREE.BoxGeometry(1,1,1);
// const material = new THREE.MeshBasicMaterial({ color: "white" });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// Load HDRI
const rgbeLoader = new RGBELoader();
rgbeLoader.load(
  'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr',
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    // scene.background = texture;
  },
  undefined,
  function (error) {
    console.error('An error occurred loading the HDRI:', error);
  }
);

// Load GLTF model
let model;

// Load GLTF model
const loader = new GLTFLoader();
loader.load(
  './DamagedHelmet.gltf',
  function (gltf) {
    model = gltf.scene;
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
  alpha: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(window.innerWidth, window.innerHeight);

// controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // optional, for smoother controls

// postprocessing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0025; // Adjust the amount of RGB shift
composer.addPass(rgbShiftPass);

// mousemove
window.addEventListener("mousemove",(e)=>{
  if(model){
    const rotationX = (e.clientX / window.innerWidth - .5) * (Math.PI * .15);
    const rotationY = (e.clientY / window.innerHeight - .5) * (Math.PI * .15);
    gsap.to(model.rotation, {
      x: rotationY,
      y: rotationX,
      duration: 1,
      ease: "power2.out"
    });
  }
})

window.addEventListener('resize',()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
})


// animate
function animate() {
  window.requestAnimationFrame(animate);
  
  // controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  // cube.rotation.y += 0.01;

  composer.render();
}
animate();


document.querySelectorAll('.social-icon img').forEach((icon) => {
  const originalSrc = icon.src;
  const hoverSrc = icon.getAttribute('data-hover');

  icon.addEventListener('mouseenter', () => {
    icon.src = hoverSrc;
    icon.style.scale = 1.3;
    icon.style.transition = 'all .3s ease-in-out';
  });

  icon.addEventListener('mouseleave', () => {
    icon.src = originalSrc;
    icon.style.scale = 1;
  });
});
