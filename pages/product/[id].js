import Head from 'next/head';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';

import Slider from '~/components/Slider';
import { addToCart } from '~/store/Actions';
import { DataContext } from '~/store/GlobalState';
import { getData } from '~/utils/fetchData';

function DetailProduct(props) {
  const [product, setProduct] = useState(props.product);
  const [tab, setTab] = useState(0);

  const { state, dispatch } = useContext(DataContext);
  const { cart, related_products } = state;

  const isActive = (index) => {
    if (tab === index) return 'active';
    return '';
  };
  useEffect(() => {
    setProduct(props.product);
  }, [props.product]);

  useEffect(() => {
    if (product._id) {
      getData(`product?limit=${6}
      &category=${product.category}&sort=&title=all`).then((res) => {
        if (res.err)
          return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
        dispatch({
          type: 'ADD_RELATED_PRODUCTS',
          payload: res.products,
        });
      });
    }
  }, [product._id]);

  return (
    <div className="container">
      <div className="row detail_page">
        <Head>
          <title>Detail Product</title>
        </Head>

        <div className="col-md-6">
          <div className="d-block img-thumbnail rounded">
            <Image
              src={product.images[tab].url}
              alt={product.images[tab].url}
              className="d-block img-thumbnail rounded mt-4"
              width={625}
              height={625}
              layout="responsive"
            />
          </div>

          <div className="d-flex mt-2" style={{ cursor: 'pointer' }}>
            {product.images.map((image, index) => (
              <div
                className={`img-thumbnail rounded me-2 ${isActive(index)}`}
                onClick={() => setTab(index)}
                key={index}
              >
                <Image width="80" height="60" src={image.url} alt={image.url} />
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-6 mt-3">
          <h2 className="text-uppercase">{product.title}</h2>
          <h5 className="text-danger">${product.price}</h5>

          <div className="row mx-0 d-flex justify-content-between">
            {product.inStock > 0 ? (
              <h6 className="col text-danger p-0">
                In Stock: {product.inStock}
              </h6>
            ) : (
              <h6 className="text-danger">Out Stock</h6>
            )}

            <h6 className="col text-danger">Sold: {product.sold}</h6>
          </div>

          <div className="my-2">{product.description}</div>
          <div className="my-2">{product.content}</div>

          <button
            type="button"
            className="btn btn-dark d-block my-3 px-5"
            onClick={() => dispatch(addToCart(product, cart))}
          >
            Buy
          </button>
        </div>
      </div>
      <Slider title="Related Products" products={related_products} />
    </div>
  );
}

export async function getServerSideProps({ params: { id } }) {
  const res = await getData(`product/${id}`);
 
  return {
    props: {
      product: res.product,
    }, // will be passed to the page component as props
  };
}

export default DetailProduct;
