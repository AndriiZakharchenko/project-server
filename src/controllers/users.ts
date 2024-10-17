import { v4 as uuidv4 } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http';
import { bodyParser, findUserById } from '../helpers';
import { db, User } from '../models/user';

export async function getUsers(request: IncomingMessage, response: ServerResponse) {
  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=3600',
  });
  response.end(
    JSON.stringify({
      data: db.map((user) => ({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        links: {
          self: `/api/users/${user.id}`,
          hobbies: `/api/users/${user.id}/hobbies`,
        },
      })),
      error: null,
    }),
  );
}

export async function createNewUser(request: IncomingMessage, response: ServerResponse) {
  try {
    const { name, email } = await bodyParser(request);
    if (!name || !email) {
      response.writeHead(400, { 'Content-type': 'application/json' });
      response.end(JSON.stringify({ data: null, error: 'Invalid body data was provided' }));
      return;
    }

    const newUser: User = {
      id: uuidv4(), name, email, hobbies: [],
    };
    db.push(newUser);
    response.writeHead(201, { 'Content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
          links: {
            self: `/api/users/${newUser.id}`,
            hobbies: `/api/users/${newUser.id}/hobbies`,
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

export async function deleteUser(request: IncomingMessage, response: ServerResponse) {
  // (.+)$ - захоплює будь-які символи, що йдуть після '/users/' і тривають до кінця рядка.
  // const [, id] = (request.url && request.url.match(/^\/api\/users\/([\w-]+)$/)) || [];
  const id = request.url?.split('/')[3] as string;
  const userIndex = findUserById(id);

  if (userIndex === -1) {
    response.writeHead(404, { 'Content-type': 'application/json' });
    response.end(JSON.stringify({ data: null, error: `User with id ${id} doesn't exist` }));
    return;
  }

  db.splice(userIndex, 1);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ data: { success: true }, error: null }));
}
