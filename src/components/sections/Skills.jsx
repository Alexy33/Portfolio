import React, { useEffect } from 'react';
import '../../styles/skills.css';

const Skills = () => {
  const skillCategories = [
    {
      title: "Programmation",
      icon: "💻",
      skills: [
        { name: "C", level: 90, color: "#A8B9CC" },
        { name: "HTML/CSS", level: 85, color: "#E34F26" },
        { name: "JavaScript", level: 75, color: "#F7DF1E" },
        { name: "Python", level: 80, color: "#3776AB" },
        { name: "Arduino", level: 70, color: "#00979D" },
      ]
    },
    {
      title: "Logiciels",
      icon: "🔧",
      skills: [
        { name: "Unity", level: 75, color: "#000000" },
        { name: "Blender", level: 70, color: "#F5792A" },
        { name: "VScode", level: 85, color: "#007ACC" },
        { name: "GitHub", level: 80, color: "#181717" },
        { name: "Linux", level: 85, color: "#FCC624" },
      ]
    },
    {
      title: "Compétences",
      icon: "🎯",
      skills: [
        { name: "Travail de groupe", level: 85, color: "#4FC08D" },
        { name: "Autonomie", level: 90, color: "#61DAFB" },
        { name: "Curiosité", level: 95, color: "#FF4088" },
        { name: "Anglais B2", level: 80, color: "#0052CC" },
        { name: "Espagnol A2", level: 30, color: "#FF9900" },
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

      {/* Expertise - Section spéciale */}
      <div className="mt-16">
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-8 animate-text">
          Expertise
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="skill-category rounded-lg p-6 backdrop-blur animate-text">
            <h4 className="skill-title text-xl font-semibold text-purple-300 mb-4">Cybersécurité</h4>
            <p className="text-gray-300 mb-4">
              Expertise en cybersécurité offensive / défensive, avec une spécialisation en pentesting (en cours...).
            </p>
            <div className="skill-bar mt-2">
              <div className="skill-progress" style={{ width: '25%' }} />
            </div>
          </div>
          
          <div className="skill-category rounded-lg p-6 backdrop-blur animate-text">
            <h4 className="skill-title text-xl font-semibold text-purple-300 mb-4">DevOps</h4>
            <p className="text-gray-300 mb-4">
              Expérience en intégration continue et déploiement (CI/CD), gestion de serveurs Linux (en cours...).
            </p>
            <div className="skill-bar mt-2">
              <div className="skill-progress" style={{ width: '35%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;