document.addEventListener("DOMContentLoaded", function() {
    const terminal = document.getElementById("terminal");
    const terminalContent = document.getElementById("terminal-content");
    let commandHistory = [];
    let historyIndex = -1;

    const welcomeMessage = 'Bienvenue dans mon portfolio terminal! Tapez \'help\' pour voir les commandes disponibles'

    function createInputLine() {
        const inputLine = document.createElement("div");
        inputLine.id = "input-line";
        inputLine.innerHTML = `
            <span id="prompt">$</span>
            <input type="text" id="command-input" autofocus>
        `;
        terminalContent.appendChild(inputLine);
        const input = inputLine.querySelector("input");
        
        input.addEventListener("keydown", handleKeyDown);
        input.focus();
        return input;
    }

    const commands = {
        help: () => ({
            output: `Commandes disponibles:
- help     : Affiche cette aide
- about    : À propos de moi
- skills   : Mes compétences
- projects : Mes projets
- contact  : Mes coordonnées
- clear    : Efface l'écran
- github   : Mon profil GitHub`,
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
        clear: () => {
            terminalContent.innerHTML = '';
            printToTerminal(welcomeMessage, 'success');
            return { output: '', type: 'success' };
        }
    };

    function printToTerminal(text, type = 'normal') {
        const line = document.createElement('div');
        line.className = type + '-text';
        line.textContent = text;
        terminalContent.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }

    function executeCommand(command, input) {
        const cmd = command.toLowerCase().trim();
        
        if (cmd) {
            // Supprimer l'ancienne ligne de commande
            input.parentElement.remove();
            
            // Afficher la commande
            printToTerminal('$> ' + command, 'command');
            
            if (commands[cmd]) {
                const result = commands[cmd]();
                if (result.output) {
                    printToTerminal(result.output, result.type);
                }
            } else {
                printToTerminal(`Commande inconnue: ${command}. Tapez 'help' pour voir les commandes disponibles.`, 'error');
            }

            commandHistory.unshift(command);
            historyIndex = -1;
            
            // Créer une nouvelle ligne de commande
            createInputLine();
        }
    }

    function handleKeyDown(event) {
        const input = event.target;
        
        if (event.key === "Enter") {
            const command = input.value;
            executeCommand(command, input);
        } 
        else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            }
        }
        else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (historyIndex > -1) {
                historyIndex--;
                input.value = historyIndex === -1 ? '' : commandHistory[historyIndex];
            }
        }
    }

    // Message de bienvenue
    printToTerminal(welcomeMessage, 'success');

    // Créer la première ligne de commande
    createInputLine();
});