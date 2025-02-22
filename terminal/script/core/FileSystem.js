import { normalizePath, resolvePath } from '../utils/pathUtils.js';

export class FileSystem {
    constructor() {
        this.currentPath = '/home/alexy';
        this.fileStructure = {
            'home': {
                'alexy': {
                    'Bureau': {
                        'README.txt': `Bienvenue sur mon Portfolio Terminal !

Pour naviguer dans ce portfolio, utilisez les commandes suivantes :
- ls    : Liste les fichiers et dossiers
- cd    : Change de répertoire (ex: cd Documents)
- pwd   : Affiche le répertoire actuel
- cat   : Affiche le contenu d'un fichier (ex: cat about.txt)
- clear : Efface l'écran
- help  : Affiche l'aide

N'hésitez pas à explorer !`
                    },
                    'Documents': {
                        'CV': {
                            'presentation.txt': `Je suis Alexy CANU, développeur web passionné par la création d'expériences interactives.`,
                            'competences.txt': `Compétences techniques :
Frontend:
- HTML5, CSS3
- JavaScript
- React.js
- Three.js

Backend:
- PHP
- SQL
- Node.js

Outils:
- Git
- VS Code
- Adobe XD`,
                            'experiences.txt': `Expériences professionnelles et projets`
                        },
                        'Projets': {
                            'Portfolio': {
                                'description.txt': `Portfolio en style terminal`,
                                'github.txt': 'https://github.com/Alexy33/Portfolio'
                            }
                        }
                    },
                    'Contact': {
                        'email.txt': 'canualexy@gmail.com',
                        'linkedin.txt': 'https://www.linkedin.com/in/alexy-canu-006aa1344/',
                        'github.txt': 'https://github.com/Alexy33',
                        'contact.txt': `N'hésitez pas à me contacter pour toute opportunité ou collaboration !`
                    }
                }
            }
        };
    }

    getCurrentDirectory() {
        return this.currentPath;
    }

    navigateTo(path) {
        if (!path) {
            this.currentPath = '/home/alexy';
            return { success: true, path: this.currentPath };
        }
        
        const newPath = resolvePath(path, this.currentPath);
        const parts = newPath.split('/').filter(Boolean);
        let current = this.fileStructure;
        let actualPath = '';
        
        for (const part of parts) {
            const foundKey = Object.keys(current).find(
                key => key.toLowerCase() === part.toLowerCase()
            );
            if (!foundKey || typeof current[foundKey] !== 'object') {
                return { success: false, error: `cd: ${path}: Aucun fichier ou dossier de ce type` };
            }
            current = current[foundKey];
            actualPath += '/' + foundKey;
        }
        
        this.currentPath = actualPath;
        return { success: true, path: actualPath };
    }

    listCurrentDirectory() {
        let current = this.fileStructure;
        const parts = this.currentPath.split('/').filter(Boolean);
        
        for (const part of parts) {
            if (!current[part]) return null;
            current = current[part];
        }
        
        const contents = Object.entries(current);
        const directories = contents
            .filter(([_, value]) => typeof value === 'object')
            .map(([name]) => name);
        const files = contents
            .filter(([_, value]) => typeof value === 'string')
            .map(([name]) => name);
        
        return { directories, files };
    }

    readFile(filename) {
        let current = this.fileStructure;
        const parts = this.currentPath.split('/').filter(Boolean);
        
        for (const part of parts) {
            const foundKey = Object.keys(current).find(
                key => key.toLowerCase() === part.toLowerCase()
            );
            if (!foundKey) return null;
            current = current[foundKey];
        }
        
        const foundFile = Object.keys(current).find(
            key => key.toLowerCase() === filename.toLowerCase()
        );
        
        return foundFile ? current[foundFile] : null;
    }

    getAutocompleteSuggestions(command, partial) {
        let current = this.fileStructure;
        const parts = this.currentPath.split('/').filter(Boolean);
        
        for (const part of parts) {
            const foundKey = Object.keys(current).find(
                key => key.toLowerCase() === part.toLowerCase()
            );
            if (!foundKey) return [];
            current = current[foundKey];
        }

        const searchTerm = partial.toLowerCase();
        
        switch(command.toLowerCase()) {
            case 'cd':
                return Object.keys(current)
                    .filter(key => typeof current[key] === 'object')
                    .filter(key => key.toLowerCase().startsWith(searchTerm));
            case 'cat':
                return Object.keys(current)
                    .filter(key => typeof current[key] === 'string')
                    .filter(key => key.toLowerCase().startsWith(searchTerm));
            default:
                return Object.keys(current)
                    .filter(key => key.toLowerCase().startsWith(searchTerm));
        }
    }
}