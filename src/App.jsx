import React, { Suspense, useState, useEffect, useRef } from 'react';
import Portfolio3D from "./components/Portfolio3D";
import Loader from "./components/Loader";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Contact from "./components/sections/Contact";

const App = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const threeJSContainerRef = useRef(null);

  // Gérer l'affichage de Three.js avec une animation fluide
  useEffect(() => {
    if (threeJSContainerRef.current) {
      if (activeSection) {
        // Animation fluide pour cacher Three.js
        threeJSContainerRef.current.style.opacity = '0';
        setTimeout(() => {
          threeJSContainerRef.current.style.display = 'none';
        }, 300); // Correspond à la durée de la transition
      } else {
        // Animation fluide pour montrer Three.js
        threeJSContainerRef.current.style.display = 'block';
        // Petit délai pour s'assurer que le display est appliqué avant l'animation
        setTimeout(() => {
          threeJSContainerRef.current.style.opacity = '1';
        }, 10);
      }
    }
  }, [activeSection]);

  // Gérer la fermeture avec animation
  const handleCloseSection = () => {
    setIsClosing(true);
    // Attendre que l'animation de fermeture soit terminée
    setTimeout(() => {
      setActiveSection(null);
      setIsClosing(false);
    }, 500); // Durée de l'animation de fermeture
  };

  const renderActiveSection = () => {
    if (!activeSection && !isClosing) return null;

    const sections = {
      about: <About />,
      projects: <Projects />,
      skills: <Skills />,
      contact: <Contact />
    };

    return (
      <div 
        className={`fixed inset-0 flex items-center justify-center z-50 bg-black transition-all duration-500 ${
          isClosing 
            ? 'bg-opacity-0 backdrop-blur-none pointer-events-none' 
            : 'bg-opacity-50 backdrop-blur-sm'
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget && !isClosing) {
            handleCloseSection();
          }
        }}
      >
        <div 
          className={`relative w-[80vw] max-w-[1200px] max-h-[80vh] overflow-y-auto bg-black bg-opacity-85 text-white p-8 rounded-xl backdrop-blur-lg transition-all duration-500 transform ${
            isClosing 
              ? 'opacity-0 scale-90' 
              : 'opacity-100 scale-100'
          }`}
        >
          <button 
            onClick={handleCloseSection}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-2xl rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
            disabled={isClosing}
          >
            ×
          </button>
          {activeSection && sections[activeSection]}
        </div>
      </div>
    );
  };

  // Instructions subtiles pour indiquer de cliquer sur les textes 3D
  const renderInstructions = () => {
    if (activeSection || isClosing) return null;
    
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
        <div 
          ref={threeJSContainerRef} 
          className="w-full h-full transition-opacity duration-300"
          style={{ opacity: activeSection ? 0 : 1 }}
        >
          <Portfolio3D activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
        {renderActiveSection()}
        {renderInstructions()}
      </Suspense>
    </div>
  );
};

export default App;