export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RouteAccess = {
  [K in HttpMethod]?: string[]; // ? to not require all methods
};

export const ACCESS_MAP: Record<string, RouteAccess> = {
  '/api/products': {
    GET: ['admin', 'viewer'],
    POST: ['admin'],
    PUT: ['admin'],
    DELETE: ['admin'],
  },
  '/api/tracks': {
    GET: ['admin', 'viewer'],
    POST: ['admin'],
  },
  '/api/profile/cart': {
    GET: ['admin', 'viewer'],
    PUT: ['admin', 'viewer'],
    DELETE: ['admin', 'viewer'],
  },
  '/api/auth/login': {
    POST: ['*'],
  },
  '/api/auth/register': {
    POST: ['*'],
  },
};
