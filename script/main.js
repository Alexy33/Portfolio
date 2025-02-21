import { Terminal } from './core/Terminal.js';
import { FileSystem } from './core/FileSystem.js';

document.addEventListener("DOMContentLoaded", () => {
    const fileSystem = new FileSystem();
    const terminal = new Terminal(fileSystem);
});