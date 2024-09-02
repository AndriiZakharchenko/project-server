import { CartItemEntity } from './cart.entity';

type ORDER_STATUS = 'created' | 'completed';

export interface OrderEntity {
  id: string, // uuid
  userId: string;
  cartId: string;
  items: CartItemEntity[] // products from CartEntity
  status: ORDER_STATUS;
  total: number;
}

// const order: OrderEntity = {
//   id: 'dffd6fa8-be6b-47f6-acff-455612620ac2',
//   userId: '0fe36d16-49bc-4aab-a227-f84df899a6cb',
//   cartId: '',
//   items: cart.items,
//   status: 'created',
//   total: 2,
// };
