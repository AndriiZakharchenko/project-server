import { getUserCartRepository } from '../repositories/cart.repository';

export const getUserCartService = async (id: string) => getUserCartRepository(id);
