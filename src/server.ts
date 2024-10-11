import http, { IncomingMessage } from 'http';

const db = [
  {
    id: '5f3b4b29-03dd-4ed9-84a3-6dfcfz4c2be98',
    name: 'John Doe',
    email: 'johndoe@example.com',
  },
];

async function bodyParser(request: IncomingMessage): Promise<void> {
  return new Promise((resolve, reject) => {
    let totalChunked = '';

    request
      .on('error', (err) => {
        console.error(err);
        reject(err);
      })
      .on('data', (chunk) => {
        totalChunked += chunk;
      })
      .on('end', () => {
        try {
          // @ts-ignore
          request.body = JSON.parse(totalChunked);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
  });
}

async function createNewUser(request: any, response: any) {
  try {
    await bodyParser(request);
    db.push(request.body);
    response.writeHead(201, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(db));
    response.end();
  } catch (err) {
    response.writeHead(400, { 'Content-type': 'text/plain' });
    response.write('Invalid body data was provided');
    response.end();
  }
}

const server = http.createServer((request, response) => {
  const { url } = request;
  const { method } = request;

  switch (method) {
    case 'POST':
      if (url === '/api/users') {
        createNewUser(request, response).then(() => {});
      }
      break;

    default:
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.write('Endpoint was not found.');
      response.end();
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
