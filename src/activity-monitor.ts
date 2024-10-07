import fs from 'fs';
import os from 'os';
import path from 'path';
import { exec, ExecException } from 'child_process';

interface ILogProcesses {
  (processInfo: string, fileName: string): void;
}

const logProcesses: ILogProcesses = (processInfo, fileName) => {
  const unixTime = Date.now();
  const logItem = `${unixTime}\t${processInfo}\n`; // додано новий рядок

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
  const unixLikePlatforms = ['aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'netbsd', 'sunos'];
  const windowsPlatforms = ['win32', 'cygwin'];

  if (unixLikePlatforms.includes(platform)) {
    return 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1';
  } if (windowsPlatforms.includes(platform)) {
    return 'powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + \' \' + $_.CPU + \' \' + $_.WorkingSet }"';
  }
  return ''; // Повертає порожній рядок, якщо платформа не підтримується
}

function processExit() {
  process.stderr.write('Process exited with code 1\n');
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

    lastOutput = typeof stdout === 'string' ? stdout : JSON.stringify(stdout);
  });
}

function updateConsole() {
  process.stdout.write(`${lastOutput}\r`);
}

function updateLog() {
  logProcesses(lastOutput, 'activityMonitor.log');
}

export default function run() {
  const command = getPlatformCmd();
  if (!command) {
    process.stderr.write('Unsupported platform');
    logProcesses(`Unsupported platform - ${os.platform()}`, 'activityMonitor.log');
    process.exit(1);
  }

  setInterval(() => execProcess(command), 100); // Запуск команди кожні 100 мс
  setInterval(updateConsole, 100); // Оновлення консолі кожні 100 мс
  setInterval(updateLog, 60000); // Запис у лог кожні 60 секунд
}
