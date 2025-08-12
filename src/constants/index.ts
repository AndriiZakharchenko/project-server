export const SUCCESS_MESSAGES = {
  201: {
    USER_CREATED: 'User registered successfully.',
  },
};

export const ERROR_MESSAGES = {
  400: {
    BAD_REQUEST: 'Invalid request.',
    INVALID_PRODUCT: 'Invalid product(s) specified.',
    EMPTY_CART: 'The cart is empty.',
    INVALID_DATA: 'Required fields are missing or invalid.',
    INVALID_CREDENTIALS: 'Incorrect email or password.',
  },
  401: {
    UNAUTHORIZED: 'Authentication required.',
    TOKEN_REQUIRED: 'Access token is missing.',
  },
  403: {
    FORBIDDEN: 'Access denied.',
    INVALID_TOKEN: 'Invalid or expired access token.',
  },
  404: {
    PRODUCT_NOT_FOUND: 'Product not found.',
    CART_NOT_FOUND: 'Cart not found.',
    USER_NOT_FOUND: 'User not found.',
    ROUTE_NOT_FOUND: 'Endpoint not found.',
  },
  409: {
    USER_FOUND: 'User already exists. Please log in.',
  },
  500: {
    SERVER_ERROR: 'An unexpected server error occurred.',
  },
};

export const CART_ACTION = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  REMOVE: 'REMOVE',
};
