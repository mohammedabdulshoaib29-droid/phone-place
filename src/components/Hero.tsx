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
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-16 -bottom-16 will-change-transform"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/7989741/pexels-photo-7989741.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-carbon/90 via-carbon/50 to-carbon/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-carbon/60 via-transparent to-carbon/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <p
          className="font-body text-gold text-xs uppercase animate-fade-in"
          style={{ letterSpacing: '0.4em', animationDelay: '0.3s' }}
        >
          Phone Palace &nbsp;·&nbsp; Amberpet, Hyderabad
        </p>

        {/* Hero headline */}
        <h1
          className="font-display text-ivory text-shadow-luxury leading-none mt-6 mb-6 animate-fade-up"
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 7rem)',
            fontStyle: 'italic',
            fontWeight: 900,
            animationDelay: '0.6s',
          }}
        >
          Experience Premium<br />Accessories
        </h1>

        {/* Gold divider */}
        <div
          className="mx-auto mb-8 animate-fade-in"
          style={{
            width: '80px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            animationDelay: '1s',
          }}
        />

        {/* Subtitle */}
        <p
          className="font-body text-silver text-sm md:text-base uppercase animate-fade-in"
          style={{ letterSpacing: '0.2em', animationDelay: '1.1s' }}
        >
          Where luxury meets technology
        </p>

        {/* CTA */}
        <div
          className="mt-14 animate-fade-in flex flex-col items-center gap-3"
          style={{ animationDelay: '1.4s' }}
        >
          <a
            href="#collection"
            className="font-body text-silver text-xs tracking-widest uppercase hover:text-gold transition-colors duration-300"
            style={{ letterSpacing: '0.3em' }}
          >
            Explore Collection
          </a>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-gold"
            style={{ animation: 'bounce 2s infinite' }}
          >
            <path
              d="M10 3v11M5 9l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
