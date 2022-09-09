import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    root: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dcnxg5hjv/image/upload/v1656058725/samples/user_mc0n27.jpg',
    },
  },
  {
    timestamps: true,
  },
);

const Dataset = mongoose.models.user || mongoose.model('user', userSchema);

export default Dataset;
