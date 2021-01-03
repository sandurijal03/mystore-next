import initDB from '../../helpers/initDB';
import User from '../../models/User';
import Cart from '../../models/Cart';
import bcrypt from 'bcryptjs';

initDB();

export default async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(422).json({ error: 'Please add all the fields' });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(422)
        .json({ error: 'User already exist with that email' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();
    await new Cart({
      user: newUser._id,
    }).save();

    res.status(201).json({ message: 'User created  successfully.' });
  } catch (err) {
    console.log(err);
  }
};
