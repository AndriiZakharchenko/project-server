const csv = require('csvtojson');
import fs from 'fs';

/**
 * Exports a CSV file to a TXT file.
 * CSV format:
 *  Book;Author;Amount;Price
 *  The Compound Effect;Darren Hardy;5;9,48
 * TXT format: {"book":"The Compound Effect","author":"Darren Hardy","price":9.48}
 * @param {string} csvPath - The path to the source CSV file.
 * @param {string} txtPath - The path to the destination TXT file.
 * @returns {Promise<boolean>} - A promise that resolves to true when export is done.
 */
export const exportCsvToTxt = (csvPath: string, txtPath: string): Promise<boolean> => {
  const readableStream = fs.createReadStream(csvPath);
  const writableStream = fs.createWriteStream(txtPath);

  return new Promise((resolve, reject) => {
    readableStream
      .pipe(csv({
        delimiter: ';'
      }))
      .on('data', (chunk: Buffer) => {
        writableStream.write(chunk.toString('utf-8'));
      })
      .on('end', () => {
        console.log('Operation csv to txt successfully finished!');
        // @ts-ignore
        resolve();
      })
      .on('error', (error: any) => {
        console.log('Operation csv to txt failed!', error);
        reject(error);
      })
      .then(() => {});
  })
};

