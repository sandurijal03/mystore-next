import Authenticated from '../../helpers/authenticated';
import initDB from '../../helpers/initDB';
import Order from '../../models/Order';

initDB();

export default Authenticated(async (req, res) => {
  const orders = await Order.find({ user: req.userId }).populate(
    'products.product',
  );
  res.status(200).json(orders);
});
