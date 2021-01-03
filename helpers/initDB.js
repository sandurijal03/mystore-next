import mongoose from 'mongoose';

const initDB = () => {
  if (mongoose.connections[0].readyState) {
    console.log('already connected');
    return;
  }
  mongoose
    .connect('mongodb://localhost:27017/ecommerce-next', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err));
};

export default initDB;
