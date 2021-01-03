import { Schema, model, models } from 'mongoose';

const {
  Types: { ObjectId },
} = Schema;

const orderSchema = new Schema(
  {
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
    email: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default models.Order || model('Order', orderSchema);
