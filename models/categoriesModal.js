import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

let Dataset = mongoose.models.categories || mongoose.model('categories', CategorySchema);
export default Dataset;
