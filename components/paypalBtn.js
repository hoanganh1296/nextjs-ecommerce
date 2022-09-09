import { useEffect, useRef, useContext } from 'react';
import { DataContext } from '~/store/GlobalState';
import { patchData } from '~/utils/fetchData';
import { updateItem } from '~/store/Actions';

function PaypalBtn({ order }) {
  const { state, dispatch } = useContext(DataContext);
  const { auth, orders } = state;
  const refPaypalBtn = useRef();

  useEffect(() => {
    paypal
      .Buttons({
        // Sets up the transaction when a payment button is clicked
        createOrder: (data, actions) =>
          actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: order.total, // Can also reference a variable or function
                },
              },
            ],
          }),
        // Finalize the transaction after payer approval
        onApprove: (data, actions) => {
          dispatch({ type: 'NOTIFY', payload: { loading: true } }),
            actions.order.capture().then((details) => {
              patchData(
                `order/payment/${order._id}`,
                {
                  paymentId: details.payer.payer_id,
                },
                auth.token,
              ).then((res) => {
                if (res.err)
                  return dispatch({
                    type: 'NOTIFY',
                    payload: { error: res.err },
                  });

                dispatch(
                  updateItem(
                    orders,
                    order._id,
                    {
                      ...order,
                      paid: true,
                      dateOfPayment: details.create_time,
                      paymentId: details.payer.payer_id,
                      method: 'Paypal',   
                    },
                    'ADD_ORDERS',
                  ),
                );
                return dispatch({
                  type: 'NOTIFY',
                  payload: { success: res.msg },
                });
              });
            });
        },
      })
      .render(refPaypalBtn.current);
  }, []);

  return <div ref={refPaypalBtn} />;
}

export default PaypalBtn;
