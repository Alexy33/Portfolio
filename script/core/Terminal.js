// script/core/Terminal.js

import { commands } from '../commands/index.js';
import { clearSuggestions, showSuggestions } from '../utils/domUtils.js';
import { WELCOME_MESSAGE, AVAILABLE_COMMANDS, TERMINAL_THEMES } from './constants.js';


export class Terminal {
    constructor(fileSystem) {
        // Éléments DOM
        this.element = document.getElementById("terminal");
        this.content = document.getElementById("terminal-content");
        
        // État du terminal
        this.commandHistory = [];
        this.historyIndex = -1;
        this.fileSystem = fileSystem;
        
        // Commandes
        this.commands = commands(fileSystem);

        // Initialisation
        this.init();
    }

    init() {
        this.printWelcomeMessage();
        this.createInputLine();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Garder le focus sur l'input lors du clic sur le terminal
        this.element.addEventListener('click', () => {
            const input = this.content.querySelector('#command-input');
            if (input) input.focus();
        });
    }

    printWelcomeMessage() {
        const systemInfo = {
            platform: navigator.platform,
            browser: navigator.userAgent.split('/', 1)[0],
            date: new Date().toLocaleString()
        };

        let formattedMessage = WELCOME_MESSAGE;
        formattedMessage = formattedMessage.replace('%PLATFORM%', systemInfo.platform);
        formattedMessage = formattedMessage.replace('%BROWSER%', systemInfo.browser);
        formattedMessage = formattedMessage.replace('%DATE%', systemInfo.date);
        formattedMessage = formattedMessage.replace(/%SEPARATOR%/g, '-'.repeat(50));

        this.printToTerminal(formattedMessage, 'success');
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
        
        const path = this.fileSystem.getCurrentDirectory();
        const displayPath = path.replace('/home/', '');
        const isLongPath = displayPath.length > 30;

        inputLine.innerHTML = `
            <span id="prompt" class="${isLongPath ? 'long-path' : ''}">${displayPath}$></span>
            <input type="text" id="command-input" autofocus>
        `;

        this.content.appendChild(inputLine);
        const input = inputLine.querySelector("input");
        
        input.addEventListener("keydown", this.handleKeyDown.bind(this));
        input.addEventListener("input", this.handleInput.bind(this));
        input.focus();
        
        return input;
    }

    handleInput() {
        clearSuggestions(this.content);
    }

    handleKeyDown(event) {
        const input = event.target;

        switch(event.key) {
            case "Tab":
                this.handleTabCompletion(event, input);
                break;
            case "Enter":
                this.handleEnter(event, input);
                break;
            case "ArrowUp":
                this.handleArrowUp(event, input);
                break;
            case "ArrowDown":
                this.handleArrowDown(event, input);
                break;
        }
    }

    handleTabCompletion(event, input) {
        event.preventDefault();
        clearSuggestions(this.content);

        const [command, ...args] = input.value.split(' ');
        
        if (!args.length) {
            this.handleCommandCompletion(command, input);
        } else {
            this.handleArgumentCompletion(command, args[0], input);
        }
    }

    handleCommandCompletion(partialCommand, input) {
        const matchingCommands = AVAILABLE_COMMANDS
            .filter(cmd => cmd.startsWith(partialCommand.toLowerCase()));

        if (matchingCommands.length === 1) {
            input.value = matchingCommands[0];
        } else if (matchingCommands.length > 1) {
            showSuggestions(this.content, matchingCommands);
        }
    }

    handleArgumentCompletion(command, arg, input) {
        let suggestions = [];
    
        switch(command.toLowerCase()) {
            case 'cd':
                suggestions = this.fileSystem.getAutocompleteSuggestions('cd', arg);
                break;
            case 'cat':
            case 'open':
            case 'download':
                suggestions = this.fileSystem.getAutocompleteSuggestions('cat', arg);
                break;
            case 'theme':
                const themeArg = arg || '';
                suggestions = Object.keys(TERMINAL_THEMES)
                    .filter(theme => theme.toLowerCase().startsWith(themeArg.toLowerCase()));
                break;
        }
    
        if (suggestions.length === 1) {
            input.value = `${command} ${suggestions[0]}`;
        } else if (suggestions.length > 1) {
            showSuggestions(this.content, suggestions);
        }
    }

    handleEnter(event, input) {
        clearSuggestions(this.content);

        if (event.shiftKey) {
            this.handleMultiline(input);
        } else {
            this.executeCommand(input.value, input);
        }
    }

    handleMultiline(input) {
        const curPos = input.selectionStart;
        const value = input.value;
        input.value = value.slice(0, curPos) + '\n' + value.slice(curPos);
        input.selectionStart = input.selectionEnd = curPos + 1;
    }

    handleArrowUp(event, input) {
        event.preventDefault();
        if (this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            input.value = this.commandHistory[this.historyIndex];
        }
    }

    handleArrowDown(event, input) {
        event.preventDefault();
        if (this.historyIndex > -1) {
            this.historyIndex--;
            input.value = this.historyIndex === -1 ? '' : this.commandHistory[this.historyIndex];
        }
    }

    executeCommand(command, input) {
        if (!command.trim()) {
            input.parentElement.remove();
            this.createInputLine();
            return;
        }

        input.parentElement.remove();
        this.printToTerminal('>>> ' + command, 'command');

        const [cmd, ...args] = command.toLowerCase().trim().split(' ');

        if (this.commands[cmd]) {
            const result = this.commands[cmd](this, this.content, args.join(' '));
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
        this.createInputLine();
    }
}