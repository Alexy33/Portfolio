export function clearSuggestions(element) {
    const suggestions = element.querySelectorAll('.info-text');
    suggestions.forEach(el => el.remove());
}

export function showSuggestions(element, suggestions) {
    if (suggestions.length > 0) {
        const suggestionHeader = document.createElement('div');
        suggestionHeader.className = 'info-text';
        suggestionHeader.textContent = 'Suggestions:';
        element.appendChild(suggestionHeader);

        const suggestionList = document.createElement('div');
        suggestionList.className = 'info-text';
        suggestionList.textContent = suggestions.join('  ');
        element.appendChild(suggestionList);
    }
}

export function createPromptLine(path, isLongPath) {
    const promptElement = document.createElement('span');
    promptElement.id = 'prompt';
    if (isLongPath) promptElement.classList.add('long-path');
    promptElement.textContent = `${path}$>`;
    return promptElement;
}

export function createCommandInput() {
    const input = document.createElement('input');
    input.id = 'command-input';
    input.type = 'text';
    input.setAttribute('autofocus', 'true');
    return input;
}