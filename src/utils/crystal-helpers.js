import * as THREE from 'three';

// Fonction simplifiée pour créer un cristal plus allongé verticalement
export const createCrystal = (color, size = 1) => {
  const crystalGroup = new THREE.Group();
  
  // Géométrie du cristal de base (octaèdre)
  const crystalGeometry = new THREE.OctahedronGeometry(size, 1);
  
  // Déformation pour allonger vers le haut et donner un aspect plus cristallin
  const positions = crystalGeometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    
    // Facteur de déformation et d'étirement
    const deformFactor = 0.15;
    const stretchFactorTop = 1.8; // Étirement vertical vers le haut
    const stretchFactorBottom = 1.5; // Étirement vertical vers le bas
    
    // Déformation organique
    positions.setX(i, x + (Math.sin(y * 5) * deformFactor * size));
    
    // Étirement vertical plus prononcé pour les points au-dessus de l'origine
    if (y > 0) {
      positions.setY(i, y * stretchFactorTop + (Math.cos(z * 5) * deformFactor * size));
    } else {
      // Étirement pour la partie inférieure
      positions.setY(i, y * stretchFactorBottom + (Math.cos(z * 5) * deformFactor * size));
    }
    
    positions.setZ(i, z + (Math.sin(x * 5) * deformFactor * size));
  }
  
  crystalGeometry.computeVertexNormals();
  
  // Matériau du cristal - semi-transparent avec aspect cristallin et reflets
  const outerMaterial = new THREE.MeshPhysicalMaterial({
    color: color,
    transparent: true,
    opacity: 0.7,
    roughness: 0.05, // Plus lisse
    metalness: 0.1,
    transmission: 0.7, // Plus transparent
    thickness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02, // Plus brillant
    emissive: new THREE.Color(color).multiplyScalar(0.2), // Émission faible par défaut
    emissiveIntensity: 0.0, // Intensité initiale à 0
  });
  
  // Maillage principal du cristal
  const crystalMesh = new THREE.Mesh(crystalGeometry, outerMaterial);
  crystalMesh.castShadow = true;
  crystalMesh.receiveShadow = true;
  crystalGroup.add(crystalMesh);
  
  // Noyau interne (plus simple)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.1
  });
  
  const coreGeometry = crystalGeometry.clone();
  const coreScale = 0.65;
  
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  coreMesh.scale.set(coreScale, coreScale, coreScale);
  crystalGroup.add(coreMesh);
  
  // Stocker les éléments dans userData pour pouvoir les manipuler plus tard
  crystalGroup.userData = {
    crystal: crystalMesh,
    core: coreMesh,
    color: color
  };
  
  return crystalGroup;
};

// Fonction pour créer un label de texte avec effet Solo Leveling
export const createCrystalLabel = async (text, color) => {
  // Créer une texture de texte avec effets avancés
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 1024; // Haute résolution
  canvas.height = 256;
  
  // Extraire les composantes de la couleur
  const hexColor = '#' + new THREE.Color(color).getHexString();
  
  // Fond transparent
  context.fillStyle = 'rgba(0, 0, 0, 0)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Effet de lueur externe
  context.shadowColor = hexColor;
  context.shadowBlur = 30;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  
  // Texte principal avec dégradé
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.5, '#f0f0f0');
  gradient.addColorStop(1, '#e0e0e0');
  
  context.fillStyle = gradient;
  // Style du texte pour un rendu plus net et moins imposant
  context.font = 'bold 84px "Segoe UI", Arial, sans-serif';  // Police un peu plus petite
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
  
  // Deuxième couche de texte avec effet de contour lumineux
  context.strokeStyle = hexColor;
  context.lineWidth = 6;
  context.strokeText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
  
  // Ajouter une ombre intérieure subtile
  context.shadowColor = 'rgba(0, 0, 0, 0.7)';
  context.shadowBlur = 10;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  context.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
  
  // Créer une texture à partir du canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  
  // Créer un matériau avec la texture et des paramètres avancés
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0, // Commence invisible
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending // Pour des couleurs plus vives
  });
  
  // Créer un plan pour afficher le texte - taille réduite pour éviter qu'il soit trop grand
  const geometry = new THREE.PlaneGeometry(15, 4);
  const textMesh = new THREE.Mesh(geometry, material);
  
  return textMesh;
};

// Fonction pour activer visuellement un cristal
export const activateCrystal = (crystalGroup) => {
  if (crystalGroup.userData.core) {
    crystalGroup.userData.core.material.opacity = 0.8;
  }
};

// Fonction pour désactiver visuellement un cristal
export const deactivateCrystal = (crystalGroup) => {
  if (crystalGroup.userData.core) {
    crystalGroup.userData.core.material.opacity = 0.1;
  }
};