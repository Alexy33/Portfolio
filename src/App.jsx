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

  // Gérer la fermeture avec animation
  const handleCloseSection = () => {
    setIsClosing(true);
    // Attendre que l'animation de fermeture soit terminée
    setTimeout(() => {
      setActiveSection(null);
      setIsClosing(false);
    }, 500); // Durée de l'animation de fermeture
  };

  // Transmettre l'état actif à Three.js mais ne pas le cacher
  useEffect(() => {
    if (threeJSContainerRef.current) {
      // Au lieu de cacher Three.js, on réduit simplement son opacité pour qu'il reste visible
      if (activeSection) {
        threeJSContainerRef.current.style.opacity = '0.7'; // Visible mais atténué
      } else {
        threeJSContainerRef.current.style.opacity = '1';
      }
    }
  }, [activeSection]);

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
        className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-500 ${
          isClosing 
            ? 'bg-opacity-0 backdrop-blur-none pointer-events-none' 
            : 'backdrop-blur-sm'
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget && !isClosing) {
            handleCloseSection();
          }
        }}
      >
        <div 
          className={`relative w-[80vw] max-w-[1200px] max-h-[80vh] overflow-y-auto 
          bg-slate-950 bg-opacity-90 border border-slate-800
          text-white p-8 rounded-xl backdrop-blur-lg shadow-lg shadow-purple-900/20
          transition-all duration-500 transform ${
            isClosing 
              ? 'opacity-0 scale-90' 
              : 'opacity-100 scale-100'
          }`}
        >
          {/* Bouton de fermeture amélioré avec une plus grande zone cliquable */}
          <button 
            onClick={handleCloseSection}
            className="absolute top-2 right-2 w-12 h-12 flex items-center justify-center text-3xl rounded-full hover:bg-white hover:bg-opacity-10 transition-colors z-50"
            disabled={isClosing}
            aria-label="Fermer"
          >
            <span className="transform translate-y-[-2px]">×</span>
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
        {/* Three.js reste toujours visible, mais avec opacité réduite quand une section est active */}
        <div 
          ref={threeJSContainerRef} 
          className="w-full h-full absolute inset-0 transition-opacity duration-500 ease-in-out pointer-events-auto"
          style={{ 
            opacity: activeSection ? 0.35 : 1,
            pointerEvents: activeSection ? 'none' : 'auto' // Désactiver les interactions avec Three.js quand une section est active
          }}
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