import http, { IncomingMessage, ServerResponse } from 'http';
import { router } from './routes';

const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
  router(request, response);
});

server.listen(8000, () => {
  console.log('Server is running on port 8000');
});
