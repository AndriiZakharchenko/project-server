import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
const os = require('os');
import { exec, ExecException } from 'child_process';

interface ILogProcesses {
  (processInfo: string, fileName: string): void;
}

export default function run() {
  const logProcesses: ILogProcesses = async (processInfo, fileName) => {
    const unixTime = Date.now();
    const logItem = `${unixTime}\t${processInfo}`;
    const directoryPath = path.join(__dirname, 'logs');

    try {
      if (!fs.existsSync(directoryPath)) {
        await fsPromises.mkdir(directoryPath);
        console.log(`Directory 'logs' created`);
      }

      await fsPromises.appendFile(path.join(directoryPath, fileName), logItem);
    } catch (error) {
      console.error(error);
    }
  };

  let lastOutput = '';

  function checkPlatform(): string {
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
      logProcesses(`Unsupported platform - ${os.platform()}`, 'activityMonitor.log');
      process.stdout.end('Process exited with code 1 ');
      process.exit(1);
    }
  }

  function execProcess(command: string) {
    exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        logProcesses(`Error: ${error.message}`, 'activityMonitor.log');
        process.stdout.write('Process exited with code 1 ');
        return;
      }

      if (stderr) {
        logProcesses(stderr, 'activityMonitor.log');
        process.stdout.write('Process exited with code 1 ');
        return;
      }

      lastOutput = stdout;
    });
  }


  function updateConsole() {
    console.clear();
    console.log(lastOutput);
  }

  function updateLog() {
    logProcesses(lastOutput, 'activityMonitor.log');
  }

  setInterval(() => {
    const command = checkPlatform();
    execProcess(command);
  }, 100);

  setInterval(updateConsole, 100);
  setInterval(updateLog, 60000);
}
