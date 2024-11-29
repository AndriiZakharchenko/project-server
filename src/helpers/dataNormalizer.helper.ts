import { Collection } from '@mikro-orm/core';
import { ICart, ICartItem, ICartResponse } from '../types';
import { CartItems } from '../entities';

export function normalizeItems(items: Collection<CartItems>): ICartItem[] {
  if (!items || JSON.stringify(items) === '[]') {
    return [];
  }

  return items.map((item) => ({
    count: item.count,
    product: item.product,
  }));
}

export function normalizeCart(data: ICartResponse): ICart {
  return {
    cart: {
      id: data.id,
      items: normalizeItems(data.items),
    },
    total: data.total,
  };
}
