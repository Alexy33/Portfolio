export function normalizePath(path) {
    const parts = path.split('/').filter(part => part && part !== '.');
    const normalized = [];
    
    for (const part of parts) {
        if (part === '..') {
            normalized.pop();
        } else {
            normalized.push(part);
        }
    }
    
    return '/' + normalized.join('/');
}

export function resolvePath(path, currentPath) {
    if (path.startsWith('/')) {
        return normalizePath(path);
    }
    
    if (path === '..') {
        const parts = currentPath.split('/');
        parts.pop();
        return parts.join('/') || '/';
    }
    
    if (path === '.') {
        return currentPath;
    }
    
    return normalizePath(`${currentPath}/${path}`);
}

export function isAbsolutePath(path) {
    return path.startsWith('/');
}

export function getParentDirectory(path) {
    const parts = path.split('/');
    parts.pop();
    return parts.join('/') || '/';
}

export function getFileName(path) {
    return path.split('/').pop();
}