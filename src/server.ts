import express from 'express';

import productRouter from './routes/api/products/product.router';
import cartRouter from './routes/api/profile/cart/cart.router';

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use('/api/products', productRouter);
app.use('/api/profile/cart', cartRouter);

app.all('*', (req, res) => {
  res.status(404);
  res.json({ message: '404 - Not Found.' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
