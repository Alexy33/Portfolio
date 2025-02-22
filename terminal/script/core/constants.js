export const WELCOME_MESSAGE = String.raw`
██████╗ ███████╗██╗   ██╗████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
██╔══██╗██╔════╝██║   ██║╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
██║  ██║█████╗  ██║   ██║   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
██║  ██║██╔══╝  ╚██╗ ██╔╝   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
██████╔╝███████╗ ╚████╔╝    ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
╚═════╝ ╚══════╝  ╚═══╝     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝

DevTerminal v1.0.0 (Terminal Portfolio)
Système: %PLATFORM% | Navigateur: %BROWSER%
Date: %DATE%

%SEPARATOR%
Bienvenue dans mon portfolio terminal! Tapez 'help' pour voir les commandes disponibles.
%SEPARATOR%
`;

export const AVAILABLE_COMMANDS = [
    'help',
    'ls',
    'cd',
    'pwd',
    'cat',
    'clear',
    'theme',
    'download',
    'open'
];

export const TERMINAL_THEMES = {
    matrix: {
        background: '#000000',
        text: '#00ff00',
        prompt: '#00ff00',
        error: '#ff0000',
        success: '#00ff00'
    },
    cyberpunk: {
        background: '#2b213a',
        text: '#ff0055',
        prompt: '#00ffff',
        error: '#ff3e3e',
        success: '#00ff9f'
    },
    retro: {
        background: '#2d2b2b',
        text: '#ffd700',
        prompt: '#ffa500',
        error: '#ff6b6b',
        success: '#98fb98'
    },
    light: {
        background: '#f0f0f0',
        text: '#2d2d2d',
        prompt: '#0066cc',
        error: '#cc0000',
        success: '#007700'
    }
};

export const DEFAULT_THEME = 'matrix';