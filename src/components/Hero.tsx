import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!bgRef.current) return;

    // Initialize Three.js Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bgRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      bgRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-beige"
    >
      <div ref={bgRef} className="absolute inset-0" />
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="font-display text-carbon text-shadow-luxury leading-none mt-6 mb-6">
          Shop accessories with ease and a checkout path built for everyone.
        </h1>
      </div>
    </section>
  );
}
