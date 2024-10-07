import os from 'os';
import childProcess from 'child_process';
import fs from 'fs';
import run from './activity-monitor';

jest.mock('child_process');
jest.mock('fs');
const flushPromises = () => new Promise(jest.requireActual('timers').setImmediate);
describe('[Module 2: Standard Library]', () => {
  let stdErrSpy: jest.SpyInstance;
  let stdOutSpy: jest.SpyInstance;
  let execMock: jest.SpyInstance;
  let appendFileMock: jest.SpyInstance;
  beforeAll(() => {
    stdErrSpy = jest.spyOn(process.stderr, 'write');
    stdOutSpy = jest.spyOn(process.stdout, 'write');
    const mockExec = jest.fn().mockImplementation((cmd, callback) => {
      callback(null, { stdout: 'PID_MOCKED\n', stderr: '' });
    });
    execMock = jest.spyOn(childProcess, 'exec').mockImplementation(mockExec);
    appendFileMock = jest.spyOn(fs, 'appendFile').mockImplementation((fileName, message, callback) => {
      callback(null);
    });
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  describe('platform agnostic >', () => {
    describe('unsupported platform >', () => {
      let processExitMock: jest.SpyInstance;
      beforeAll(() => {
        processExitMock = jest.spyOn(process, 'exit').mockImplementation((number) => {
          throw new Error(`process.exit: ${number}`);
        });
        jest.spyOn(os, 'platform').mockImplementation(() => 'unsupported_os' as NodeJS.Platform);
      });
      it('finishes the process with code 1', () => {
        expect(() => {
          run();
        }).toThrow();
        expect(processExitMock).toHaveBeenCalledWith(1);
        expect(stdErrSpy).toHaveBeenCalledWith('Unsupported platform');
        expect(execMock).not.toHaveBeenCalled();
      });
    });
    it('uses correct command on Windows', () => {
      jest.spyOn(os, 'platform').mockReturnValue('win32');
      run();
      jest.advanceTimersByTime(1000);
      expect(execMock).toHaveBeenCalledWith("powershell \"Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }\"", expect.anything());
    });
    it('uses correct command on Linux', () => {
      jest.spyOn(os, 'platform').mockReturnValue('linux');
      run();
      jest.advanceTimersByTime(1000);
      expect(execMock).toHaveBeenCalledWith('ps -A -o %cpu,%mem,comm | sort -nr | head -n 1', expect.anything());
    });
    it('uses correct command on Mac', () => {
      jest.spyOn(os, 'platform').mockReturnValue('darwin');
      run();
      jest.advanceTimersByTime(1000);
      expect(execMock).toHaveBeenCalledWith('ps -A -o %cpu,%mem,comm | sort -nr | head -n 1', expect.anything());
    });
  });
  it('refresh rate is 10 times per second', () => {
    run();
    jest.advanceTimersByTime(1000);
    expect(execMock).toHaveBeenCalledTimes(10);
  });
  it('each update is not starting from the new line', async () => {
    run();
    jest.advanceTimersByTime(100);
    await flushPromises();
    const call = stdOutSpy.mock.calls[0][0];
    expect(call).toContain('PID_MOCKED');
    expect(call).toContain('\r');
    expect(call).not.toContain('\n');
  });
  it('writes the log every 60 seconds using fs.appendFile', async () => {
    run();
    jest.advanceTimersByTime(59_000);
    await flushPromises();
    expect(appendFileMock).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(1_000);
    await flushPromises();
    expect(appendFileMock).toHaveBeenCalled();
  });
  describe('uses only standard library >', () => {
    it('application does not have package.json or does not use any third-party modules', () => {
      let packageJson;
      try {
        // eslint-disable-next-line global-require
        packageJson = require('../../package.json');
      } catch (error: unknown) {
        expect((error as NodeJS.ErrnoException).code).toBe('MODULE_NOT_FOUND');
        return;
      }
      if (packageJson) {
        // eslint-disable-next-line max-len
        const deps = new Set([...(packageJson.dependencies ? Object.keys(packageJson.dependencies) : []), ...(packageJson.devDependencies ? Object.keys(packageJson.devDependencies) : [])]);
        const allowedDeps = new Set(['@types/jest', '@types/node', '@typescript-eslint/eslint-plugin', '@typescript-eslint/parser', 'eslint', 'eslint-config-airbnb-base', 'jest', 'jest-junit', 'ts-jest', 'typescript']);
        deps.forEach((dep) => expect(allowedDeps).toContain(dep));
      }
    });
  });
});
