document.addEventListener("DOMContentLoaded", function() {
    const terminal = document.getElementById("terminal");
    const inputField = document.getElementById("command-input");
    
    function printToTerminal(text) {
        terminal.innerHTML += text + "\n";
        terminal.scrollTop = terminal.scrollHeight;
    }
    
    function executeCommand(command) {
        switch (command.toLowerCase()) {
            case "help":
                printToTerminal("Commandes disponibles: help, projects, contact");
                break;
            case "projects":
                printToTerminal("Liste des projets: \n- Portfolio DevTerminal\n- Projet X\n- Projet Y");
                break;
            case "contact":
                printToTerminal("Email: contact@exemple.com");
                break;
            default:
                printToTerminal("Commande inconnue: " + command);
                break;
        }
    }
    
    inputField.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            let command = inputField.value.trim();
            if (command) {
                printToTerminal("$ " + command);
                executeCommand(command);
            }
            inputField.value = "";
        }
    });
});
