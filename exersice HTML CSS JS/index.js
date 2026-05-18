// 1. Scene Setup
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

// 2. Camera Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;
scene.add(camera);

// 3. Renderer Setup
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 4. Create Particle Sphere Geometry
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000; 

const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 6;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Particle Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.007,
    color: '#00ffcc',
    transparent: true,
    opacity: 0.7
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// 5. Track Scroll and Mouse Positions
let scrollY = window.scrollY;
let mouseX = 0;
let mouseY = 0;

// Listen for Scroll events
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Listen for Mouse movements (combines mouse depth with scroll)
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
});

// 6. Responsive Window Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// 7. Animation Loop
const clock = new THREE.Clock();

const animate = () => {
    window.requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Base constant auto-rotation
    particlesMesh.rotation.y = elapsedTime * 0.03;

    // SCROLL ANIMATION EFFECTS:
    // As you scroll down, spin the 3D space and move it horizontally
    particlesMesh.rotation.z = scrollY * 0.001; 
    particlesMesh.rotation.x = scrollY * 0.0005;
    
    // Smoothly push the mesh left and right depending on scroll depth
    particlesMesh.position.x = Math.sin(scrollY * 0.002) * 0.5;

    // Slight parallax overlay using mouse position
    particlesMesh.rotation.x += -mouseY * 0.2;
    particlesMesh.rotation.y += mouseX * 0.2;

    // Render 
    renderer.render(scene, camera);
};

animate();