import { Collection } from '@mikro-orm/core';
import { Request } from 'express';
import { UploadedFile } from 'express-fileupload';
import { CartItems } from '../entities';
import { CART_ACTION } from '../constants';

export interface IUser {
  id?: string,
  role: string,
  email: string,
  password: string,
}

export interface ICustomRequest extends Request {
  user?: Omit<IUser, 'password'>;
}

export interface IProduct {
  id?: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
}

export interface IProductRaw {
  title: string;
  description: string;
  price: number;
  image_url: UploadedFile;
}

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

export interface ICartProps {
  productId: string;
  count: number;
}

export interface ICartItem {
  count: number;
  product: IProduct;
}

export interface ICartResponse {
  id: string;
  items: Collection<CartItems>;
  total: number;
}

export type CartActionType = typeof CART_ACTION[keyof typeof CART_ACTION];

export interface ICartAction {
  cartId: string;
  productId: string;
  count: number;
  type: CartActionType;
}
