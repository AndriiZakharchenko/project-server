import { Document } from 'mongoose';

export interface IUser {
  id: string,
  name: string,
  email: string,
  password: string,
}

export type IUserModel = IUser & Document;

export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
}

export type IProductModel = IProduct & Document;

export interface ICart {
  cart: {
    id: string;
    items: {
      product: IProduct,
      count: number;
    }[];
  },
  total: number;
}

export type ICartModel = ICart & Document;

export interface IOrder {
  id: string,
  userId: string;
  cartId: string;
  items: IProduct[];
  payment: {
    type: string;
    address: string;
    creditCard: string;
  };
  delivery: {
    type: string;
    address: string;
  };
  comments: string;
  status: 'created' | 'completed';
  total: number;
}

export type IOrderModel = IOrder & Document;

export interface ICartItem {
  productId: string;
  count: number;
}

export interface ICartResponse {
  data: ICart;
  error: { message: string } | null;
}
