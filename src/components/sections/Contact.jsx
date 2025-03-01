import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import cvPDF from '../../assets/documents/CV_Alexy_Canu.pdf';
import '../../styles/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Animation séquentielle des éléments
    const elements = document.querySelectorAll('.animate-text');
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.2}s`;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Remplacez ces valeurs par vos propres identifiants EmailJS
      const serviceId = 'service_t50mx35';
      const templateId = 'template_whxxqxv';
      const publicKey = 'vcxBBf4yfn_OydC1a';
      
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message
      };
      
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      // Réinitialiser le formulaire après soumission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setStatus({
        submitted: true,
        success: true,
        message: 'Votre message a été envoyé avec succès !'
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setStatus({
        submitted: true,
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
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
            <h3 className="contact-title text-xl font-semibold text-purple-300 mb-6">Mes Coordonnées</h3>
            <div className="space-y-4">
              <div className="contact-info-item flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300">
                <div className="p-2 rounded-full bg-purple-500/20">📍</div>
                <span>Bordeaux, 33000</span>
              </div>
              <div className="contact-info-item flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300">
                <div className="p-2 rounded-full bg-purple-500/20">📧</div>
                <span>alexy.canu@epitech.eu</span>
              </div>
              <div className="contact-info-item flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300">
                <div className="p-2 rounded-full bg-purple-500/20">📱</div>
                <span>06 64 86 25 16</span>
              </div>
            </div>
          </div>
          
          <div className="contact-card rounded-lg p-6 backdrop-blur animate-text">
            <h3 className="contact-title text-xl font-semibold text-purple-300 mb-6">Réseaux</h3>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://www.linkedin.com/in/alexy-canu-006aa1344/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link px-4 py-3 rounded transition-all duration-300 text-white flex items-center gap-2"
              >
                <span>LinkedIn</span>
              </a>
              <a 
                href="https://github.com/Alexy33" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link px-4 py-3 rounded transition-all duration-300 text-white flex items-center gap-2"
              >
                <span>GitHub</span>
              </a>
            </div>
          </div>

          <div className="contact-card rounded-lg p-6 backdrop-blur animate-text">
            <h3 className="contact-title text-xl font-semibold text-purple-300 mb-6">Disponibilité</h3>
            <p className="text-gray-300">
              Je suis actuellement en recherche de stage de <span className="text-blue-300 font-semibold">4 à 6 mois</span> à partir de <span className="text-blue-300 font-semibold">juillet 2025</span> jusqu'à <span className="text-blue-300 font-semibold">décembre 2025</span>.
            </p>
            <p className="text-gray-300 mt-3">
              Je suis particulièrement intéressé par les domaines de la cybersécurité, du développement logiciel et du DevOps.
            </p>
            
            {/* Bouton de téléchargement du CV */}
            <div className="mt-6">
              <a 
                href={cvPDF} 
                download="Alexy_Canu_CV.pdf"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium
                shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Télécharger mon CV
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-card rounded-lg p-6 backdrop-blur space-y-6 animate-text">
          <h3 className="contact-title text-xl font-semibold text-purple-300 mb-6">Me Contacter</h3>
          
          {status.submitted && (
            <div className={`p-4 rounded-md ${status.success ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
              {status.message}
            </div>
          )}
          
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit"
            className="submit-button w-full py-3 rounded-md text-white"
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;