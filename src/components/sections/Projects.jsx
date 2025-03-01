import React from 'react';
import '../../styles/projects.css';
import sudoImg from '../../assets/images/projects/sudo.png';
import miniImg from '../../assets/images/projects/minishell.png';

const Projects = () => {
  const projects = [
    {
      title: "my_sudo",
      description: "Recréation du super user do (sudo) en C, en équipe de deux. Le but est de donner des droits à l'utilisateur grâce à son mot de passe pour qu'il puisse utiliser des commandes importantes.",
      technologies: ["C", "Makefile", "Linux"],
      image: sudoImg,
      link: "#",
      github: "https://github.com/Alexy33"
    },
    {
      title: "minishell",
      description: "Recréation d'un terminal en C avec certaines commandes et certaines restrictions. Implémentation de fonctionnalités basiques d'un shell Linux.",
      technologies: ["C", "Makefile", "Linux", "Shell"],
      image: miniImg,
      link: "#",
      github: "https://github.com/Alexy33"
    },
  ];

  return (
    <div className="space-y-8 arise">
      <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-12 animate-text">
        Projets & Expériences
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
                {project.link !== "#" && (
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded transition-all duration-300 text-white"
                  >
                    Voir le projet
                  </a>
                )}
                {project.github !== "#" && (
                  <a 
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded transition-all duration-300 text-white"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-8 animate-text">
          Intérêts & Passions
        </h3>
        
        <div className="project-card rounded-lg overflow-hidden animate-text p-6">
          <p className="text-gray-300 mb-4">
            En tant qu'étudiant en cybersécurité et développement, je m'intéresse particulièrement à:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <h4 className="text-xl text-purple-300 mb-2">Pentesting</h4>
              <p className="text-gray-400">Analyse de vulnérabilités et sécurité offensive</p>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <h4 className="text-xl text-purple-300 mb-2">Développement</h4>
              <p className="text-gray-400">Programmation de jeux vidéo et applications</p>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <h4 className="text-xl text-purple-300 mb-2">Systèmes Linux</h4>
              <p className="text-gray-400">Administration et configuration avancée</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;