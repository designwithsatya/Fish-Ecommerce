import { Container } from '@mui/material';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };

    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };

    default:
      return state;
  }
}
function OrderScreen() {
  const { data: session } = useSession();
  // order/:id
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const { query } = useRouter();
  const orderId = query.id;

  const [{ loading, error, order, successPay, loadingPay, loadingDeliver, successDeliver }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      order: {},
      error: '',
    }
  );
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || successPay || successDeliver || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal');
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successDeliver, successPay]);
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;
  const createOrder = (data, actions) =>
    actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => orderID);

  const onApprove = (data, actions) =>
    actions.order.capture().then(async (details) => {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(`/api/orders/${order._id}/pay`, details);
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid successgully');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });

  const onError = (err) => {
    toast.error(getError(err));
  };

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(`/api/admin/orders/${order._id}/deliver`, {});
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is delivered');
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <Container>
        <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="my-3 rounded-lg bg-red-100 p-3 text-red-700">{error}</div>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="card p-5 card mb-5 block rounded-lg border border-gray-300 shadow-md">
                <h2 className="mb-2 text-lg">Shipping Address</h2>
                <div>
                  {shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.city},{' '}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </div>
                {isDelivered ? (
                  <div className="my-3 rounded-lg bg-green-100 p-3 text-green-700">Delivered at {deliveredAt}</div>
                ) : (
                  <div className="my-3 rounded-lg bg-red-100 p-3 text-red-700">Not delivered</div>
                )}
              </div>

              <div className="card p-5 card mb-5 block rounded-lg border border-gray-300 shadow-md">
                <h2 className="mb-2 text-lg">Payment Method</h2>
                <div>{paymentMethod}</div>
                {isPaid ? (
                  <div className="my-3 rounded-lg bg-green-100 p-3 text-green-700">Paid at {paidAt}</div>
                ) : (
                  <div className="my-3 rounded-lg bg-red-100 p-3 text-red-700">Not paid</div>
                )}
              </div>

              <div className="card overflow-x-auto card p-5 mb-5 block rounded-lg border border-gray-300 shadow-md">
                <h2 className="mb-2 text-lg">Order Items</h2>
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">Item</th>
                      <th className="    p-5 text-right">Quantity</th>
                      <th className="  p-5 text-right">Price</th>
                      <th className="p-5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td>
                          <Link className="flex items-center" href={`/product/${item.slug}`}>
                            <Image src={item.image} alt={item.name} width={50} height={50} />
                            &nbsp;
                            {item.name}
                          </Link>
                        </td>
                        <td className=" p-5 text-right">{item.quantity}</td>
                        <td className="p-5 text-right">₹{item.price}</td>
                        <td className="p-5 text-right">₹{item.quantity * item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="card p-5 card mb-5 block rounded-lg border border-gray-300 shadow-md">
                <h2 className="mb-2 text-lg">Order Summary</h2>
                <ul>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Items</div>
                      <div>₹{itemsPrice}</div>
                    </div>
                  </li>{' '}
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Tax</div>
                      <div>₹{taxPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Shipping</div>
                      <div>₹{shippingPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Total</div>
                      <div>₹{totalPrice}</div>
                    </div>
                  </li>
                  {!isPaid && (
                    <li>
                      {isPending ? (
                        <div>Loading...</div>
                      ) : (
                        <div className="w-full">
                          <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
                        </div>
                      )}
                      {loadingPay && <div>Loading...</div>}
                    </li>
                  )}
                  {session.user.isAdmin && order.isPaid && !order.isDelivered && (
                    <li>
                      {loadingDeliver && <div>Loading...</div>}
                      <button
                        type="submit"
                        className="primary-button w-full rounded py-2 px-4 shadow outline-none hover: bg-yellow-400 active:bg-yellow-500"
                        onClick={deliverOrderHandler}
                      >
                        Deliver Order
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;
