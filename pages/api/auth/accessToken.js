import jwt from 'jsonwebtoken';

import Users from '~/models/userModel';
import connectDB from '~/utils/connectDB';
import { createAccessToken } from '~/utils/generateToken';

connectDB();

export default async (req, res) => {
  try {
    const rfToken = req.cookies.refreshToken;
    if (!rfToken) return res.status(400).json({ err: 'Please login now!' });

    const result = jwt.verify(rfToken, process.env.REFRESH_TOKEN_SECRET);
    if (!result)
      return res.status(400).json({ err: 'Your token is incorrect or has expired!' });

    const user = await Users.findById(result.id);
    if (!user) return res.status(400).json({ err: 'User does not exist!' });

    const accessToken = createAccessToken({ id: user._id });
    res.json({
      accessToken,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        root: user.root,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
