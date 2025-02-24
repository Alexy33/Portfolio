import React, { useEffect } from 'react';
import '../../styles/skills.css';

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      icon: "🌐",
      skills: [
        { name: "React", level: 90, color: "#61DAFB" },
        { name: "Three.js", level: 85, color: "#049EF4" },
        { name: "Vue.js", level: 75, color: "#4FC08D" },
        { name: "HTML/CSS", level: 95, color: "#E34F26" },
      ]
    },
    {
      title: "Backend",
      icon: "⚙️",
      skills: [
        { name: "Node.js", level: 85, color: "#339933" },
        { name: "Python", level: 80, color: "#3776AB" },
        { name: "MongoDB", level: 75, color: "#47A248" },
        { name: "GraphQL", level: 70, color: "#E535AB" },
      ]
    },
    {
      title: "3D & Design",
      icon: "🎨",
      skills: [
        { name: "Blender", level: 80, color: "#E87D0D" },
        { name: "WebGL", level: 75, color: "#990000" },
        { name: "Figma", level: 85, color: "#F24E1E" },
        { name: "Adobe XD", level: 70, color: "#FF61F6" },
      ]
    }
  ];

  useEffect(() => {
    // Animation séquentielle des barres de compétences
    const categories = document.querySelectorAll('.skill-category');
    categories.forEach((category, categoryIndex) => {
      category.style.animationDelay = `${categoryIndex * 0.2}s`;
      
      const progressBars = category.querySelectorAll('.skill-progress');
      progressBars.forEach((bar, index) => {
        bar.style.animationDelay = `${(categoryIndex * 0.2) + (index * 0.1)}s`;
      });
    });
  }, []);

  return (
    <div className="relative space-y-8 arise overflow-hidden">
      {/* Cercles lumineux d'arrière-plan */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>

      <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-12 animate-text">
        Compétences
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {skillCategories.map((category, index) => (
          <div key={index} className="skill-category rounded-lg p-6 backdrop-blur animate-text">
            <div className="flex items-center justify-between mb-6">
              <h3 className="skill-title text-xl font-semibold text-purple-300">{category.title}</h3>
              <span className="text-2xl">{category.icon}</span>
            </div>
            
            <div className="space-y-6">
              {category.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="skill-item">
                  <div className="flex justify-between mb-2">
                    <span className="skill-name text-gray-300">{skill.name}</span>
                    <span className="skill-level">{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div 
                      className="skill-progress" 
                      style={{ 
                        width: `${skill.level}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Shadow Abilities - Section spéciale Solo Leveling */}
      <div className="mt-16">
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-8 animate-text">
          Capacités du Shadow Monarch
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="skill-category rounded-lg p-6 backdrop-blur animate-text">
            <h4 className="skill-title text-xl font-semibold text-purple-300 mb-4">Maîtrise des Ombres</h4>
            <p className="text-gray-300 mb-4">
              Capacité à manipuler le code source et à faire surgir des solutions complexes des ténèbres.
            </p>
            <div className="skill-bar mt-2">
              <div className="skill-progress" style={{ width: '95%' }} />
            </div>
          </div>
          
          <div className="skill-category rounded-lg p-6 backdrop-blur animate-text">
            <h4 className="skill-title text-xl font-semibold text-purple-300 mb-4">Résurrection de Projets</h4>
            <p className="text-gray-300 mb-4">
              Capacité à redonner vie aux projets abandonnés et à transformer les bugs en fonctionnalités.
            </p>
            <div className="skill-bar mt-2">
              <div className="skill-progress" style={{ width: '88%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;