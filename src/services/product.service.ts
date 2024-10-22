import { getAllProductsRepository, getProductRepository } from '../repositories/product.repository';

export const getAllProductsService = async () => getAllProductsRepository();

export const getProductService = async (id: string) => getProductRepository(id);
