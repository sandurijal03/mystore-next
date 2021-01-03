import Stripe from 'stripe';
import { v4 } from 'uuid';
import Cart from '../../models/Cart';
import jwt from 'jsonwebtoken';
import Order from '../../models/Order';
import initDB from '../../helpers/initDB';

initDB();

const stripe = Stripe(process.env.STRIPE_SECRET);
export default async (req, res) => {
  const { paymentInfo } = req.body;
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
    const cart = await Cart.findOne({ user: userId }).populate(
      'products.product',
    );
    let price = 0;
    cart.products.forEach((item) => {
      price = price + item.quantity * item.product.price;
    });
    const prevCustomer = await stripe.customers.list({
      email: paymentInfo.email,
    });

    const isExistingCustomer = prevCustomer.data.length > 0;

    let newCustomer;

    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentInfo.email,
        source: paymentInfo.id,
      });
    }

    await stripe.charges.create(
      {
        currency: 'NPR',
        amount: price * 100,
        receipt_email: paymentInfo.email,
        customer: isExistingCustomer ? prevCustomer.data[0].id : newCustomer.id,
        description: `you purchasd a product ${paymentInfo.email}`,
      },
      {
        idempotencyKey: v4(),
      },
    );

    await new Order({
      user: userId,
      email: paymentInfo.email,
      total: price,
      products: cart.products,
    }).save();

    await Cart.findOneAndUpdate(
      {
        _id: cart._id,
      },
      {
        $set: {
          products: [],
        },
      },
    );

    res.status(200).json({ message: 'payment was successful' });
  } catch (err) {
    return res.status(401).json({ error: 'error processing payment' });
  }
};
