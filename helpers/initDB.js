import mongoose from 'mongoose';

const initDB = () => {
  if (mongoose.connections[0].readyState) {
    console.log('already connected');
    return;
  }
  mongoose
    .connect(`${process.env.MONGO_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err));
};

export default initDB;
