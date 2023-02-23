import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/legacy/image';
import { XCircleIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { Store } from '../utils/Store';
import Layout from '../components/Layout';

const CartScreen = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  // eslint-disable-next-line consistent-return
  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    toast.success('Product is added to the cart');
  };

  return (
    <Layout title="shopingcart">
      <Container>
        <Typography sx={{ mb: 5 }} variant="h5">
          Your Shoping Cart
        </Typography>
        {cartItems.length === 0 ? (
          <div>
            Cart is empty.{' '}
            <Link className="text-purple-400" href="/">
              Go shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3 ">
              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-yellow-200 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="p-5 text-left">Item</th>
                    <th className="p-5 text-left">Name</th>
                    <th className="p-5 text-right">Quantity</th>
                    <th className="p-5 text-right">Price</th>
                    <th className="p-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.slug} className="border-none ">
                      <td>
                        <Link className="flex items-center space-x-4 group" href={`/product/${item.slug}`}>
                          <div className="relative group-hover:scale-50 transition-transform">
                            <Image src={item.image} alt={item.name} width={50} height={50} fill="true" loading="lazy" />
                          </div>
                        </Link>
                      </td>
                      <td className="p-5 text-left">{item.name}</td>
                      <td className="p-5 text-right">
                        <select value={item.quantity} onChange={(e) => updateCartHandler(item, e.target.value)}>
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1} KG
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-5 text-right">₹{item.price}</td>
                      <td className="p-5 text-right">
                        <button type="submit" onClick={() => removeItemHandler(item)}>
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card p-5 card mb-5 block rounded-lg border border-gray-300 shadow-md">
              <ul>
                <li>
                  <div className="pb-3 text-xl">
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : ₹
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </div>
                </li>
                <li>
                  <button
                    type="submit"
                    onClick={() => router.push('/shipping')}
                    className="primary-button w-full primary-button rounded py-2 px-4 shadow outline-none hover: bg-yellow-400 active:bg-yellow-500"
                  >
                    Go to Checkout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
