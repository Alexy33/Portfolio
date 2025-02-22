document.addEventListener('DOMContentLoaded', function() {
    // Projets Data
    const projectsData = [
        {
            title: 'Portfolio Terminal',
            description: 'Une interface de portfolio interactive inspirée des terminaux Unix, permettant une navigation unique via des commandes.',
            technologies: ['HTML', 'CSS', 'JavaScript', 'Terminal'],
            link: '../terminal'
        },
        {
            title: 'Portfolio Classique',
            description: 'Version classique du portfolio avec une interface moderne et responsive.',
            technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
            link: '#'
        }
    ];

    // Création des cartes de projet
    function createProjectCards() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;
    
        projectsGrid.innerHTML = '';
        projectsData.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            // Modification du HTML pour correspondre à la structure CSS
            card.innerHTML = `
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="technologies">
                        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                    <a href="${project.link}" class="project-link">
                        Voir le projet <span class="arrow">→</span>
                    </a>
                </div>
            `;
            
            // Ajout de l'animation
            card.classList.add('fade-in');
            projectsGrid.appendChild(card);
        });
    }

    // Gestion de la navbar
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 50;
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });

    // Animation des sections au scroll
    const sections = document.querySelectorAll('.section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.querySelector('.skill-card')) {
                    entry.target.querySelectorAll('.skill-card').forEach(card => {
                        card.classList.add('animated');
                    });
                }
            }
        });
    }, {
        threshold: 0.2
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.textContent = 'Envoi en cours...';
                submitBtn.disabled = true;
                
                const formData = new FormData(contactForm);
                // Simulation d'envoi
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                contactForm.reset();
                alert('Message envoyé avec succès !');
            } catch (error) {
                alert('Une erreur est survenue. Veuillez réessayer.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Animation smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize project cards
    createProjectCards();
});