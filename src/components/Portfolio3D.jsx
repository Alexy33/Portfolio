import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PORTFOLIO_CONFIG } from '../constants/portfolio';
import { createLights, createMaterial, createParticles, createText3D } from '../utils/three-helpers';

const Portfolio3D = ({ activeSection, setActiveSection }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const particlesRef = useRef(null);
  const objectsRef = useRef([]);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with fog for depth effect
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000814, 0.035);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      PORTFOLIO_CONFIG.camera.fov,
      window.innerWidth / window.innerHeight,
      PORTFOLIO_CONFIG.camera.near,
      PORTFOLIO_CONFIG.camera.far
    );
    camera.position.set(...PORTFOLIO_CONFIG.camera.position);
    cameraRef.current = camera;

    const handleClick = (event) => {
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        objects.map(obj => obj.mesh)
      );
  
      if (intersects.length > 0) {
        const clicked = intersects[0].object;
        // Remonter à l'ancêtre principal qui contient userData.id
        let targetObject = clicked;
        while(targetObject && !targetObject.userData.id) {
          targetObject = targetObject.parent;
        }
        
        if (targetObject && targetObject.userData.id) {
          setActiveSection(targetObject.userData.id);
        }
      }
    };
    // Renderer setup with better quality
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000814); // Bleu très sombre presque noir
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    Object.assign(controls, PORTFOLIO_CONFIG.controls);
    controlsRef.current = controls;

    // Add lights and particles
    createLights(scene);
    particlesRef.current = createParticles(scene);

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Create background stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
    });

    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Stocker les objets créés
    const objects = [];
    objectsRef.current = objects;

    // Fonction pour créer les textes 3D
    const createSectionText = async () => {
      for (const section of PORTFOLIO_CONFIG.sections) {
        // Texte français plus court pour le rendu 3D
        let displayText = section.title;
        
        // Créer la géométrie du texte
        const textGeometry = await createText3D(displayText, 0.6); // Texte un peu plus grand
        const material = createMaterial(section.id);
        
        // Créer un groupe pour le texte (facilitera la rotation pour faire face à la caméra)
        const textGroup = new THREE.Group();
        textGroup.position.set(...section.position);
        textGroup.userData = { id: section.id };
        
        const textMesh = new THREE.Mesh(textGeometry, material);
        textMesh.castShadow = true;
        textMesh.receiveShadow = true;
        
        // Ajouter le texte au groupe
        textGroup.add(textMesh);
        
        // Créer un effet de halo autour du texte
        const glowGeometry = textGeometry.clone();
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: material.color,
          transparent: true,
          opacity: 0.4,
          side: THREE.BackSide
        });
        
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.scale.multiplyScalar(1.05); // Légèrement plus grand que le texte
        textGroup.add(glowMesh);
        
        // Créer des particules autour du texte
        const particleCount = 30;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
          const radius = 1.4; // Rayon légèrement plus grand pour les particules
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
          particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
          particlePositions[i + 2] = radius * Math.cos(phi);
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
          color: material.color,
          size: 0.08,
          transparent: true,
          opacity: 0.7,
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        textGroup.add(particles);
        
        // Ajouter le groupe à la scène
        scene.add(textGroup);
        objects.push({ group: textGroup, mesh: textMesh, glow: glowMesh, particles });
      }
    };

    // Créer les textes 3D de manière asynchrone
    createSectionText().then(() => {
      // Une fois que tous les textes sont créés, configurer les interactions

      // Handle clicks
      const handleClick = (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          objects.map(obj => obj.mesh)
        );

        if (intersects.length > 0) {
          const clicked = intersects[0].object;
          // Remonter à l'ancêtre principal qui contient userData.id
          let targetObject = clicked;
          while(targetObject && !targetObject.userData.id) {
            targetObject = targetObject.parent;
          }
          
          if (targetObject && targetObject.userData.id) {
            setActiveSection(targetObject.userData.id);
          }
        }
      };

      window.addEventListener('click', handleClick);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        const time = timeRef.current;
        timeRef.current += 0.005;
        
        // Faire face à la caméra pour tous les groupes de textes
        if (camera) {
          objects.forEach(({ group, mesh, glow, particles }, index) => {
            // Billboard effect - toujours face à la caméra
            group.quaternion.copy(camera.quaternion);
            
            // Mouvement de flottement vertical
            const floatY = Math.sin(time + index) * 0.1;
            group.position.y = PORTFOLIO_CONFIG.sections[index].position[1] + floatY;
            
            // Animation du halo
            if (glow) {
              const pulseScale = 1.05 + Math.sin(time * 2) * 0.02;
              glow.scale.set(pulseScale, pulseScale, pulseScale);
              glow.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
            }
            
            // Animation des particules
            if (particles) {
              const positions = particles.geometry.attributes.position.array;
              for (let i = 0; i < positions.length; i += 3) {
                const idx = i / 3;
                positions[i] = positions[i] + Math.sin(time * 0.5 + idx) * 0.002;
                positions[i + 1] = positions[i + 1] + Math.cos(time * 0.5 + idx) * 0.002;
              }
              particles.geometry.attributes.position.needsUpdate = true;
              
              // Faire pulser la taille des particules
              particles.material.size = 0.08 + Math.sin(time * 3) * 0.02;
            }
            
            // Mettre en évidence la section active
            if (group.userData.id === activeSection) {
              group.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.1);
              mesh.material.opacity = 1;
              mesh.material.emissiveIntensity = 0.9;
              if (glow) {
                glow.material.opacity = 0.6 + Math.sin(time * 4) * 0.2;
                glow.scale.multiplyScalar(1.02);
              }
              if (particles) {
                particles.material.opacity = 0.9;
                particles.material.size = 0.12 + Math.sin(time * 4) * 0.04;
              }
            } else {
              group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
              mesh.material.opacity = 0.8;
              mesh.material.emissiveIntensity = 0.6;
              if (glow) {
                glow.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
              }
              if (particles) {
                particles.material.opacity = 0.6;
              }
            }
          });
        }
        
        // Animer les étoiles arrière-plan
        stars.rotation.y += 0.0002;
        
        // Animer les particules générales
        if (particlesRef.current) {
          particlesRef.current.rotation.y += 0.001;
        }

        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    });

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [setActiveSection]);

  // Mettre à jour visuellement la section active
  useEffect(() => {
    if (objectsRef.current.length > 0) {
      objectsRef.current.forEach(({ group, mesh, glow }) => {
        if (group.userData.id === activeSection) {
          group.scale.set(1.5, 1.5, 1.5);
          mesh.material.emissiveIntensity = 0.9;
          if (glow) glow.material.opacity = 0.6;
        } else {
          group.scale.set(1, 1, 1);
          mesh.material.emissiveIntensity = 0.6;
          if (glow) glow.material.opacity = 0.3;
        }
      });
    }
  }, [activeSection]);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Portfolio3D;