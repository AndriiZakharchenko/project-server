import { IncomingMessage, ServerResponse } from 'http';
import { bodyParser, findUserById, sendErrorResponse } from '../helpers';
import { db } from '../models/user';

export async function getHobbies(request: IncomingMessage, response: ServerResponse) {
  const id = request.url?.split('/')[3] as string;
  const userIndex = findUserById(id);

  if (userIndex === -1) {
    sendErrorResponse(response, 400, `User with id ${id} doesn't exist`);
    return;
  }

  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'private, max-age=3600',
  });
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
    sendErrorResponse(response, 404, `User with id ${id} doesn't exist`);
    return;
  }

  let data = [];

  try {
    data = await bodyParser(request);

    if (!data.hobbies && data.hobbies.length === 0) {
      throw new Error('Invalid body data was provided');
    }
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    sendErrorResponse(response, 400, errorMessage);
    return;
  }

  const { hobbies } = data;

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
}
