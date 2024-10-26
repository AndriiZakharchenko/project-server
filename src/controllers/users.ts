import { v4 as uuidv4 } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http';
import { bodyParser, findUserById, sendErrorResponse } from '../helpers';
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
  let data = [];

  try {
    data = await bodyParser(request);

    if (!data.name || !data.email) {
      throw new Error('Name and email are required');
    }
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    sendErrorResponse(response, 400, errorMessage);
    return;
  }

  const { name, email } = data;

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
}

export async function deleteUser(request: IncomingMessage, response: ServerResponse) {
  // (.+)$ - захоплює будь-які символи, що йдуть після '/users/' і тривають до кінця рядка.
  // const [, id] = (request.url && request.url.match(/^\/api\/users\/([\w-]+)$/)) || [];
  const id = request.url?.split('/')[3] as string;
  const userIndex = findUserById(id);

  if (userIndex === -1) {
    sendErrorResponse(response, 404, `User with id ${id} doesn't exist`);
    return;
  }

  db.splice(userIndex, 1);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ data: { success: true }, error: null }));
}
