import { exportCsvToTxt } from './task-3-export-csv-to-txt';

export { EventEmitter } from './task-1-event-emitter';
export { WithTime } from './task-2-with-time';

exportCsvToTxt('src/assets/books.csv', 'src/assets/books.txt').then(() => {});
