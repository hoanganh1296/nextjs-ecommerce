import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '~/store/GlobalState';

import OrderDetail from '~/components/OrderDetail';

function DetailOrder() {
  const { state, dispatch } = useContext(DataContext);
  const { orders, auth } = state;

  const router = useRouter();

  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    const newArr = orders.filter((order) => order._id === router.query.id);
    setOrderDetail(newArr);
  }, [orders, router.query.id]);

  if (!auth.user) return null;
  return (
    <div className="my-3">
      <Head>
        <title>Detail Orders</title>
      </Head>
      <div>
        <button className="btn btn-dark" onClick={() => router.back()}>
          <i aria-hidden className="fas fa-long-arrow-alt-left"></i> Go Back
        </button>
      </div>
      <OrderDetail orderDetail={orderDetail} state={state} dispatch={dispatch} />
    </div>
  );
}

export default DetailOrder;
