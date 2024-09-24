import fs from 'fs';
import path from 'path';
import { exec, ExecException } from 'child_process';
const os = require('os');

interface ILogProcesses {
  (processInfo: string, fileName: string): void;
}

const logProcesses: ILogProcesses = (processInfo, fileName) => {
  const unixTime = Date.now();
  const logItem = `${unixTime}\t${processInfo}`;
  const directoryPath = path.join(__dirname, 'logs');

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  fs.appendFile(path.join(directoryPath, fileName), logItem, (error) => {
    if (error) throw error;
    console.log('Saved!');
  });
};

let lastOutput = '';

function getPlatformCmd() {
  const platform = os.platform();
  const unixLikePlatforms = [
    'aix',       // IBM AIX
    'darwin',    // macOS (і iOS)
    'freebsd',   // FreeBSD
    'linux',     // Linux дистрибутиви
    'openbsd',   // OpenBSD
    'netbsd',    // NetBSD
    'sunos'      // SunOS (Solaris)
  ];
  const windowsPlatforms = [
    'win32',     // Windows (усі версії)
    'cygwin'     // Cygwin (POSIX-спільний шар для Windows)
  ];

  if (unixLikePlatforms.includes(platform)) {
    return 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1';
  } else if (windowsPlatforms.includes(platform)) {
    return `powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"`;
  } else {
    return '';
  }
}

function processExit() {
  process.stderr.end('Process exited with code 1 ');
  process.exit(1);
}

function execProcess(command: string) {
  exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
    if (error) {
      logProcesses(`Error: ${error.message}`, 'activityMonitor.log');
      processExit();
    }

    if (stderr) {
      logProcesses(stderr, 'activityMonitor.log');
      processExit();
    }

    lastOutput = stdout;
  });
}

function updateConsole() {
  console.clear();
  process.stdout.write(`${lastOutput}`);
}

function updateLog() {
  logProcesses(lastOutput, 'activityMonitor.log');
}

export default function run() {
  setInterval(() => {
    const command = getPlatformCmd();

    if (!command) {
      process.stderr.end('Unsupported platform')
      logProcesses(`Unsupported platform - ${os.platform()}`, 'activityMonitor.log');
      processExit();
    } else {
      execProcess(command);
    }
  }, 100);

  setInterval(updateConsole, 100);
  setInterval(updateLog, 60000);
}
