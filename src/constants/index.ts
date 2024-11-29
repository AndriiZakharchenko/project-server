export const ERROR_MESSAGES = {
  400: {
    BAD_REQUEST: 'Bad request',
    INVALID_PRODUCT: 'Products are not valid',
    EMPTY_CART: 'Cart is empty',
  },
  401: {
    UNAUTHORIZED: 'Unauthorized',
  },
  404: {
    PRODUCT_NOT_FOUND: 'Product was not found',
    CART_NOT_FOUND: 'Cart was not found',
    USER_NOT_FOUND: 'User was not found',
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
