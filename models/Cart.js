import { Schema, model, models } from 'mongoose';

const {
  Types: { ObjectId },
} = Schema;

const cartSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
  },
  products: [
    {
      quantity: {
        type: Number,
        default: 1,
      },
      product: {
        type: ObjectId,
        ref: 'Product',
      },
    },
  ],
});

export default models.Cart || model('Cart', cartSchema);
