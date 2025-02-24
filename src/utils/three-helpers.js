import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// Fonction pour créer les lumières de la scène
export const createLights = (scene) => {
  // Lumière ambiante plus sombre pour une ambiance mystérieuse
  const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.4)
  
  // Lumière ponctuelle principale en violet/bleu
  const purpleLight = new THREE.PointLight(0x6f42c1, 1.5)
  purpleLight.position.set(5, 5, 5)
  
  // Lumière ponctuelle secondaire en bleu
  const blueLight = new THREE.PointLight(0x4e7cff, 1)
  blueLight.position.set(-5, -5, -5)
  
  // Ajout d'une lumière directionnelle pour les ombres
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
  directionalLight.position.set(0, 10, 0)
  
  scene.add(ambientLight)
  scene.add(purpleLight)
  scene.add(blueLight)
  scene.add(directionalLight)
  
  // Créer des particules pour l'effet d'ombre
  createParticles(scene)
}

// Fonction pour créer des particules d'ambiance
export const createParticles = (scene) => {
  const particleCount = 300
  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    // Répartition aléatoire dans un espace plus large
    particlePositions[i] = (Math.random() - 0.5) * 30
    particlePositions[i + 1] = (Math.random() - 0.5) * 30
    particlePositions[i + 2] = (Math.random() - 0.5) * 30
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  
  // Dégradé de violet à bleu pour les particules
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x6f42c1,
    size: 0.1,
    transparent: true,
    opacity: 0.6,
  })
  
  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)
  
  // Animation des particules
  return particles
}

// Fonction pour créer un texte 3D
export const createText3D = (text, size = 0.6, color = 0xffffff) => {
  return new Promise((resolve) => {
    const loader = new FontLoader();
    
    // Chargement de la police (font)
    loader.load('/fonts/helvetiker_bold.typeface.json', function (font) {
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: size,
        height: size * 0.15, // Épaisseur du texte légèrement augmentée
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: size * 0.03,
        bevelSize: size * 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      });
      
      // Centrer le texte
      textGeometry.computeBoundingBox();
      const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
      const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
      textGeometry.translate(-textWidth / 2, -textHeight / 2, 0);
      
      resolve(textGeometry);
    });
  });
}

// Fonction pour créer un matériau pour le texte 3D
export const createMaterial = (type, color) => {
  // Matériaux améliorés avec effets pour Solo Leveling
  const commonProps = {
    transparent: true,
    opacity: 0.9,
    metalness: 0.7,
    roughness: 0.1, // Plus lisse pour plus de brillance
  }
  
  switch (type) {
    case 'about':
      return new THREE.MeshStandardMaterial({
        ...commonProps,
        color: 0x8a5cf6, // Violet légèrement plus vif
        emissive: 0x4c1d95,
        emissiveIntensity: 0.6,
      })
    case 'projects':
      return new THREE.MeshStandardMaterial({
        ...commonProps,
        color: 0x60a5fa, // Bleu légèrement plus vif
        emissive: 0x1e40af,
        emissiveIntensity: 0.6,
      })
    case 'skills':
      return new THREE.MeshStandardMaterial({
        ...commonProps,
        color: 0xc084fc, // Violet plus clair et plus vif
        emissive: 0x6b21a8,
        emissiveIntensity: 0.6,
      })
    case 'contact':
      return new THREE.MeshStandardMaterial({
        ...commonProps,
        color: 0x38bdf8, // Bleu ciel plus vif
        emissive: 0x0369a1,
        emissiveIntensity: 0.6,
      })
    default:
      return new THREE.MeshStandardMaterial({
        ...commonProps,
        color: color || 0x8a5cf6,
      })
  }
}