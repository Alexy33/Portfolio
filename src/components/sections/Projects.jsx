import React from 'react';
import '../../styles/projects.css';
import sudoImg from '../../assets/images/projects/sudo.png';

const Projects = () => {
  const projects = [
    {
      title: "my_sudo",
      description: "Le but était de créer notre propre sudo avec différents flag",
      technologies: ["C", "Makefile"],
      image: sudoImg,
      link: "https://project1.com",
      github: "https://github.com/username/project1"
    },
    {
      title: "E-commerce 3D",
      description: "Plateforme e-commerce avec visualisation 3D des produits",
      technologies: ["Vue.js", "Three.js", "Node.js", "MongoDB"],
      image: "/api/placeholder/400/200",
      link: "https://project2.com",
      github: "https://github.com/username/project2"
    },
    {
      title: "Jeu Web 3D",
      description: "Jeu d'aventure en 3D développé avec Three.js et WebGL",
      technologies: ["Three.js", "WebGL", "JavaScript", "Blender"],
      image: "/api/placeholder/400/200",
      link: "https://project3.com",
      github: "https://github.com/username/project3"
    }
  ];

  return (
    <div className="space-y-8 arise">
      <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-12 animate-text">
        Projets
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div 
            key={index} 
            className="project-card rounded-lg overflow-hidden animate-text"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="project-image-container">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-48 object-cover"
              />
              <div className="project-overlay"></div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="project-title text-2xl font-semibold text-purple-300 hover:text-blue-300 transition-colors duration-300">
                {project.title}
              </h3>
              
              <p className="text-gray-300">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="tech-tag px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="project-links flex gap-4 pt-2">
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded transition-all duration-300 text-white"
                >
                  Voir le projet
                </a>
                <a 
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded transition-all duration-300 text-white"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;