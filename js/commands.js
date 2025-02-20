export const commands = {
    help: () => ({
        output: `Commandes disponibles:
- help     : Affiche cette aide
- about    : À propos de moi
- skills   : Mes compétences
- projects : Mes projets
- contact  : Mes coordonnées
- clear    : Efface l'écran
- github   : Mon profil GitHub
- whoami   : Affiche mon nom
- date     : Affiche la date et l'heure
- ls       : Liste les fichiers
- pwd      : Affiche le répertoire actuel
- echo     : Répète le texte saisi
- time     : Affiche l'heure`,
        type: 'success'
    }),
    about: () => ({
        output: "Je suis un développeur web passionné par la création d'expériences interactives uniques...",
        type: 'success'
    }),
    skills: () => ({
        output: `Compétences techniques:
- Frontend : HTML, CSS, JavaScript
- Backend  : PHP
- 3D       : Three.js (en cours)
- Autres   : Git, SQL`,
        type: 'success'
    }),
    projects: () => ({
        output: "Liste des projets:\n- Portfolio DevTerminal\n- Projet X\n- Projet Y",
        type: 'success'
    }),
    contact: () => ({
        output: "Email: contact@exemple.com",
        type: 'success'
    }),
    github: () => ({
        output: "Github: Alexy33",
        type: 'success'
    }),
    clear: (terminal, terminalContent) => {
        terminalContent.innerHTML = '';
        terminal.printWelcomeMessage();
        return { output: '', type: 'success' };
    },
    whoami: () => ({
        output: "Alexy CANU\nDéveloppeur Web Full-Stack",
        type: 'success'
    }),
    date: () => ({
        output: new Date().toLocaleString(),
        type: 'success'
    }),
    ls: () => ({
        output: `
Documents/
├── CV.pdf
├── Projets/
│   ├── Portfolio/
│   ├── Projet-X/
│   └── Projet-Y/
└── Contact/`,
        type: 'success'
    }),
    pwd: () => ({
        output: "/home/alexy/portfolio",
        type: 'success'
    }),
    echo: (args) => ({
        output: args || "",
        type: 'success'
    }),
    time: () => ({
        output: new Date().toLocaleTimeString(),
        type: 'success'
    }), 
};