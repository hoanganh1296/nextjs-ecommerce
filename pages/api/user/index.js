import connectDB from '~/utils/connectDB';
import Users from '~/models/userModel';
import auth from '~/middleware/auth';

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case 'PATCH':
      await uploadInfo(req, res);
      break;
    case 'GET':
      await getUsers(req, res);
      break;
  }
};

const uploadInfo = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { name, avatar } = req.body;

    const newUser = await Users.findOneAndUpdate(
      { _id: result.id },
      { name, avatar },
      { new: true },
    ).select('-password');

    res.json({
      msg: 'Update Success!',
      user: {
        ...newUser._doc,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await auth(req, res);
    if(result.role !== 'admin') return res.status(400).json({err:"Authentication is not valid"})

    const users = await Users.find().select("-password")
    res.json({users})
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}
