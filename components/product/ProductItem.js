import Link from 'next/link';
import { useContext } from 'react';

import { DataContext } from '~/store/GlobalState';
import { addToCart } from '~/store/Actions';

function ProductItem({ product, handleCheck }) {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;

  const userLink = () => (
    <>
      <Link href={`/product/${product._id}`}>
        <a className="col btn btn-info ">View</a>
      </Link>
      <button
        className="col btn btn-success ms-2"
        disabled={product.inStock === 0}
        onClick={() => dispatch(addToCart(product, cart))}
      >
        Buy
      </button>
    </>
  );

  const adminLink = () => (
    <>
      <Link href={`/product/${product._id}`}>
        <a className="col btn btn-info ">View</a>
      </Link>
      <Link href={`create/${product._id}`}>
        <a className="col btn btn-success mx-2">Edit</a>
      </Link>
      <button
        className="col btn btn-danger"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={() =>
          dispatch({
            type: 'ADD_MODAL',
            payload: [{
              data: '',
              id: product._id,
              title: product.title,
              type: 'DELETE_PRODUCT',
            }],
          })
        }
      >
        Delete
      </button>
    </>
  );

  return (
    <div className="card" style={{ width: '18rem' }}>
      {auth.user && auth.user.role === 'admin' && (
        <input
          type="checkbox"
          checked={product.checked}
          onChange={() =>{}}
          className="position-absolute"
          style={{ height: '20px', width: '20px' }}
          onClick={() => handleCheck(product._id)}
        />
      )}
      <img
        src={product.images[0].url}
        className="card-img-top"
        alt={product.images[0].url}
      />
      <div className="card-body">
        <h5 className="card-title text-capitalize" title={product.title}>
          {product.title}
        </h5>

        <div className="row justify-content-between">
          <h6 className="col text-danger">${product.price}</h6>
          {product.inStock > 0 ? (
            <h6 className="col text-danger">In Stock: {product.inStock}</h6>
          ) : (
            <h6 className="col text-danger">Out Stock</h6>
          )}
        </div>

        <p className="card-text" title={product.description}>
          {product.description}
        </p>
        <div className="row justify-content-between mx-1">
          {!auth.user || auth.user.role !== 'admin' ? userLink() : adminLink()}
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
