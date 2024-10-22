import { products } from '../data/products';

export const getAllProductsRepository = () => {
  // Simulating data fetching from a database
  return products;
};

export const getProductRepository = (productId: string) => {
  return products.find((product) => product.id === productId);
};
