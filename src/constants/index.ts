export const ERROR_MESSAGES = {
  201: {
    USER_CREATED: 'User successfully registered',
  },
  400: {
    BAD_REQUEST: 'Bad request',
    INVALID_PRODUCT: 'Products are not valid',
    EMPTY_CART: 'Cart is empty',
    INVALID_DATA: 'All input is required',
    INVALID_CREDENTIALS: 'Invalid Credentials',
  },
  401: {
    UNAUTHORIZED: 'Unauthorized',
    TOKEN_REQUIRED: 'Token is required',
  },
  403: {
    FORBIDDEN: 'Forbidden',
    INVALID_TOKEN: 'Invalid Token',
  },
  404: {
    PRODUCT_NOT_FOUND: 'Product was not found',
    CART_NOT_FOUND: 'Cart was not found',
    USER_NOT_FOUND: 'User was not found',
  },
  409: {
    USER_FOUND: 'User already exist. Please login',
  },
  500: {
    SERVER_ERROR: 'Internal Server error',
  },
};

export const CART_ACTION = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  REMOVE: 'REMOVE',
};
