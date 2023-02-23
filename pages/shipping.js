import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

export default function ShippingScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter();

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );
    router.push('/payment');
  };
  return (
    <Layout title="Delivery-page">
      <CheckoutWizard activeStep={1} />
      <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitHandler)}>
        <Typography variant="h5" sx={{ mb: 5 }}>
          Delivery Address
        </Typography>
        <div className="mb-4">
          <label htmlFor="fullName">
            <input
              className="w-full rounded border p-2 outline-none ring-yellow-300 focus:ring"
              id="fullName"
              {...register('fullName', {
                required: 'Please enter full name',
              })}
            />
          </label>
          {errors.fullName && <div className="text-red-500">{errors.fullName.message}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="address">
            <input
              className="w-full rounded border p-2 outline-none ring-yellow-300 focus:ring"
              id="address"
              {...register('address', {
                required: 'Please enter address',
                minLength: { value: 3, message: 'Address is more than 2 chars' },
              })}
            />
          </label>
          {errors.address && <div className="text-red-500">{errors.address.message}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="city">
            <input
              className="w-full rounded border p-2 outline-none ring-yellow-300 focus:ring"
              id="city"
              {...register('city', {
                required: 'Please enter city',
              })}
            />
          </label>
          {errors.city && <div className="text-red-500 ">{errors.city.message}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">
            <input
              className="w-full rounded border p-2 outline-none ring-yellow-300 focus:ring"
              id="postalCode"
              {...register('postalCode', {
                required: 'Please enter postal code',
              })}
            />
          </label>
          {errors.postalCode && <div className="text-red-500 ">{errors.postalCode.message}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="country">
            <input
              className="w-full rounded border p-2 outline-none ring-yellow-300 focus:ring"
              id="country"
              {...register('country', {
                required: 'Please enter country',
              })}
            />
          </label>
          {errors.country && <div className="text-red-500 ">{errors.country.message}</div>}
        </div>
        <div className="mb-4 flex justify-between">
          <button
            type="submit"
            className="primary-button primary-button rounded py-2 px-4 shadow outline-none hover: bg-yellow-400 active:bg-yellow-500"
          >
            Continue
          </button>
        </div>
      </form>
    </Layout>
  );
}

ShippingScreen.auth = true;
