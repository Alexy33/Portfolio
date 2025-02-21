export const navigationCommands = (fileSystem) => ({
    cd: (terminal, terminalContent, args) => {
        if (!args) {
            fileSystem.navigateTo('/home/alexy');
            return { output: '', type: 'success' };
        }
        
        const result = fileSystem.navigateTo(args);
        if (!result.success) {
            return { output: result.error, type: 'error' };
        }
        return { output: '', type: 'success' };
    },

    pwd: () => ({
        output: fileSystem.getCurrentDirectory(),
        type: 'success'
    })
});