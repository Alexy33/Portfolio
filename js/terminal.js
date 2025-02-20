import { commands } from './commands.js';

export class Terminal {
    constructor() {
        this.element = document.getElementById("terminal");
        this.content = document.getElementById("terminal-content");
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.init();
    }

    init() {
        this.printWelcomeMessage();
        this.createInputLine();
    }

    printWelcomeMessage() {
        const welcomeMessage = `
    ██████╗ ███████╗██╗   ██╗████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
    ██╔══██╗██╔════╝██║   ██║╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
    ██║  ██║█████╗  ██║   ██║   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
    ██║  ██║██╔══╝  ╚██╗ ██╔╝   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
    ██████╔╝███████╗ ╚████╔╝    ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
    ╚═════╝ ╚══════╝  ╚═══╝     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝

    DevTerminal v1.0.0 (Terminal Portfolio)
    Système: ${navigator.platform} | Navigateur: ${navigator.userAgent.split('/', 1)[0]}
    Date: ${new Date().toLocaleString()}

    ${'-'.repeat(50)}
    Bienvenue dans mon portfolio terminal! Tapez 'help' pour voir les commandes disponibles.
    ${'-'.repeat(50)}
    `;
        this.printToTerminal(welcomeMessage, 'success');
    }

    printToTerminal(text, type = 'normal') {
        const line = document.createElement('div');
        line.className = `${type}-text`;
        line.textContent = text;
        this.content.appendChild(line);
        this.element.scrollTop = this.element.scrollHeight;
    }

    createInputLine() {
        const inputLine = document.createElement("div");
        inputLine.id = "input-line";
        inputLine.innerHTML = `
            <span id="prompt">$></span>
            <input type="text" id="command-input" autofocus>
        `;
        this.content.appendChild(inputLine);
        const input = inputLine.querySelector("input");
        input.addEventListener("keydown", this.handleKeyDown.bind(this));
        input.focus();
        return input;
    }

    handleKeyDown(event) {
        const input = event.target;
        
        if (event.key === "Enter") {
            const command = input.value;
            this.executeCommand(command, input);
        } 
        else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                input.value = this.commandHistory[this.historyIndex];
            }
        }
        else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (this.historyIndex > -1) {
                this.historyIndex--;
                input.value = this.historyIndex === -1 ? '' : this.commandHistory[this.historyIndex];
            }
        }
    }

    executeCommand(command, input) {
        if (command.trim()) {
            input.parentElement.remove();
            
            this.printToTerminal('>>> ' + command, 'command');
            
            const [cmd, ...args] = command.toLowerCase().trim().split(' ');
            
            if (commands[cmd]) {
                const result = commands[cmd](this, this.content, args.join(' '));
                if (result.output) {
                    this.printToTerminal(result.output, result.type);
                }
            } else {
                this.printToTerminal(
                    `Commande inconnue: ${cmd}. Tapez 'help' pour voir les commandes disponibles.`,
                    'error'
                );
            }

            this.commandHistory.unshift(command);
            this.historyIndex = -1;
        }
        
        this.createInputLine();
    }
}