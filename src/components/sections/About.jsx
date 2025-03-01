import React, { useEffect } from 'react';
import profileImg from '../../assets/images/profile/photo_pro.JPG';
import '../../styles/about.css';

const About = () => {
  useEffect(() => {
    const texts = document.querySelectorAll('.animate-text');
    texts.forEach((text, index) => {
      text.style.animationDelay = `${index * 0.2}s`;
    });
  }, []);

  return (
    <div className="relative space-y-8 arise overflow-hidden">
      {/* Cercles lumineux d'arrière-plan */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>

      <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-12 animate-text hover:from-blue-400 hover:to-purple-400 transition-all duration-500">
        À propos de moi
      </h2>

      <div className="space-y-8">
        <div className="text-center">
          {/* Container de la photo avec animations */}
          <div className="profile-container relative w-64 h-64 mx-auto mb-8">
            {/* Cercle rotatif externe */}
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-spin-slow"></div>
            
            {/* Runes qui tournent */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/20 animate-spin-reverse"></div>
            
            {/* Container de l'image - sans arrière-plan */}
            <div className="profile-image relative w-full h-full">
              <img 
                src={profileImg}
                alt="Photo de profil" 
                className="w-full h-full rounded-full object-cover border-4 border-purple-600/50 animate-border"
              />
              
              {/* Runes autour de l'image */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * Math.PI / 180;
                const distance = 110; // Distance du centre
                return (
                  <div 
                    key={i}
                    className="rune"
                    style={{
                      top: `calc(50% + ${Math.sin(angle) * distance}px)`,
                      left: `calc(50% + ${Math.cos(angle) * distance}px)`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  ></div>
                );
              })}
            </div>
          </div>

          <h3 className="text-3xl font-semibold text-purple-200 animate-text hover:text-blue-300 transition-colors duration-300">Alexy Canu</h3>
          <p className="text-xl text-blue-300 animate-text hover:text-purple-300 transition-colors duration-300">Pentester Junior</p>
        </div>
        
        <div className="space-y-6 text-lg">
          <p className="text-gray-300 animate-text hover:text-blue-200 transition-colors duration-300 p-4 rounded-lg hover:bg-purple-900/20">
            Étudiant à Epitech en première année, je suis actuellement en recherche active de stage de 4 à 6 mois 
            de juillet à décembre.
          </p>
          <p className="text-gray-300 animate-text hover:text-blue-200 transition-colors duration-300 p-4 rounded-lg hover:bg-purple-900/20">
            Passionné par la cybersécurité et la programmation, je cherche à développer mes compétences 
            dans un environnement professionnel stimulant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="info-card p-6 rounded-xl bg-slate-900/80 border border-purple-500/30 backdrop-blur hover:bg-slate-800/80 transition-all duration-500 animate-text group">
            <h4 className="text-xl font-semibold text-purple-300 mb-3 group-hover:text-blue-300 transition-colors duration-300">Formation</h4>
            <p className="text-gray-300 group-hover:text-white transition-colors duration-300">2024 - 2029: EPITECH Bordeaux</p>
            <p className="text-blue-300 group-hover:text-purple-300 transition-colors duration-300">2022 - 2024: Baccalauréat général spécialités NSI & anglais</p>
          </div>
          <div className="info-card p-6 rounded-xl bg-slate-900/80 border border-purple-500/30 backdrop-blur hover:bg-slate-800/80 transition-all duration-500 animate-text group">
            <h4 className="text-xl font-semibold text-purple-300 mb-3 group-hover:text-blue-300 transition-colors duration-300">Contact</h4>
            <p className="text-gray-300 group-hover:text-white transition-colors duration-300">Bordeaux 33000</p>
            <p className="text-blue-300 group-hover:text-purple-300 transition-colors duration-300">alexy.canu@epitech.eu | 06 64 86 25 16</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;