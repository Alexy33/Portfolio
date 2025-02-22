import { TERMINAL_THEMES } from '../../core/constants.js';

export const themeCommands = {
    theme: (terminal, terminalContent, args) => {
        if (!args) {
            const themeList = Object.keys(TERMINAL_THEMES).join(', ');
            return {
                output: `Usage: theme <nom_du_theme>\nThèmes disponibles : ${themeList}`,
                type: 'error'  // Changé en 'error' pour éviter la confusion avec les suggestions
            };
        }

        const themeName = args.toLowerCase();
        if (!TERMINAL_THEMES[themeName]) {
            const themeList = Object.keys(TERMINAL_THEMES).join(', ');
            return {
                output: `Thème inconnu.\nThèmes disponibles : ${themeList}`,
                type: 'error'
            };
        }

        const theme = TERMINAL_THEMES[themeName];
        document.documentElement.style.setProperty('--terminal-bg', theme.background);
        document.documentElement.style.setProperty('--terminal-text', theme.text);
        document.documentElement.style.setProperty('--terminal-prompt', theme.prompt);
        document.documentElement.style.setProperty('--terminal-error', theme.error);
        document.documentElement.style.setProperty('--terminal-success', theme.success);

        return {
            output: `Thème ${themeName} appliqué avec succès.`,
            type: 'success'
        };
    }
};