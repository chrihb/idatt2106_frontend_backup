// This script is used to run OS-specific commands in a cross-platform way
import { exec } from 'child_process';
import { platform } from 'os';

// Runnable command in each OS
const commands = {
    openE2eCoverage: {
        win32: 'start coverage\\lcov-report\\index.html',
        default: 'open coverage/lcov-report/index.html',
    },
    openUnitCoverage: {
        win32: 'start coverage\\unit\\index.html',
        default: 'open coverage/unit/index.html',
    }
};

// Check if the command is provided
const cmdToRun = process.argv[2];
if (!cmdToRun) {
    console.error('Invalid or missing command. Please specify a command to run.');
    console.error('Allowed commands are:', Object.keys(commands).join(', '));
    process.exit(1);
}

// Determine OS and select command
const os = platform();
const command = commands[cmdToRun][os] || commands[cmdToRun].default;

exec(command, (error) => {
    if (error) {
        console.error(`Error executing command: ${error.message}`);
        process.exit(1);
    }
    console.log(`Command executed successfully: ${command}`);
})

