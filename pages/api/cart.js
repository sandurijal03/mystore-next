import Cart from '../../models/Cart';
import initDB from '../../helpers/initDB';
import Authenticated from '../../helpers/authenticated';

initDB();

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      await fetchUserCart(req, res);
      break;
    case 'PUT':
      await addProduct(req, res);
      break;
    case 'DELETE':
      await removeProduct(req, res);
      break;
  }
};

const fetchUserCart = Authenticated(async (req, res) => {
  const cart = await Cart.findOne({ user: req.userId }).populate(
    'products.product',
  );
  res.status(200).json(cart.products);
});

const addProduct = Authenticated(async (req, res) => {
  const { quantity, productId } = req.body;
  const cart = await Cart.findOne({ user: req.userId });
  const productExists = cart.products.some(
    (productDoc) => productId === productDoc.product.toString(),
  );
  if (productExists) {
    await Cart.findOneAndUpdate(
      { _id: cart._id, 'products.product': productId },
      {
        $inc: { 'products.$.quantity': quantity },
      },
    );
  } else {
    const newProduct = { quantity, product: productId };
    await Cart.findOneAndUpdate(
      { _id: cart._id },
      { $push: { products: newProduct } },
    );
  }
  res.status(200).json({ message: 'product added to cart' });
});

const removeProduct = Authenticated(async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOneAndUpdate(
    { user: req.userId },
    {
      $pull: { products: { product: productId } },
    },
    {
      new: true,
    },
  ).populate('products.product');

  res.status(200).json(cart.products);
});
