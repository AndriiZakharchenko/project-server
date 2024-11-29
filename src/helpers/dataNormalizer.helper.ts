export function normalizeItems(items: any) {
  if (!items || JSON.stringify(items) === '[]') {
    return [];
  }

  return items.map((item: any) => ({
    id: item.id,
    product: item.product,
  }));
}

export function normalizeCart(data: any) {
  return {
    cart: {
      id: data.id,
      items: normalizeItems(data.items),
    },
    total: data.total,
  };
}
