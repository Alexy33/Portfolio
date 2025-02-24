import React, { Suspense, useState, useEffect, useRef } from 'react';
import Portfolio3D from "./components/Portfolio3D";
import Loader from "./components/Loader";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Contact from "./components/sections/Contact";

const App = () => {
  const [activeSection, setActiveSection] = useState(null);
  const threeJSContainerRef = useRef(null);

  // Désactiver complètement Three.js quand une section est active
  useEffect(() => {
    if (threeJSContainerRef.current) {
      if (activeSection) {
        // Cacher complètement le conteneur Three.js si une section est active
        threeJSContainerRef.current.style.display = 'none';
      } else {
        // Réafficher le conteneur Three.js si aucune section n'est active
        threeJSContainerRef.current.style.display = 'block';
      }
    }
  }, [activeSection]);

  const renderActiveSection = () => {
    if (!activeSection) return null;

    const sections = {
      about: <About />,
      projects: <Projects />,
      skills: <Skills />,
      contact: <Contact />
    };

    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        onClick={(e) => {
          // Si on clique directement sur l'overlay (pas sur son contenu), fermer la section
          if (e.target === e.currentTarget) {
            setActiveSection(null);
          }
        }}
      >
        <div className="relative w-[80vw] max-w-[1200px] max-h-[80vh] overflow-y-auto bg-black bg-opacity-85 text-white p-8 rounded-xl backdrop-blur-lg">
          <button 
            onClick={() => setActiveSection(null)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-2xl rounded-full hover:bg-white hover:bg-opacity-10"
          >
            ×
          </button>
          {sections[activeSection]}
        </div>
      </div>
    );
  };

  // Ajouter un titre flottant discret pour indiquer qu'il faut cliquer sur les textes 3D
  const renderInstructions = () => {
    if (activeSection) return null;
    
    return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 text-white text-center animate-pulse opacity-80">
        <p className="text-sm bg-black bg-opacity-40 p-2 rounded-full px-4 backdrop-blur-sm">
          Cliquez sur les textes pour explorer
        </p>
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Suspense fallback={<Loader />}>
        <div ref={threeJSContainerRef} className="w-full h-full">
          <Portfolio3D activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
        {renderActiveSection()}
        {renderInstructions()}
      </Suspense>
    </div>
  );
};

export default App;