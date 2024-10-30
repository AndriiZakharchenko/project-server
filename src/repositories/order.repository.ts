import OrderModel from '../models/order.model';

export class OrderRepository {
  static async createOrder(userId: string) {
    try {
      const data = await OrderModel.find({ userId });

      if (!data || JSON.stringify(data) === '[]') {
        const newCart = new OrderModel({
          userId,
          items: [],
          payment: {
            type: 'credit card',
            address: '123 Main St, Example City',
            creditCard: '4111111111111111',
          },
          delivery: {
            type: 'standard',
            address: '123 Main St, Example City',
          },
          comments: 'Please deliver between 9am and 5pm.',
          status: 'created',
          total: 0,
        });

        await newCart.save();
        return newCart;
      }

      return data;
    } catch (error) {
      return error;
    }
  }
}
