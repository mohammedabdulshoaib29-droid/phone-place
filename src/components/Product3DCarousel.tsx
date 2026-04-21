import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Product } from '../data/products';
import gsap from 'gsap';

interface Product3DCarouselProps {
  products: Product[];
  onProductSelect?: (product: Product) => void;
}

export default function Product3DCarousel({ products, onProductSelect }: Product3DCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const productMeshesRef = useRef<THREE.Group[]>([]);
  const scrollVelocityRef = useRef(0);
  const rotationVelocityRef = useRef(0);
  const currentRotationRef = useRef(0);
  const geometriesRef = useRef<THREE.BufferGeometry[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ========== 1. SCENE SETUP ==========
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e1a);
    sceneRef.current = scene;

    // ========== 2. CAMERA SETUP ==========
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // ========== 3. RENDERER SETUP (Performance Optimized) ==========
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ========== 4. LIGHTING SETUP ==========
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(5, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const goldLight = new THREE.PointLight(0xc9a84c, 0.8, 20);
    goldLight.position.set(-5, 3, 5);
    goldLight.castShadow = true;
    scene.add(goldLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // ========== 5. CREATE PRODUCT GEOMETRIES (Performance Optimized) ==========
    const productMeshes: THREE.Group[] = [];
    const productCount = Math.min(products.length, 8);

    for (let i = 0; i < productCount; i++) {
      const product = products[i];
      const group = new THREE.Group();

      const geometry = new THREE.BoxGeometry(1.5, 2, 0.5);
      geometriesRef.current.push(geometry);

      const material = new THREE.MeshStandardMaterial({
        color: 0x2a3f5f,
        metalness: 0.6,
        roughness: 0.3,
        envMapIntensity: 1,
        emissive: 0x0a0f1a,
        emissiveIntensity: 0.1,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { productId: product.id, productData: product };

      const screenGeometry = new THREE.BoxGeometry(1.4, 1.8, 0.05);
      geometriesRef.current.push(screenGeometry);
      const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        metalness: 0.1,
        roughness: 0.05,
        emissive: 0x0066ff,
        emissiveIntensity: 0.2,
      });
      const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
      screenMesh.position.z = 0.3;
      screenMesh.castShadow = true;
      screenMesh.receiveShadow = true;
      mesh.add(screenMesh);

      group.add(mesh);

      const angle = (i / productCount) * Math.PI * 2;
      const radius = 5;
      group.position.x = Math.cos(angle) * radius;
      group.position.z = Math.sin(angle) * radius;
      group.position.y = Math.cos(angle * 0.5) * 1.5;

      group.userData = { index: i, angle };

      scene.add(group);
      productMeshes.push(group);
    }

    productMeshesRef.current = productMeshes;

    // ========== 6. PARTICLE SYSTEM (Visual Effects) ==========
    const particleCount = 50;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 20;
      particlePositions[i * 3 + 1] = Math.random() * 8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.01;
      particleVelocities[i * 3 + 1] = Math.random() * 0.005;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc9a84c,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    const particleVelocitiesRef = {
      velocities: particleVelocities,
      positions: particlePositions,
    };

    // ========== 7. INTERACTIVE BEHAVIORS ==========
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh: THREE.Group | null = null;

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        productMeshes.map((pm) => pm.children[0]),
        false
      );

      if (hoveredMesh && hoveredMesh.children[0] instanceof THREE.Mesh) {
        const material = (hoveredMesh.children[0] as THREE.Mesh)
          .material as THREE.MeshStandardMaterial;
        gsap.to(hoveredMesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        material.emissiveIntensity = 0;
      }

      if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        hoveredMesh = productMeshes.find((pm) => pm.children[0] === hitObject) || null;

        if (hoveredMesh) {
          gsap.to(hoveredMesh.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.3 });
          const material = (hoveredMesh.children[0] as THREE.Mesh)
            .material as THREE.MeshStandardMaterial;
          material.emissiveIntensity = 0.3;
        }
      }
    };

    const onClick = () => {
      if (hoveredMesh) {
        const product = hoveredMesh.children[0].userData.productData;
        setSelectedProduct(product);
        onProductSelect?.(product);
      }
    };

    let lastScrollY = 0;
    const onScroll = () => {
      const deltaY = window.scrollY - lastScrollY;
      scrollVelocityRef.current = deltaY * 0.002;
      lastScrollY = window.scrollY;
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);
    window.addEventListener('scroll', onScroll, { passive: true });

    // ========== 7. ANIMATION LOOP ==========
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      rotationVelocityRef.current += scrollVelocityRef.current;
      rotationVelocityRef.current *= 0.95;
      currentRotationRef.current += rotationVelocityRef.current;

      productMeshes.forEach((group) => {
        const baseAngle = group.userData.angle;
        const newAngle = baseAngle + currentRotationRef.current;

        const radius = 5;
        group.position.x = Math.cos(newAngle) * radius;
        group.position.z = Math.sin(newAngle) * radius;

        group.position.y = Math.cos(newAngle * 0.5) * 1.5 + Math.sin(Date.now() * 0.001) * 0.3;

        (group.children[0] as THREE.Mesh).lookAt(camera.position);
      });

      if (productMeshes.length > 0) {
        const firstProduct = productMeshes[0];
        goldLight.position.lerp(
          new THREE.Vector3(firstProduct.position.x * 1.2, 3, firstProduct.position.z * 1.2),
          0.1
        );
      }

      const positions = particleVelocitiesRef.positions;
      const velocities = particleVelocitiesRef.velocities;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        if (positions[i * 3] > 10) positions[i * 3] = -10;
        if (positions[i * 3 + 1] > 8) positions[i * 3 + 1] = 0;
        if (positions[i * 3 + 2] > 10) positions[i * 3 + 2] = -10;
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.z += 0.0001;

      const scrollPercent = (window.scrollY / document.documentElement.scrollHeight) * Math.PI;
      camera.position.x = Math.sin(scrollPercent) * 3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // ========== 8. HANDLE RESIZE ==========
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ========== 9. RESPECT REDUCED MOTION ==========
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      rotationVelocityRef.current = 0;
      scrollVelocityRef.current = 0;
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);

      renderer.dispose();

      geometriesRef.current.forEach((geom) => geom.dispose());

      productMeshes.forEach((group) => {
        group.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      });
      particleGeometry.dispose();
      particleMaterial.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [products, onProductSelect]);

  return (
    <div className="w-full">
      <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
      {selectedProduct && (
        <div className="mt-6 p-6 bg-gradient-to-r from-carbon/80 to-carbon/60 rounded-lg border border-gold/30">
          <h3 className="text-xl font-display text-ivory">{selectedProduct.name}</h3>
          <p className="text-silver text-sm mt-2">{selectedProduct.tagline}</p>
          <p className="text-gold font-body text-lg mt-4">₹{selectedProduct.price}</p>
        </div>
      )}
    </div>
  );
}
