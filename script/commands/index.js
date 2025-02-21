import { navigationCommands } from './system/navigation.js';
import { fileCommands } from './system/files.js';
import { themeCommands } from './tools/themeCommands.js';
import { fileToolCommands } from './tools/fileTools.js';

export const commands = (fileSystem) => ({
    ...navigationCommands(fileSystem),
    ...fileCommands(fileSystem),
    ...themeCommands,
    ...fileToolCommands(fileSystem)
});