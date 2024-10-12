import { IncomingMessage, ServerResponse } from 'http';
import { getUsers, createNewUser, deleteUser } from '../controllers/users';
import { getHobbies, patchHobbies } from '../controllers/hobbies';

// eslint-disable-next-line consistent-return
export function router(request: IncomingMessage, response: ServerResponse) {
  const { url, method } = request;

  switch (method) {
    case 'GET':
      if (url === '/api/users') {
        return getUsers(request, response);
      }

      if (/^\/api\/users\/\w+\/hobbies$/.test(url || '')) {
        return getHobbies(request, response);
      }
      break;

    case 'POST':
      if (url === '/api/users') {
        return createNewUser(request, response);
      }
      break;

    case 'DELETE':
      if (/^\/api\/users\/\w+$/.test(url || '')) {
        return deleteUser(request, response);
      }
      break;

    case 'PATCH':
      if (/^\/api\/users\/\w+\/hobbies$/.test(url || '')) {
        return patchHobbies(request, response);
      }
      break;

    default:
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.end('Invalid URL or Method');
  }
}
