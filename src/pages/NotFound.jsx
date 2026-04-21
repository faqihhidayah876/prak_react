import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NotFound() {
  const mountRef = useRef(null);

  useEffect(() => {
    // --- Setup Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b1a); // warna biru gelap
    scene.fog = new THREE.FogExp2(0x050b1a, 0.008); // efek kabut

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true; // mengaktifkan shadow
    mountRef.current.appendChild(renderer.domElement);

    // --- Objek Utama: Torus Knot (simpul) dengan warna neon ---
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 32, 3, 4);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff3366,
      emissive: 0x441122,
      roughness: 0.3,
      metalness: 0.7,
      emissiveIntensity: 0.8,
    });
    const knot = new THREE.Mesh(geometry, material);
    knot.castShadow = true;
    knot.receiveShadow = false;
    scene.add(knot);

    // --- Partikel bintang di latar belakang ---
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 40;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // --- Lingkaran cahaya tambahan (ring) ---
    const ringGeo = new THREE.TorusGeometry(1.4, 0.05, 64, 200);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x33ccff, emissive: 0x0066aa, emissiveIntensity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // --- Pencahayaan ---
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    // Main directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(3, 5, 2);
    dirLight.castShadow = true;
    scene.add(dirLight);
    // Back rim light
    const backLight = new THREE.PointLight(0xff44aa, 0.5);
    backLight.position.set(-2, 1, -3);
    scene.add(backLight);
    // Fill light from below
    const fillLight = new THREE.PointLight(0x44aaff, 0.3);
    fillLight.position.set(0, -2, 1);
    scene.add(fillLight);

    // --- Animasi ---
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.012;

      // Memutar knot dan ring
      knot.rotation.x = time * 0.5;
      knot.rotation.y = time * 0.8;
      ring.rotation.z = time * 0.3;
      ring.rotation.y = time * 0.5;

      // Bintang perlahan bergerak
      stars.rotation.y = time * 0.02;
      stars.rotation.x = time * 0.01;

      // Kamera sedikit bergerak (efek sinematik)
      camera.position.x += (0 - camera.position.x) * 0.05;
      camera.position.y += (Math.sin(time * 0.5) * 0.1 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // --- Handle resize window ---
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Canvas Three.js */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Teks Overlay dengan animasi CSS */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-9xl md:text-[12rem] font-black text-white drop-shadow-2xl animate-pulse tracking-wider"
            style={{ textShadow: "0 0 20px #ff3366, 0 0 40px #ff3366" }}>
          404
        </h1>
        <div className="mt-6 space-y-4">
          <p className="text-2xl md:text-3xl font-light text-gray-200 tracking-wide">
            Oops! Halaman tidak ditemukan
          </p>
          <p className="text-gray-400 max-w-md">
            Sepertinya Anda tersesat. Kembali ke dashboard atau gunakan menu navigasi.
          </p>
          <a
            href="/dashboard"
            className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}