import { EventEmitter } from './task-1-event-emitter'; // Make sure EventEmitter is imported correctly

export type AsyncFunction = (url: string, ...cbArgs: any[]) => void;

/**
 * Class that manages the execution of asynchronous operations.
 * @extends EventEmitter
 */
export class WithTime extends EventEmitter {
  execute(asyncFunc: AsyncFunction, url: string): void {
    const timerLabel = 'Execution Time';
    console.time(timerLabel);
    this.emit('begin');

    asyncFunc(url, (error: Error | null, data?: any) => {
      if (error) {
        this.emit('error', error);
      } else {
        this.emit('data', data);
      }

      this.emit('end');
      console.timeEnd(timerLabel); // End the timer here, after async operation completes
    });
  }
}
