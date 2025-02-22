export const fileToolCommands = (fileSystem) => ({
    download: (terminal, terminalContent, args) => {
        if (!args) {
            return { output: 'Usage: download <filename>', type: 'error' };
        }

        const content = fileSystem.readFile(args);
        if (content === null) {
            return { output: `Fichier "${args}" introuvable.`, type: 'error' };
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = args;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        return { output: `Téléchargement de "${args}" en cours...`, type: 'success' };
    },

    open: (terminal, terminalContent, args) => {
        if (!args) {
            return { output: 'Usage: open <filename>', type: 'error' };
        }

        const content = fileSystem.readFile(args);
        if (content === null) {
            return { output: `Fichier "${args}" introuvable.`, type: 'error' };
        }

        if (content.startsWith('http')) {
            window.open(content, '_blank');
            return { output: `Ouverture de ${args} dans un nouvel onglet...`, type: 'success' };
        }

        return { output: content, type: 'success' };
    }
});