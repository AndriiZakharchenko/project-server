export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RouteAccess = {
  [K in HttpMethod]?: string[]; // ? щоб не вимагав усі методи
};

export const ACCESS_MAP: Record<string, RouteAccess> = {
  '/api/products': {
    GET: ['admin', 'viewer'],
    POST: ['admin'],
    PUT: ['admin'],
    DELETE: ['admin'],
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
