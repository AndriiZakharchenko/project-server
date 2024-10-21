import { IncomingMessage, ServerResponse } from 'http';
import { db } from '../models/user';

// Helper function to parse the body
export async function bodyParser(request: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let totalChunked = '';

    request
      .on('error', reject)
      .on('data', (chunk) => {
        totalChunked += chunk;
      })
      .on('end', () => {
        try {
          resolve(JSON.parse(totalChunked));
        } catch (error) {
          reject(error);
        }
      });
  });
}

export const findUserById = (id: string) => db.findIndex((user) => user.id === id);

export function sendErrorResponse(response: ServerResponse, statusCode: number, message: string) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ data: null, error: message }));
}
