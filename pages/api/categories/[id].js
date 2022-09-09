import connectDB from '~/utils/connectDB';
import Categories from '~/models/categoriesModal';
import Products from '~/models/productModel';
import auth from '~/middleware/auth';

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case 'PUT':
      await updateCategory(req, res);
      break;
    case 'DELETE':
      await deleteCategory(req, res);
      break;
  }
};

const updateCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== 'admin')
      return res.status(401).json({ err: 'Authentication is not valid' });

    const { id } = req.query;
    const { name } = req.body;
    // const category = await Categories.findById({ _id: id });
    // if (!category)
    //   return res.status(400).json({ err: "Category doesn't exist" });
    const newCategory = await Categories.findByIdAndUpdate(
      { _id: id },
      { name },
      { new: true },
    );
    res.json({ mag: 'Success! Updated  a new category', newCategory });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== 'admin')
      return res.status(401).json({ err: 'Authentication is not valid' });

    const { id } = req.query;

    const products = await Products.findOne({ category: id });
    if (products)
      return res.status(400).json({
        err: 'Please delete all products in this category',
      });

    await Categories.findByIdAndDelete({ _id: id });
    res.json({ msg: 'Success! Deleted a new category' });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
