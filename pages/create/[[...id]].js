import Head from 'next/head';
import Image from 'next/image';
import { useState, useContext, useEffect } from 'react';
import { DataContext } from '~/store/GlobalState';
import { getData, postData, putData } from '~/utils/fetchData';
import {imageUpload} from '~/utils';
import { useRouter } from 'next/router';

function ProductsManager() {
  const initialState = {
    title: '',
    price: 0,
    inStock: 0,
    description: '',
    content: '',
    category: '',
  };

  const [product, setProduct] = useState(initialState);
  const { title, price, inStock, description, content, category } = product;

  const [images, setImages] = useState([]);

  const { state, dispatch } = useContext(DataContext);
  const { categories, auth } = state;

  const router = useRouter();
  const { id } = router.query;
  const [onEdit, setOnEdit] = useState(false);

  useEffect(() => {
    if (id) {
      setOnEdit(true);
      getData(`product/${id}`).then((res) => {
        setProduct(res.product);
        setImages(res.product.images);
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages([]);
    }
  }, [id]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  const handleUploadInput = (e) => {
    dispatch({ type: 'NOTIFY', payload: {} });
    let newImages = [];
    let num = 0;
    let err = '';
    const files = [...e.target.files];
    
    if (files.length === 0)
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'Files dose not exist.' },
      });
    files.forEach((file) => {
      if (file.size > 1024 * 1024)
        return (err = 'The largest image size is 1mb');

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return (err = 'Image format is incorrect');

      num += 1;
      if (num <= 5) newImages.push(file);
      return newImages;
    });

    if (err) dispatch({ type: 'NOTIFY', payload: { error: err } });

    const imgCount = images.length;
    if (imgCount + newImages.length > 5)
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'Select up to 5 images' },
      });
    setImages([...images, ...newImages]);
  };

  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.user.role !== 'admin')
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'Authentication is not valid.' },
      });

    if (
      !title ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      category == 'all' ||
      images.length === 0
    )
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'Please add all the fields.' },
      });

    dispatch({ type: 'NOTIFY', payload: { loading: true } });
    let media = [];
    const imgNewURL = images.filter((img) => !img.url);
    const imgOldURL = images.filter((img) => img.url);

    if (imgNewURL.length > 0) media = await imageUpload(imgNewURL);

    let res;
    if (onEdit) {
      res = await putData(
        `product/${id}`,
        {
          ...product,
          images: [...imgOldURL, ...media],
        },
        auth.token,
      );
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
    } else {
      res = await postData(
        'product',
        {
          ...product,
          images: [...imgOldURL, ...media],
        },
        auth.token,
      );
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
    }
    setProduct(initialState)
    setImages([])
    return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
  };

  

  return (
    <div className="products_manager">
      <Head>
        <title>Products Manager</title>
      </Head>

      <form className="row" onSubmit={handleSubmit}>
        <div className="col-md col-sm-12 col-12">
          <input
            className="d-block my-4 w-100 p-2"
            type="text"
            name="title"
            value={title}
            placeholder="Title"
            onChange={handleChangeInput}
          />

          <div className="row">
            <div className="col-sm-12">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                className="d-block my-2 w-100 p-2"
                type="number"
                name="price"
                value={price}
                placeholder="Price"
                onChange={handleChangeInput}
              />
            </div>

            <div className="col-sm-12">
              <label htmlFor="inStock" className="form-label">
                In Stock
              </label>
              <input
                className="d-block my-2 w-100 p-2"
                type="number"
                name="inStock"
                value={inStock}
                placeholder="InStock"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <textarea
            className="d-block my-4 w-100 p-2"
            name="description"
            id="description"
            value={description}
            placeholder="Description"
            cols="30"
            rows="5"
            onChange={handleChangeInput}
          ></textarea>

          <textarea
            className="d-block my-4 w-100 p-2"
            name="content"
            id="content"
            value={content}
            placeholder="Content"
            cols="30"
            rows="6"
            onChange={handleChangeInput}
          ></textarea>

          <div className="input-group px-0 my-2">
            <select
              className="form-select text-capitalize"
              name="category"
              id="category"
              value={category}
              onChange={handleChangeInput}
            >
              <option value="all">All Products</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-info my-2 px-4">
            {onEdit ? 'Update' : 'Create'}
          </button>
        </div>

        <div className="col-md col-sm-12 col-12 my-4">
          <div className="input-group mb-3">
            <label
              className="input-group-text"
              htmlFor="img-upload"
              style={{ cursor: 'pointer' }}
            >
              Upload
            </label>
            <div className="border rounded-end">
              <input
                type="file"
                className="custom-file-input form-control"
                name=""
                id="img-upload"
                onChange={handleUploadInput}
                multiple
                accept="image/*"
              />
            </div>

            {images.length > 0 && (
              <button
                className="btn btn-danger ms-3"
                onClick={() => setImages([])}
              >
                Delete all images
              </button>
            )}
          </div>

          <div className="row img-up mx-0">
            {images.map((img, index) => (
              <div key={index} className="file_img img-thumbnail rounded m-2">
                <Image
                  src={img.url ? img.url : URL.createObjectURL(img)}
                  alt=""
                  layout="fill"
                />
                <span
                  className="file_img_btn"
                  onClick={() => deleteImage(index)}
                >
                  X
                </span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductsManager;
