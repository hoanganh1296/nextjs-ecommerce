import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import CartItem from '~/components/CartItem';
import { DataContext } from '~/store/GlobalState';
import { getData, postData } from '~/utils';

function Cart() {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth, orders } = state;

  const [total, setTotal] = useState(0);

  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState(0);
  const [callback, setCallback] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce(
        (prev, item) => prev + item.price * item.quantity,
        0,
      );

      setTotal(res);
    };

    getTotal();
  }, [cart]);

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem('__next__cart01__'));
    if (cartLocal && cartLocal.length > 0) {
      const newArr = [];
      const updateCart = async () => {
        for (const item of cartLocal) {
          const res = await getData(`product/${item._id}`);
          const { _id, title, images, price, inStock, sold } = res.product;
          if (inStock > 0) {
            newArr.push({
              _id,
              title,
              images,
              price,
              inStock,
              sold,
              quantity: item.quantity > inStock ? 1 : item.quantity,
            });
          }
        }
        dispatch({ type: 'ADD_CART', payload: newArr });
      };
      updateCart();
    }
  }, [callback]);

  const handleOrder = async () => {
    if (!address || !mobile)
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'Please add your address and mobile' },
      });
    let newCart = [];
    for (const item of cart) {
      const res = await getData(`product/${item._id}`);
      if (res.product.inStock - item.quantity >= 0) {
        newCart.push(item);
      }
    }

    if (newCart.length < cart.length) {
      setCallback(!callback);
      dispatch({
        type: 'NOTIFY',
        payload: {
          error: 'The product is out of stock or the quantity is insufficient',
        },
      });
    }

    dispatch({
      type: 'NOTIFY',
      payload: {
        loading: true,
      },
    });

    postData('order', { address, mobile, cart, total }, auth.token).then(
      (res) => {
        if (res.err)
          return dispatch({
            type: 'NOTIFY',
            payload: { error: res.err },
          });
        dispatch({ type: 'ADD_CART', payload: [] });

        const newOrder = {
          ...res.newOrder,
          user: auth.user,
        };

        dispatch({
          type: 'ADD_ORDERS',
          payload: [...orders, newOrder],
        });
        dispatch({
          type: 'NOTIFY',
          payload: { success: res.msg },
        });
        return router.push(`/order/${res.newOrder._id}`);
      },
    );
  };

  if (cart.length === 0)
    return (
      <img
        className="img-fluid mx-auto d-block"
        src="/empty-cart.png"
        alt="empty-cart"
      />
    );
  return (
    <div className="row" style={{height:"500px"}}>
      <Head>
        <title>Cart Page</title>
      </Head>

      <div className="col-md-8 text-secondary table-responsive">
        <h2 className="text-uppercase">Shopping Cart</h2>

        <table className="table my-3">
          <tbody>
            {cart.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                dispatch={dispatch}
                cart={cart}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="col-md-4 my-3 text-end text-uppercase text-secondary">
        <form>
          <h2>Shipping</h2>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-control mb-2"
          />
          <label htmlFor="mobile">Mobile</label>
          <input
            type="text"
            name="mobile"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="form-control mb-2"
          />
        </form>
        <h3>
          Total: <span className="text-info">${total}</span>
        </h3>

        <Link href={auth.user ? '#!' : '/signin'}>
          <a className="btn btn-dark my-2" onClick={handleOrder}>
            Proceed with payment
          </a>
        </Link>
      </div>
    </div>
  );
}

export default Cart;
