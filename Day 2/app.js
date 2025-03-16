// Three.js ka scene create karna (yeh humara 3D world hoga)
const scene = new THREE.Scene();

// Perspective camera create karna
const camera = new THREE.PerspectiveCamera(
  65, // Field of view (FOV)
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  100  // Far clipping plane
);

// Camera ko thoda aage move karna taake object dikh sake
camera.position.z = 5;

// Scene mein camera add karna
scene.add(camera);

// Ek 3D box (cube) ka geometry create karna
let box = new THREE.BoxGeometry(1, 1, 1); // Width, height, depth

// Material define karna (red color ka basic material)
let material = new THREE.MeshBasicMaterial({ color: 'red' });

// Geometry aur material ko combine karke mesh create karna
let mesh = new THREE.Mesh(box, material);



// mesh.rotation.x = Math.PI; // Math.PI = 180 degrees
// mesh.rotation.x = Math.PI * 2; // Math.PI * 2 = 360 degrees  // of course
// mesh.rotation.y = Math.PI / 4; // Math.PI / 4 = 45 degrees
// mesh.rotation.y = Math.PI / 2; // Math.PI / 2 = 90 degrees



// Mesh ko scene mein add karna
scene.add(mesh);

// HTML document se <canvas> element ko select karna
let canvas = document.querySelector('canvas');

// WebGL renderer create karna aur usay canvas se connect karna
let renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

// Renderer ka size set karna window ke size ke barabar
renderer.setSize(window.innerWidth, window.innerHeight);

// Scene ko render karna taake 3D object dikhai de
renderer.render(scene, camera);


// Animation loop create karna
let clock = new THREE.Clock();
function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  mesh.rotation.x = clock.getElapsedTime();
  mesh.rotation.y = clock.getElapsedTime();
}
animate();