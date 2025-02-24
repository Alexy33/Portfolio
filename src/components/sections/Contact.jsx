import React, { useState, useEffect } from 'react';
import '../../styles/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    // Animation séquentielle des éléments
    const elements = document.querySelectorAll('.animate-text');
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.2}s`;
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajoutez ici votre logique d'envoi de formulaire
    console.log('Form submitted:', formData);
    
    // Réinitialiser le formulaire après soumission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Effet visuel pour montrer la soumission
    const button = e.target.querySelector('button');
    button.innerText = 'Envoyé !';
    setTimeout(() => {
      button.innerText = 'Envoyer';
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="relative space-y-8 arise overflow-hidden">
      {/* Cercles lumineux d'arrière-plan */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>

      <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-12 animate-text">
        Contact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="contact-card rounded-lg p-6 backdrop-blur animate-text">
            <h3 className="contact-title text-xl font-semibold text-purple-300 mb-6">Coordonnées du Shadow Monarch</h3>
            <div className="space-y-4">
              <div className="contact-info-item flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300">
                <div className="p-2 rounded-full bg-purple-500/20">📍</div>
                <span>Paris, France</span>
              </div>
              <div className="contact-info-item flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300">
                <div className="p-2 rounded-full bg-purple-500/20">📧</div>
                <span>email@example.com</span>
              </div>
              <div className="contact-info-item flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300">
                <div className="p-2 rounded-full bg-purple-500/20">📱</div>
                <span>+33 6 12 34 56 78</span>
              </div>
            </div>
          </div>
          
          <div className="contact-card rounded-lg p-6 backdrop-blur animate-text">
            <h3 className="contact-title text-xl font-semibold text-purple-300 mb-6">Réseaux d'Ombre</h3>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link px-4 py-3 rounded transition-all duration-300 text-white flex items-center gap-2"
              >
                <span>LinkedIn</span>
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link px-4 py-3 rounded transition-all duration-300 text-white flex items-center gap-2"
              >
                <span>GitHub</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link px-4 py-3 rounded transition-all duration-300 text-white flex items-center gap-2"
              >
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-card rounded-lg p-6 backdrop-blur space-y-6 animate-text">
          <h3 className="contact-title text-xl font-semibold text-purple-300 mb-6">Invoquer le Shadow Monarch</h3>
          
          <div className="space-y-2">
            <label htmlFor="name" className="block text-gray-300">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="contact-input w-full p-3 rounded"
              required
              placeholder="Votre nom"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="contact-input w-full p-3 rounded"
              required
              placeholder="votre@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subject" className="block text-gray-300">Sujet</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="contact-input w-full p-3 rounded"
              required
              placeholder="Sujet de votre message"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="block text-gray-300">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="contact-input w-full p-3 rounded"
              required
              placeholder="Votre message..."
            />
          </div>
          
          <button 
            type="submit"
            className="submit-button w-full py-3 rounded-md text-white"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;