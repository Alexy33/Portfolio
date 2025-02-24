import React from 'react';

const Navigation = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'about', label: 'À propos' },
    { id: 'projects', label: 'Projets' },
    { id: 'skills', label: 'Compétences' },
    { id: 'contact', label: 'Contact' }
  ];
  
  const handleClick = (sectionId) => {
    if (activeSection === sectionId) {
      setActiveSection(null);
    } else {
      setActiveSection(sectionId);
    }
  };

  return (
    <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[60] flex gap-4 p-4 bg-slate-900 bg-opacity-90 rounded-full backdrop-blur-md border border-purple-500 sl-glow">
      {sections.map(section => (
        <button 
          key={section.id}
          onClick={() => handleClick(section.id)}
          className={`px-6 py-2 rounded-full transition-all duration-300 font-semibold
            ${activeSection === section.id 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
              : 'bg-slate-800 text-purple-200 hover:bg-purple-900'}`}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;