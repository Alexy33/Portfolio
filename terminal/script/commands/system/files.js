export const fileCommands = (fileSystem) => ({
    help: () => ({
        output: `Commandes disponibles:
    - help     : Affiche cette aide
    - ls       : Liste les fichiers et dossiers
    - cd       : Change de répertoire
    - pwd      : Affiche le répertoire actuel
    - cat      : Affiche le contenu d'un fichier
    - clear    : Efface l'écran
    - theme    : Change le thème du terminal
    - download : Télécharge un fichier
    - open     : Ouvre un lien dans un nouvel onglet`,
        type: 'success'
    }),
    ls: () => {
        const contents = fileSystem.listCurrentDirectory();
        if (!contents) {
            return { output: 'Erreur lors de la lecture du dossier', type: 'error' };
        }

        const { directories, files } = contents;
        const output = [
            ...directories.map(dir => `${dir}/`),
            ...files
        ].join('\n');

        return { output, type: 'success' };
    },

    cat: (terminal, terminalContent, args) => {
        if (!args) {
            return { output: 'Usage: cat <filename>', type: 'error' };
        }

        const content = fileSystem.readFile(args);
        if (content === null) {
            return { output: `cat: ${args}: Aucun fichier ou dossier de ce type`, type: 'error' };
        }

        return { output: content, type: 'success' };
    },

    clear: (terminal, terminalContent) => {
        terminalContent.innerHTML = '';
        terminal.printWelcomeMessage();
        return { output: '', type: 'success' };
    }
});