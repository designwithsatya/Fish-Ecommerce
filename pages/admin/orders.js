import { Container, Typography } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import AdminLayout from './AdminLayout';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function AdminOrderScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/orders`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="admin order">
      <AdminLayout>
        <Container>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Order
          </Typography>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-yellow-200 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">USER</th>
                    <th className="p-5 text-left">DATE</th>
                    <th className="p-5 text-left">TOTAL</th>
                    <th className="p-5 text-left">PAID</th>
                    <th className="p-5 text-left">DELIVERED</th>
                    <th className="p-5 text-left">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-none">
                      <td className="p-5">{order._id.substring(20, 24)}</td>
                      <td className="p-5">{order.user ? order.user.name : 'DELETED USER'}</td>
                      <td className="p-5">{order.createdAt.substring(0, 10)}</td>
                      <td className="p-5">₹{order.totalPrice}</td>
                      <td className="p-5">{order.isPaid ? `${order.paidAt.substring(0, 10)}` : 'not paid'}</td>
                      <td className="p-5">
                        {order.isDelivered ? `${order.deliveredAt.substring(0, 10)}` : 'not delivered'}
                      </td>
                      <td className="p-5">
                        <Link
                          className="primary-button primary-button rounded py-2 px-4 shadow outline-none hover: bg-yellow-400 active:bg-yellow-500"
                          href={`/order/${order._id}`}
                          passHref
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Container>
      </AdminLayout>
    </Layout>
  );
}

AdminOrderScreen.auth = { adminOnly: true };
