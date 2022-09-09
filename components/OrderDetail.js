import Image from 'next/image';
import Link from 'next/link';
import PaypalBtn from './paypalBtn';
import { patchData } from '~/utils';
import { updateItem } from '~/store/Actions';

function OrderDetail({ orderDetail, state, dispatch }) {
  const { auth, orders } = state;

  const formatDate = (date) => {
    if (!date) return;
    const now = new Date(date);
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    const dateLocal = new Date(now.getTime() - offsetMs);
    const newDate = dateLocal
      .toISOString()
      .slice(0, 19)
      .replace(/-/g, '/')
      .replace('T', ' ');
    return newDate;
  };

  const handleDelivered = (order) => {
    dispatch({ type: 'NOTIFY', payload: { loading: true } });
    patchData(`order/delivered/${order._id}`, null, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      const { paid, dateOfPayment, method, delivered } = res.result;
      dispatch(
        updateItem(
          orders,
          order._id,
          {
            ...order,
            paid,
            dateOfPayment,
            method,
            delivered,
          },
          'ADD_ORDERS',
        ),
      );

      return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    });
  };
  if (!auth.user) return null;
  return (
    <>
      {orderDetail.map((order) => (
        <div
          key={order._id}
          style={{ margin: '20px auto' }}
          className="row justify-content-around"
        >
          <div
            className="col-12 col-md-9 text-uppercase my-3"
            style={{ maxWidth: '600px' }}
          >
            <h2 className="text-break">Order {order._id}</h2>
            <div className="mt-4 text-secondary">
              <h3>Shipping</h3>
              <p>Name: {order.user.name}</p>
              <p>Email: {order.user.email}</p>
              <p>Address: {order.address}</p>
              <p>Mobile: {order.mobile}</p>

              <div
                className={`alert ${
                  order.delivered ? 'alert-success' : 'alert-danger'
                } d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.delivered
                  ? `Deliver on ${formatDate(order.updatedAt)}`
                  : 'Not Delivered'}
                {auth.user.role === 'admin' && !order.delivered && (
                  <button
                    className="btn btn-dark text-uppercase"
                    onClick={() => handleDelivered(order)}
                  >
                    Mark as delivered
                  </button>
                )}
              </div>

              <h3>Payment</h3>
              {order.method && (
                <h5>
                  Method: <em>{order.method}</em>
                </h5>
              )}
              {order.paymentId && (
                <p>
                  PaymentId: <em>{order.paymentId}</em>
                </p>
              )}
              <div
                className={`alert ${
                  order.paid ? 'alert-success' : 'alert-danger'
                } d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.paid
                  ? `Paid on ${formatDate(order.dateOfPayment)}`
                  : 'Not Paid'}
              </div>

              <div>
                <h4>Order Items</h4>
                {order.cart.map((item) => (
                  <div
                    className="row border-bottom mx-0 p-2 justify-content-center align-middle"
                    key={item._id}
                    style={{ maxWidth: '576px' }}
                  >
                    <Image
                      src={item.images[0].url}
                      alt={item.images[0].url}
                      className="col-2"
                      width="50px"
                      height="50px"
                    />

                    <h5 className="col-6  flex-fill text-secondary px-3 m-0">
                      <Link href={`/product/${item._id}`}>
                        <a>{item.title}</a>
                      </Link>
                    </h5>

                    <span className="col-4 text-info m-0">
                      {item.quantity} X ${item.price} = $
                      {item.quantity * item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!order.paid && auth.user.role !== 'admin' && (
            <div className="col-12 col-md-3 p-4">
              <h2 className="my-4 text-uppercase">Total: ${order.total}</h2>
              <PaypalBtn total={order.total} order={order} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export default OrderDetail;
