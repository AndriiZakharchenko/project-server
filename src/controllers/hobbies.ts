import { IncomingMessage, ServerResponse } from 'http';
import { bodyParser, findUserById } from '../helpers';
import { db } from '../models/user';

export async function getHobbies(request: IncomingMessage, response: ServerResponse) {
  const id = request.url?.split('/')[3] as string;
  const userIndex = findUserById(id);

  if (userIndex === -1) {
    response.writeHead(404, { 'Content-type': 'application/json' });
    response.end(JSON.stringify({ data: null, error: `User with id ${id} doesn't exist` }));
    return;
  }

  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(
    JSON.stringify({
      data: {
        hobbies: db[userIndex].hobbies,
        links: {
          self: `/api/users/${db[userIndex].id}/hobbies`,
          user: `/api/users/${db[userIndex].id}`,
        },
      },
      error: null,
    }),
  );
}

export async function patchHobbies(request: IncomingMessage, response: ServerResponse) {
  const id = request.url?.split('/')[3] as string;
  const userIndex = findUserById(id);

  if (userIndex === -1) {
    response.writeHead(404, { 'Content-type': 'application/json' });
    response.end(JSON.stringify({ data: null, error: `User with id ${id} doesn't exist` }));
    return;
  }

  try {
    const { hobbies } = await bodyParser(request);

    if (!hobbies) {
      response.writeHead(400, { 'Content-type': 'application/json' });
      response.end(JSON.stringify({ data: null, error: 'Invalid body data was provided' }));
      return;
    }

    db[userIndex].hobbies = Array.from(new Set([...db[userIndex].hobbies, ...hobbies]));
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        data: {
          user: {
            id: db[userIndex].id,
            name: db[userIndex].name,
            email: db[userIndex].email,
          },
          links: {
            self: `/api/users/${db[userIndex].id}`,
            hobbies: `/api/users/${db[userIndex].id}/hobbies`,
          },
        },
        error: null,
      }),
    );
  } catch {
    response.writeHead(400, { 'Content-type': 'application/json' });
    response.end(JSON.stringify({ data: null, error: 'Invalid body data was provided' }));
  }
}
