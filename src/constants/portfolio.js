export const PORTFOLIO_CONFIG = {
  sections: [
    {
      id: 'about',
      title: 'A propos',
      color: 0x6f42c1, // Violet Solo Leveling
      position: [-4, 0, 0],
    },
    {
      id: 'projects',
      title: 'Projets',
      color: 0x4e7cff, // Bleu Solo Leveling
      position: [0, 0, -4],
    },
    {
      id: 'skills',
      title: 'Competences',
      color: 0x9370db, // Violet plus clair
      position: [4, 0, 0],
    },
    {
      id: 'contact',
      title: 'Contact',
      color: 0x0c71c3, // Bleu plus foncé
      position: [0, 0, 4],
    },
  ],
  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    position: [0, 2, 10],
  },
  controls: {
    enableDamping: true,
    dampingFactor: 0.05,
    maxDistance: 15,
    minDistance: 5,
    // Limiter la rotation verticale pour une meilleure perspective
    maxPolarAngle: Math.PI / 1.5,
    minPolarAngle: Math.PI / 6,
    // Activer l'auto-rotation pour un effet plus dynamique
    autoRotate: true,
    autoRotateSpeed: 0.5,
  },
}