import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createCrystal, createCrystalLabel } from '../utils/crystal-helpers';

// Configuration des sections
const SECTIONS = [
  { id: 'about', title: 'À propos' },
  { id: 'projects', title: 'Projets' },
  { id: 'skills', title: 'Compétences' },
  { id: 'contact', title: 'Contact' }
];

const Portfolio3D = ({ activeSection, setActiveSection }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const crystalsRef = useRef([]);
  const raycasterRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2());
  const lastFrameTimeRef = useRef(null);
  const hoveredCrystalRef = useRef(null);
  
  // Références pour les event handlers
  const handlersRef = useRef({
    mouseMove: null,
    click: null,
    resize: null
  });

  // Définir updateEventListeners avec useCallback pour qu'il soit accessible partout
  const updateEventListeners = useCallback(() => {
    if (!handlersRef.current.mouseMove) return;
    
    // Retirer d'abord tous les écouteurs existants
    window.removeEventListener('mousemove', handlersRef.current.mouseMove);
    window.removeEventListener('click', handlersRef.current.click);
    
    // N'ajouter les écouteurs que si aucune section n'est active
    if (!activeSection) {
      window.addEventListener('mousemove', handlersRef.current.mouseMove);
      window.addEventListener('click', handlersRef.current.click);
    }
    
    // Toujours garder l'écouteur de redimensionnement
    window.addEventListener('resize', handlersRef.current.resize);
  }, [activeSection]);

  const animationFrameIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Configuration de la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814); // Fond bleu très foncé
    sceneRef.current = scene;

    // Configuration de la caméra
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 18); // Caméra un peu plus éloignée
    cameraRef.current = camera;

    // Configuration du renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls - désactivés pour l'instant
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;    
    controls.enableZoom = false;
    controls.enablePan = false;
    
    // Ajout de lumières pour améliorer le rendu des cristaux
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(1, 1, 5);
    scene.add(dirLight);
    
    // Lumière d'accentuation par le bas pour effet dramatique
    const bottomLight = new THREE.DirectionalLight(0x6fa8ff, 0.3);
    bottomLight.position.set(0, -5, 2);
    scene.add(bottomLight);

    // Raycaster pour la détection de survol et de clic
    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;

    // Nouveau système de particules qui émergent du cristal - optimisé
    const createEmergingParticleSystem = (crystal, color) => {
      // Configuration des particules
      const particlesCount = 60;
      const particleGeometry = new THREE.BufferGeometry();

      // Tableaux pour stocker les positions et les données d'animation
      const positions = new Float32Array(particlesCount * 3);
      const velocities = [];
      const startTimes = [];
      const lifespans = [];
      const targetRadii = [];

      // Initialiser toutes les particules au centre du cristal
      const crystalPosition = new THREE.Vector3().copy(crystal.position);

      for (let i = 0; i < particlesCount; i++) {
        // Direction aléatoire avec bonne distribution circulaire
        const angle = Math.random() * Math.PI * 2;
        const randomDir = new THREE.Vector3(
          Math.cos(angle) * 0.8,
          (Math.random() - 0.5) * 0.4, // Variation verticale limitée
          Math.sin(angle) * 0.8
        ).normalize();

        // Position initiale plus éloignée du cristal (1.2 - 1.5 unités)
        const initialOffset = 1.2 + Math.random() * 0.3;
        positions[i * 3] = crystalPosition.x + randomDir.x * initialOffset;
        positions[i * 3 + 1] = crystalPosition.y + randomDir.y * initialOffset;
        positions[i * 3 + 2] = crystalPosition.z + randomDir.z * initialOffset;

        // Vitesse avec tendance à monter mais avec variation
        velocities.push(new THREE.Vector3(
          randomDir.x * 0.01,
          Math.random() * 0.01 + 0.01, // Composante verticale toujours positive
          randomDir.z * 0.01
        ));

        // Délai aléatoire progressif
        startTimes.push(Date.now() + Math.random() * 500);

        // Durée de vie variée mais pas trop longue pour éviter l'accumulation
        lifespans.push(3000 + Math.random() * 5000);

        // Distance maximale avec variation
        targetRadii.push(3.5 + Math.random() * 3.0);
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Matériau lumineux pour des particules PLUS GROSSES
      const particleMaterial = new THREE.PointsMaterial({
        color: color,
        size: 0.35, // TAILLE AUGMENTÉE (0.2 → 0.35)
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      });

      const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
      particleSystem.frustumCulled = false;

      // OPTIMISATION: Initialement invisible pour économiser des ressources
      particleSystem.visible = false;

      // Stocker les données d'animation
      particleSystem.userData = {
        velocities,
        startTimes,
        lifespans,
        targetRadii,
        crystalPosition,
        isActive: false,
        lastEmissionTime: Date.now(),
        emissionRate: 50,
        hasActiveParticles: false
      };

      // Ajouter à la scène
      scene.add(particleSystem);

      return particleSystem;
    };

    // Fonction pour animer les particules
    const animateParticleSystem = (particleSystem, isHovered, currentTime, perfCorrection = 1.0) => {
      if (!particleSystem) return;
      
      const {
        velocities,
        startTimes,
        lifespans,
        targetRadii,
        crystalPosition,
        lastEmissionTime,
        emissionRate
      } = particleSystem.userData;
      
      // Mise à jour de l'état d'activité
      particleSystem.userData.isActive = isHovered;
      
      // Gestion de l'opacité et de l'émission des particules
      if (isHovered) {
        // Augmenter progressivement l'opacité avec correction de performance
        if (particleSystem.material.opacity < 0.8) {
          particleSystem.material.opacity += 0.05 * perfCorrection;
        }
        
        // Émission de particules avec taux ajusté selon la performance
        // Utiliser un taux d'émission adapté à la performance
        const adjustedEmissionRate = emissionRate / Math.max(0.8, perfCorrection);
        
        if (currentTime - lastEmissionTime > adjustedEmissionRate) {
          // Émettre plusieurs particules à chaque cycle d'émission
          // Nombre ajusté en fonction des performances
          const particlesToEmit = Math.max(3, Math.floor(5 * perfCorrection));
          
          for (let emission = 0; emission < particlesToEmit; emission++) {
            // Choisir une particule aléatoire
            const particleIndex = Math.floor(Math.random() * startTimes.length);
            
            // Réinitialiser la particule
            startTimes[particleIndex] = currentTime;
            
            // Positions
            const positions = particleSystem.geometry.attributes.position;
            
            // Direction aléatoire avec dispersion horizontale
            const angle = Math.random() * Math.PI * 2;
            const randomDir = new THREE.Vector3(
              Math.cos(angle) * 0.8,
              (Math.random() - 0.5) * 0.4, // Variation verticale limitée
              Math.sin(angle) * 0.8
            ).normalize();
            
            // Position initiale plus éloignée du cristal (1.2 - 1.5 unités)
            const initialOffset = 1.2 + Math.random() * 0.3;
            positions.setXYZ(
              particleIndex,
              crystalPosition.x + randomDir.x * initialOffset,
              crystalPosition.y + randomDir.y * initialOffset,
              crystalPosition.z + randomDir.z * initialOffset
            );
            
            // Vitesse avec dispersion et tendance à monter
            // Vitesse augmentée pour compenser les performances plus faibles
            const speedBoost = 1.0 + (perfCorrection > 1 ? (perfCorrection - 1) * 0.5 : 0);
            velocities[particleIndex] = new THREE.Vector3(
              randomDir.x * 0.015 * speedBoost,
              Math.random() * 0.02 * speedBoost + 0.012 * speedBoost, // Toujours positive mais variée
              randomDir.z * 0.015 * speedBoost
            );
          }
          
          // Mettre à jour le temps de dernière émission
          particleSystem.userData.lastEmissionTime = currentTime;
          particleSystem.userData.hasActiveParticles = true;
          
          // Marquer les positions comme nécessitant une mise à jour
          particleSystem.geometry.attributes.position.needsUpdate = true;
        }
      } else {
        // Diminuer progressivement l'opacité si non survolé, vitesse ajustée
        if (particleSystem.material.opacity > 0) {
          particleSystem.material.opacity -= 0.01 * perfCorrection;
        }
        
        // Si l'opacité est nulle, désactiver complètement le système de particules
        if (particleSystem.material.opacity <= 0) {
          particleSystem.visible = false;
          particleSystem.userData.hasActiveParticles = false;
          resetParticles(particleSystem, crystalPosition);
          return;
        }
      }
      
      // Réactiver le rendu si nécessaire
      if (isHovered) {
        particleSystem.visible = true;
      }
      
      // Animation des particules uniquement si le système est visible
      if (!particleSystem.visible) return;
      
      const positions = particleSystem.geometry.attributes.position;
      let needsUpdate = false;
      
      // Adapter le nombre de particules animées selon les performances
      // Sur un système lent, nous traitons moins de particules à la fois
      const particleCount = isHovered 
        ? positions.count 
        : Math.min(positions.count, Math.floor(20 / perfCorrection));
      
      for (let i = 0; i < particleCount; i++) {
        // Ignorer les particules qui n'ont pas encore commencé leur cycle
        if (currentTime < startTimes[i]) continue;
        
        // Calculer l'âge de la particule
        const age = currentTime - startTimes[i];
        const lifeProgress = Math.min(1.0, age / lifespans[i]);
        
        // Si la particule a dépassé sa durée de vie, l'ignorer
        if (age > lifespans[i]) continue;
        
        // Position actuelle
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        
        // Distance au cristal
        const distVec = new THREE.Vector3(x, y, z).sub(crystalPosition);
        const dist = distVec.length();
        
        // Mouvement de particule
        let newX = x;
        let newY = y;
        let newZ = z;
        
        // Phase initiale d'expansion
        if (dist < targetRadii[i] && lifeProgress < 0.6) {
          // Déplacement standard avec légère accélération au début
          const expansionFactor = 1.0 - Math.min(1.0, dist / targetRadii[i]);
          const boost = (1.0 + expansionFactor * 0.4) * perfCorrection;
          
          // Calculer le mouvement avec ascension, ajusté selon performance
          newX = x + velocities[i].x * boost * 1.5;
          newY = y + velocities[i].y * boost * 1.8;
          newZ = z + velocities[i].z * boost * 1.5;
          
          // Léger effet sinusoïdal
          newX += Math.sin(age * 0.001) * 0.0005 * perfCorrection;
          newZ += Math.cos(age * 0.0008) * 0.0005 * perfCorrection;
        } 
        // Phase de dispersion après avoir atteint altitude maximale
        else {
          // Ajouter une composante de dispersion horizontale progressive
          const disperseFactor = Math.min(1.0, (lifeProgress - 0.6) * 2.5);
          
          // Calculer une direction de dispersion
          const dispersionAngle = i * 0.1 + age * 0.0001; // Angle unique par particule
          const disperseX = Math.cos(dispersionAngle) * 0.005 * disperseFactor * perfCorrection;
          const disperseZ = Math.sin(dispersionAngle) * 0.005 * disperseFactor * perfCorrection;
          
          // Ralentissement vertical progressif et dispersion horizontale
          newX = x + disperseX;
          newY = y + velocities[i].y * (1.0 - disperseFactor * 0.8) * perfCorrection; // Ralentir verticalement
          newZ = z + disperseZ;
          
          // Mouvement oscillant léger
          const oscAmp = 0.0008 * disperseFactor * perfCorrection;
          newX += Math.sin(age * 0.0005) * oscAmp;
          newZ += Math.cos(age * 0.0006) * oscAmp;
        }
        
        // Mettre à jour la position
        positions.setX(i, newX);
        positions.setY(i, newY);
        positions.setZ(i, newZ);
        needsUpdate = true;
      }
      
      // Ne mettre à jour la géométrie que si nécessaire
      if (needsUpdate) {
        positions.needsUpdate = true;
      }
    };

    // Fonction pour réinitialiser complètement l'état des particules
    const resetParticles = (particleSystem, crystalPosition) => {
      if (!particleSystem || !particleSystem.geometry) return;
    
      const positions = particleSystem.geometry.attributes.position;
      const { velocities, startTimes, lifespans, targetRadii } = particleSystem.userData;
    
      // Précalculer les valeurs pour éviter les calculs répétitifs
      const now = Date.now();
      
      // Recréer des positions et états pour chaque particule
      for (let i = 0; i < positions.count; i++) {
        // Direction aléatoire avec distribution circulaire améliorée
        const angle = Math.PI * 2 * (i / positions.count + Math.random() * 0.2);
        const randomDir = new THREE.Vector3(
          Math.cos(angle) * 0.8,
          (Math.random() - 0.5) * 0.4,
          Math.sin(angle) * 0.8
        ).normalize();
    
        // Position initiale avec plus de variation
        const initialOffset = 1.2 + Math.random() * 0.3;
        positions.setXYZ(
          i,
          crystalPosition.x + randomDir.x * initialOffset,
          crystalPosition.y + randomDir.y * initialOffset,
          crystalPosition.z + randomDir.z * initialOffset
        );
    
        // Vitesse plus variée et légèrement augmentée
        if (velocities[i]) {
          velocities[i].set(
            randomDir.x * 0.015, // Augmentation de la vélocité
            Math.random() * 0.025 + 0.015, // Composante verticale plus forte
            randomDir.z * 0.015
          );
        }
    
        // Timing optimisé
        if (startTimes.length > i) {
          startTimes[i] = now + Math.random() * 300; // Délai réduit
        }
    
        // Durées de vie légèrement réduites
        if (lifespans.length > i) {
          lifespans[i] = 2500 + Math.random() * 3500; // Durée ajustée
        }
    
        // Rayons cibles légèrement augmentés
        if (targetRadii.length > i) {
          targetRadii[i] = 3.8 + Math.random() * 3.0; // Rayons légèrement plus grands
        }
      }
    
      positions.needsUpdate = true;
    };

    // Animation des labels - simplifiée pour plus de subtilité
    const animateLabels = () => {
      crystalsRef.current.forEach((crystal) => {
        if (!crystal.userData.label) return;
        
        const label = crystal.userData.label;
        
        // S'assurer que le label est toujours face à la caméra
        label.lookAt(camera.position);
        
        const isHovered = crystal === hoveredCrystalRef.current;
        const isActive = crystal.userData.id === activeSection;
        
        // Animation simplifiée et plus subtile
        if (isHovered || isActive) {
          // Animation d'apparition très progressive
          if (label.material.opacity < 1) {
            // Transition plus douce
            label.material.opacity += 0.02;
          }
          
          // Positionnement fixe quand visible, sans oscillation
          const targetY = crystal.position.y - 7.8;
          
          // Animation très douce de la position (presque imperceptible)
          label.position.y += (targetY - label.position.y) * 0.03;
        } else {
          // Animation de disparition progressive
          if (label.material.opacity > 0) {
            // Transition douce
            label.material.opacity -= 0.02;
          }
          
          // Retour à la position d'origine
          const baseY = crystal.position.y - 8;
          
          // Animation douce de la position
          label.position.y += (baseY - label.position.y) * 0.03;
        }
      });
    };

    // Création des cristaux
    const createCrystals = async () => {
      // Positions des cristaux
      const positions = [
        [-15, 0, 0],  // À propos (gauche)
        [-5, 0, 0],   // Projets
        [5, 0, 0],    // Compétences
        [15, 0, 0]    // Contact (droite)
      ];
      
      // Couleurs pour chaque cristal
      const colors = [
        0x6f42c1, // Violet pour À propos
        0x4e7cff, // Bleu pour Projets
        0x9370db, // Violet plus clair pour Compétences
        0x0c71c3  // Bleu plus foncé pour Contact
      ];
      
      const crystals = [];
      
      for (let i = 0; i < SECTIONS.length; i++) {
        const section = SECTIONS[i];
        
        // Créer le cristal avec sa couleur et une taille plus grande
        const crystal = createCrystal(colors[i], 3.5);
        crystal.position.set(...positions[i]);
        crystal.userData.id = section.id;
        crystal.userData.title = section.title;
        
        // Créer le nouveau système de particules émergentes
        const particles = createEmergingParticleSystem(crystal, colors[i]);
        crystal.userData.particles = particles;
        
        // Création du label (texte)
        const label = await createCrystalLabel(section.title, colors[i]);
        label.position.set(positions[i][0], positions[i][1] - 8, positions[i][2] + 1);
        label.material.opacity = 0; // S'assurer qu'il est initialement invisible
        scene.add(label);
        
        // Stocker le label mais pas en tant qu'enfant du cristal
        crystal.userData.label = label;
        
        scene.add(crystal);
        crystals.push(crystal);
      }
      
      crystalsRef.current = crystals;
    };

    // Effet d'illumination sur le cristal survolé
    const illuminateCrystal = (crystal, isHovered, currentTime, perfCorrection = 1.0) => {
      if (!crystal || !crystal.userData) return;
    
      // Récupérer les références des maillages du cristal
      const outerMesh = crystal.userData.crystal;
      const innerMesh = crystal.userData.core;
      const originalColor = crystal.userData.color;
    
      if (!outerMesh || !innerMesh) return;
    
      // Cristal survolé - brillance intense
      if (isHovered) {
        // 1. Augmenter l'émissivité et l'intensité du matériau extérieur
        if (outerMesh.material) {
          // Ajouter une émission de lumière (si pas déjà configurée)
          if (!outerMesh.material.emissive) {
            outerMesh.material.emissive = new THREE.Color(originalColor);
            outerMesh.material.emissiveIntensity = 0;
          }
    
          // Animation de l'émissivité adaptée à la performance
          const emissiveStep = 0.04 * perfCorrection; 
          outerMesh.material.emissiveIntensity = Math.min(
            0.7, 
            outerMesh.material.emissiveIntensity + emissiveStep
          );
    
          // Augmenter légèrement l'opacité pour un effet plus intense
          const opacityStep = 0.01 * perfCorrection;
          outerMesh.material.opacity = Math.min(0.85, outerMesh.material.opacity + opacityStep);
        }
    
        // 2. Faire briller le noyau interne plus intensément
        if (innerMesh.material) {
          const opacityStep = 0.04 * perfCorrection;
          innerMesh.material.opacity = Math.min(0.95, innerMesh.material.opacity + opacityStep);
    
          // Animation pulsante du noyau (effet de battement) avec fréquence adaptée
          // On utilise perfCorrection pour ajuster la vitesse de pulsation
          const pulseFrequency = 0.003 * Math.min(perfCorrection, 1.5);
          const pulseIntensity = 0.1 * Math.sin(currentTime * pulseFrequency) + 0.85;
          innerMesh.scale.set(
            0.65 * pulseIntensity,
            0.65 * pulseIntensity,
            0.65 * pulseIntensity
          );
        }
    
        // 3. Ajouter un léger effet de scintillement sur la couleur
        // Ajuster la vitesse de scintillement en fonction des performances
        const shimmerSpeed = 0.0003 * Math.min(perfCorrection, 1.2);
        const hue = (currentTime * shimmerSpeed) % 1;
        const shimmerColor = new THREE.Color().setHSL(hue, 0.5, 0.7);
    
        if (outerMesh.material) {
          // Mélanger la couleur originale avec un effet de scintillement
          const r = (originalColor >> 16 & 255) / 255;
          const g = (originalColor >> 8 & 255) / 255;
          const b = (originalColor & 255) / 255;
          const baseColor = new THREE.Color(r, g, b);
    
          // Mélange avec intensité adaptée selon les performances
          const shimmerIntensity = 0.15 * Math.min(perfCorrection, 1.3);
          outerMesh.material.color.copy(baseColor).lerp(shimmerColor, shimmerIntensity);
        }
      } 
      // Cristal non survolé - retour à l'état normal
      else {
        // 1. Réduire progressivement l'émissivité du matériau extérieur
        if (outerMesh.material && outerMesh.material.emissiveIntensity !== undefined) {
          // Vitesse de transition adaptée
          const emissiveStep = 0.02 * perfCorrection;
          outerMesh.material.emissiveIntensity = Math.max(
            0, 
            outerMesh.material.emissiveIntensity - emissiveStep
          );
    
          // Restaurer l'opacité d'origine
          const opacityStep = 0.01 * perfCorrection;
          outerMesh.material.opacity = Math.max(0.7, outerMesh.material.opacity - opacityStep);
        }
    
        // 2. Retour à l'état normal du noyau interne
        if (innerMesh.material) {
          const opacityStep = 0.03 * perfCorrection;
          innerMesh.material.opacity = Math.max(0.1, innerMesh.material.opacity - opacityStep);
    
          // Restaurer l'échelle normale avec vitesse adaptée
          const targetScale = new THREE.Vector3(0.65, 0.65, 0.65);
          const lerpFactor = 0.1 * perfCorrection;
          innerMesh.scale.lerp(targetScale, Math.min(lerpFactor, 0.3));
        }
    
        // 3. Restaurer la couleur d'origine
        if (outerMesh.material) {
          const r = (originalColor >> 16 & 255) / 255;
          const g = (originalColor >> 8 & 255) / 255;
          const b = (originalColor & 255) / 255;
          const targetColor = new THREE.Color(r, g, b);
    
          // Interpolation progressive vers la couleur d'origine, vitesse adaptée
          const lerpFactor = 0.1 * perfCorrection;
          outerMesh.material.color.lerp(targetColor, Math.min(lerpFactor, 0.3));
        }
      }
    };

    // Gestionnaires d'événements
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    const handleClick = () => {
      // Ne pas traiter les clics si une section est déjà active
      if (activeSection) {
        return; // Sortir immédiatement si une section est active
      }
      
      raycaster.setFromCamera(mouseRef.current, camera);
      
      // Récupérer tous les meshes des cristaux
      const allMeshes = [];
      crystalsRef.current.forEach(crystal => {
        crystal.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            allMeshes.push(child);
          }
        });
      });
      
      const intersects = raycaster.intersectObjects(allMeshes);
      
      if (intersects.length > 0) {
        // Trouver le crystal parent
        let targetObject = intersects[0].object;
        while(targetObject && !targetObject.userData.id) {
          targetObject = targetObject.parent;
        }
        
        if (targetObject && targetObject.userData.id) {
          setActiveSection(targetObject.userData.id);
        }
      }
    };
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    // Stocker les références pour le cleanup
    handlersRef.current = {
      mouseMove: handleMouseMove,
      click: handleClick,
      resize: handleResize
    };

    // Initialiser les cristaux puis démarrer l'animation
    createCrystals().then(() => {
      // Appeler updateEventListeners ici au lieu d'ajouter directement les écouteurs
      updateEventListeners();
    
      // Boucle d'animation
      const animate = () => {
        // Planifier la prochaine frame
        animationFrameIdRef.current = requestAnimationFrame(animate);
      
        // Calcul du temps et gestion des performances
        const currentTime = Date.now();
        const deltaTime = currentTime - (lastFrameTimeRef.current || currentTime);
        lastFrameTimeRef.current = currentTime;
        
        // Facteur de correction de performance
        // Normalise le temps entre frames pour une animation fluide indépendamment du FPS
        // 16.67ms représente environ 60fps (1000ms / 60)
        const perfCorrection = Math.min(Math.max(deltaTime / 16.67, 0.5), 2.5);
      
        // Animation des cristaux
        crystalsRef.current.forEach((crystal, index) => {
          // Rotation adaptée au deltaTime pour une vitesse constante quel que soit le FPS
          crystal.rotation.y += 0.003 * perfCorrection;
      
          // Oscillation verticale adaptée pour rester fluide
          const oscillationSpeed = 0.0005;
          crystal.position.y = Math.sin(currentTime * oscillationSpeed + index) * 0.2;
      
          // Déterminer si le cristal est survolé ou actif
          const isHovered = !activeSection && 
            (crystal === hoveredCrystalRef.current || crystal.userData.id === activeSection);
      
          // Animer les particules avec le système optimisé
          if (crystal.userData.particles) {
            const particles = crystal.userData.particles;
            
            // Passer le facteur de correction aux fonctions d'animation
            animateParticleSystem(particles, isHovered, currentTime, perfCorrection);
      
            // Synchroniser la position du système de particules avec le crystal
            particles.userData.crystalPosition.copy(crystal.position);
          }
      
          // Appliquer l'effet d'illumination avec correction de performance
          illuminateCrystal(crystal, isHovered, currentTime, perfCorrection);
        });
      
        // Animer les labels avec correction de performance
        animateLabels(perfCorrection);
      
        // Gestion du survol des cristaux uniquement si aucune section n'est active
        if (camera && raycasterRef.current && !activeSection) {
          raycasterRef.current.setFromCamera(mouseRef.current, camera);
      
          // Collecte efficace des meshes pour le test d'intersection
          const allMeshes = [];
          crystalsRef.current.forEach(crystal => {
            crystal.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                allMeshes.push(child);
              }
            });
          });
      
          const intersects = raycasterRef.current.intersectObjects(allMeshes);
      
          // Gestion du survol
          if (intersects.length > 0) {
            // Trouver le crystal parent
            let targetCrystal = intersects[0].object;
            while(targetCrystal && !targetCrystal.userData.id) {
              targetCrystal = targetCrystal.parent;
            }
      
            if (targetCrystal && targetCrystal.userData.id) {
              // Si on survole un nouveau cristal
              if (hoveredCrystalRef.current !== targetCrystal) {
                hoveredCrystalRef.current = targetCrystal;
              }
            }
          } else if (hoveredCrystalRef.current) {
            // On ne survole plus aucun cristal
            hoveredCrystalRef.current = null;
          }
        } else if (hoveredCrystalRef.current) {
          // Réinitialiser l'état de survol si une section est active
          hoveredCrystalRef.current = null;
        }
      
        // Rendu final
        renderer.render(scene, camera);
      };
      animate();
    });
    return () => {
      // Supprimer les écouteurs d'événements
      window.removeEventListener('mousemove', handlersRef.current.mouseMove);
      window.removeEventListener('click', handlersRef.current.click);
      window.removeEventListener('resize', handlersRef.current.resize);
      
      // Annuler l'animation en cours
      if (window.cancelAnimationFrame && animationFrameIdRef.current) {
        window.cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      // Nettoyer le rendu WebGL
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose(); // Libérer les ressources WebGL
      }
      
      // Nettoyer les systèmes de particules spécifiquement
      if (crystalsRef.current && crystalsRef.current.length > 0) {
        crystalsRef.current.forEach(crystal => {
          if (!crystal) return;
          
          // Nettoyer les systèmes de particules
          if (crystal.userData && crystal.userData.particles) {
            const particles = crystal.userData.particles;
            
            // Supprimer de la scène
            if (scene) {
              scene.remove(particles);
            }
            
            // Libérer les ressources GPU pour la géométrie
            if (particles.geometry) {
              particles.geometry.dispose();
            }
            
            // Libérer les ressources GPU pour le matériau
            if (particles.material) {
              if (particles.material.map) {
                particles.material.map.dispose();
              }
              particles.material.dispose();
            }
            
            // Supprimer la référence
            crystal.userData.particles = null;
          }
          
          // Nettoyer les labels
          if (crystal.userData && crystal.userData.label) {
            const label = crystal.userData.label;
            
            // Supprimer de la scène
            if (scene) {
              scene.remove(label);
            }
            
            // Libérer les ressources du label
            if (label.material) {
              // Libérer la texture de la mémoire GPU
              if (label.material.map) {
                label.material.map.dispose();
              }
              label.material.dispose();
            }
            
            if (label.geometry) {
              label.geometry.dispose();
            }
            
            // Supprimer la référence
            crystal.userData.label = null;
          }
          
          // Nettoyer le cristal lui-même
          if (scene) {
            scene.remove(crystal);
          }
          
          // Libérer les ressources du cristal et ses enfants
          crystal.traverse((object) => {
            if (object.geometry) {
              object.geometry.dispose();
            }
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => {
                  if (material.map) material.map.dispose();
                  material.dispose();
                });
              } else {
                if (object.material.map) object.material.map.dispose();
                object.material.dispose();
              }
            }
          });
        });
      }
      
      // Nettoyer le reste de la scène pour les objets qui n'auraient pas été traités
      if (scene) {
        // Libérer les ressources pour chaque objet restant dans la scène
        scene.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => {
                // Nettoyer toutes les textures et propriétés spéciales du matériau
                Object.keys(material).forEach(prop => {
                  if (!material[prop]) return;
                  if (material[prop].isTexture) {
                    material[prop].dispose();
                  }
                });
                material.dispose();
              });
            } else {
              // Nettoyer toutes les textures et propriétés spéciales du matériau
              Object.keys(object.material).forEach(prop => {
                if (!object.material[prop]) return;
                if (object.material[prop].isTexture) {
                  object.material[prop].dispose();
                }
              });
              object.material.dispose();
            }
          }
        });
        
        // Vider la scène
        while(scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }
      }
      
      // Libérer les références pour aider le garbage collector
      crystalsRef.current = [];
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      raycasterRef.current = null;
      hoveredCrystalRef.current = null;
    };
  }, [setActiveSection, updateEventListeners]); // Ajout de updateEventListeners ici

  useEffect(() => {
    // Fonction pour désactiver complètement les interactions avec le canvas
    const disableCanvasInteractions = () => {
      if (activeSection && rendererRef.current && rendererRef.current.domElement) {
        const canvas = rendererRef.current.domElement;
        
        // Méthode 1: Désactiver les événements via CSS
        canvas.style.pointerEvents = 'none';
        
        // Méthode 2: Rendre la zone "invisible" aux interactions
        canvas.style.touchAction = 'none';
        
        // Méthode 3: Arrêter la propagation des événements
        const blockEvent = (e) => {
          if (activeSection) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        };
        
        // Ajouter tous les bloqueurs d'événements possible
        canvas.addEventListener('click', blockEvent, true);
        canvas.addEventListener('mousedown', blockEvent, true);
        canvas.addEventListener('mouseup', blockEvent, true);
        canvas.addEventListener('mousemove', blockEvent, true);
        canvas.addEventListener('touchstart', blockEvent, true);
        canvas.addEventListener('touchmove', blockEvent, true);
        canvas.addEventListener('touchend', blockEvent, true);
        
        // Nettoyage
        return () => {
          canvas.style.pointerEvents = 'auto';
          canvas.style.touchAction = 'auto';
          
          canvas.removeEventListener('click', blockEvent, true);
          canvas.removeEventListener('mousedown', blockEvent, true);
          canvas.removeEventListener('mouseup', blockEvent, true);
          canvas.removeEventListener('mousemove', blockEvent, true);
          canvas.removeEventListener('touchstart', blockEvent, true);
          canvas.removeEventListener('touchmove', blockEvent, true);
          canvas.removeEventListener('touchend', blockEvent, true);
        };
      }
    };
    
    // Exécuter la fonction et conserver son nettoyage
    const cleanup = disableCanvasInteractions();
    return cleanup;
  }, [activeSection]);

  // Utiliser updateEventListeners lorsque activeSection change
  useEffect(() => {
    if (handlersRef.current.mouseMove) {
      updateEventListeners();
    }
  }, [activeSection, updateEventListeners]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Couche de blocage complète qui absorbe tous les événements */}
      {activeSection && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 100,
            pointerEvents: 'all', // Capture tous les événements
            cursor: 'default',
            // Rendre la couche légèrement visible pour déboguer (à retirer en production)
            // backgroundColor: 'rgba(255, 0, 0, 0.1)', 
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
          onMouseMove={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
        />
      )}
    </div>
  );
};

export default Portfolio3D;