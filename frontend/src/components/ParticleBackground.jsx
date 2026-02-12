import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // 2. Create Firefly Particles
    const particlesCount = 200; // Fewer particles for a cleaner look
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const speeds = new Float32Array(particlesCount); // Custom speed for each
    const phases = new Float32Array(particlesCount); // Custom sway phase for each
    const colors = new Float32Array(particlesCount * 3);

    // Cute Color Palette: Indigo, Soft Pink, Cyan
    const colorPalette = [
      new THREE.Color('#818cf8'), // Indigo
      new THREE.Color('#c084fc'), // Purple
      new THREE.Color('#f472b6'), // Pink
      new THREE.Color('#22d3ee'), // Cyan
    ];

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      // Spread randomly across the screen width/height
      positions[i3] = (Math.random() - 0.5) * 20;     // x
      positions[i3 + 1] = (Math.random() - 0.5) * 15; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 10; // z (depth)

      speeds[i] = 0.005 + Math.random() * 0.01; // Random slow upward speed
      phases[i] = Math.random() * Math.PI * 2;  // Random starting point for swaying

      // Assign a random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material - Soft glowing circles
    const material = new THREE.PointsMaterial({
      size: 0.15, // Slightly larger "orbs"
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      map: createCircleTexture(), // Helper function below creates a soft circle
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    camera.position.z = 5;

    // 3. Animation Loop (The Gentle Float)
    const animate = () => {
      requestAnimationFrame(animate);

      const positionsAttribute = geometry.attributes.position;
      const positionsArray = positionsAttribute.array;

      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;

        // Move Upwards
        positionsArray[i3 + 1] += speeds[i];

        // Gentle Swaying (Sine wave)
        // We change X slightly based on time + individual phase
        positionsArray[i3] += Math.sin(Date.now() * 0.001 + phases[i]) * 0.002;

        // Reset if it goes off top of screen
        if (positionsArray[i3 + 1] > 8) {
          positionsArray[i3 + 1] = -8; // Move to bottom
          positionsArray[i3] = (Math.random() - 0.5) * 20; // New random X
        }
      }

      positionsAttribute.needsUpdate = true; // Tell Three.js positions changed
      renderer.render(scene, camera);
    };

    animate();

    // 4. Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Helper to create a soft glow texture via code (no image file needed)
  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  return (
    <div 
      ref={mountRef} 
      className="absolute top-0 left-0 w-full h-full -z-10 bg-gray-900"
      style={{ overflow: 'hidden' }}
    />
  );
};

export default ParticleBackground;