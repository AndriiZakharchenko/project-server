// import { ERROR_MESSAGES } from '../constants';
// import { ICartResponse } from '../types';
// import { CartService } from './cart.service';
//
// export class OrderService {
//   static async createOrder(userId: string) {
//     try {
//       const { data } = await CartService.getCart(userId) as ICartResponse;
//
//       if (data.cart.items.length === 0) {
//         return { data: null, error: { message: ERROR_MESSAGES[400].EMPTY_CART } };
//       }
//
//       const order = {
//         userId,
//         cartId: data.cart.id,
//         items: data.cart.items,
//         payment: {
//           type: 'credit card',
//           address: '1234 Main Street',
//           creditCard: '1234-1234-1234-1234',
//         },
//         delivery: {
//           type: 'express',
//           address: '1234 Main Street',
//         },
//         comments: 'Please deliver between 9am and 5pm',
//         status: 'created',
//         total: data.total,
//       };
//
//       return {
//         data: { order },
//         error: null,
//       };
//     } catch (error) {
//       return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
//     }
//   }
// }
