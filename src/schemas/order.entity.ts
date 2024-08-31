import { CartItemEntity } from './cart.entity';

type ORDER_STATUS = 'created' | 'completed';

export interface OrderEntity {
  id: string, // uuid
  userId: string;
  cartId: string;
  items: CartItemEntity[] // products from CartEntity
  payment: {
    type: string,
    address?: string,
    creditCard?: string,
  },
  delivery: {
    type: string,
    address: string,
  },
  comments: string,
  status: ORDER_STATUS;
  total: number;
}

// const order: OrderEntity = {
//   id: 'dffd6fa8-be6b-47f6-acff-455612620ac2',
//   userId: '0fe36d16-49bc-4aab-a227-f84df899a6cb',
//   cartId: '',
//   items: cart.items,
//   payment: {
//     type: 'paypal',
//     address: 'Payment address',
//     creditCard: '12234567890',
//   },
//   delivery: {
//     type: 'post',
//     address: 'Delivery address',
//   },
//   comments: '',
//   status: 'created',
//   total: 2,
// };
