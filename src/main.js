import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(1, 1, 5);

// Renderer with better error handling
// Replace your renderer initialization with this robust version
let renderer;

function initRenderer() {
  try {
    // First try WebGL2 with fallback to WebGL1
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true, // Helps with some mobile devices
    });

    // Verify context was created
    if (!renderer.getContext()) {
      throw new Error("Could not create WebGL context");
    }

    return true;
  } catch (error) {
    console.error("WebGL initialization failed:", error);

    // Show user-friendly error message
    const warning = document.createElement("div");
    warning.style = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      padding: 20px;
      background: #ff3333;
      color: white;
      text-align: center;
      z-index: 10000;
    `;
    warning.innerHTML = `
      <h2>Graphics Error</h2>
      <p>This application requires WebGL which is not supported or was blocked by your browser.</p>
      <p>Try these solutions:</p>
      <ul style="text-align: left; display: inline-block;">
        <li>Update your browser</li>
        <li>Check browser settings to enable WebGL</li>
        <li>Restart your browser</li>
        <li>Try on a different device</li>
      </ul>
    `;
    document.body.appendChild(warning);

    return false;
  }
}

if (!initRenderer()) {
  // Stop execution if renderer couldn't be created
  throw new Error("Critical: WebGL renderer could not be initialized");
}
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit to 2x for performance
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
document.body.appendChild(renderer.domElement);

// Add context lost event handler
renderer.domElement.addEventListener("webglcontextlost", (event) => {
  event.preventDefault();
  console.warn("WebGL context lost. Attempting recovery...");
  // You could add recovery logic here
});

// Add context restored event handler
renderer.domElement.addEventListener("webglcontextrestored", () => {
  console.log("WebGL context restored. Refreshing page...");
  window.location.reload(); // Simple solution - refresh the page
});

// Or if you want to properly reinitialize:
/*
function initScene() {
  // Recreate your scene, camera, controls, loaders, etc.
  // This would be similar to your existing setup code
  console.log("Reinitializing scene...");
  // You would need to implement all the initialization logic here
}

// Then use this in the event handler:
renderer.domElement.addEventListener("webglcontextrestored", () => {
  console.log("WebGL context restored. Reinitializing...");
  initScene();
});
*/

// HDRI Environment Lighting
const hdriLoader = new RGBELoader();
hdriLoader.load(
  "./3d_Models_and_Background/horn-koppe_snow_4k.hdr",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
  },
  undefined,
  (error) => {
    console.error("Error loading HDRI:", error);
  }
);

// 3D Model loading with better error handling
const loader = new GLTFLoader();
loader.load(
  "3d_Models_and_Background/armored_mech_noir_npr.glb",
  function (gltf) {
    scene.add(gltf.scene);
  },
  undefined, // Progress callback can go here
  function (error) {
    console.error("Error loading GLTF model:", error);
  }
);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;

// Window resize handler with debounce to prevent rapid calls
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, 200);
});

// Animation loop with error handling
function animate() {
  try {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  } catch (error) {
    console.error("Error in animation loop:", error);
    // You might want to attempt recovery here
  }
}

// Start the animation
animate();

// Cleanup function for when the page is closed/unloaded
window.addEventListener("beforeunload", () => {
  // Properly dispose of Three.js resources
  scene.traverse((object) => {
    if (object.isMesh) {
      object.geometry?.dispose();
      object.material?.dispose();
    }
  });
  renderer.dispose();
});
