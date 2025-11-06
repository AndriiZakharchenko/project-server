export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RouteAccess = {
  [K in HttpMethod]?: string[]; // Array of roles allowed to access the route with the given method
};

export const ACCESS_MAP: Record<string, RouteAccess> = {
  '/products': {
    GET: ['admin', 'viewer'],
    POST: ['admin'],
    PUT: ['admin'],
    DELETE: ['admin'],
  },
  '/tracks': {
    GET: ['admin', 'viewer'],
    POST: ['admin'],
  },
  '/profile/cart': {
    GET: ['admin', 'viewer'],
    PUT: ['admin', 'viewer'],
    DELETE: ['admin', 'viewer'],
  },
  '/auth/login': {
    POST: ['*'],
  },
  '/auth/register': {
    POST: ['*'],
  },
};
