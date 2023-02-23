import PropTypes from 'prop-types';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Container } from '@mui/material';
import Layout from '../../../components/Layout';
import { getError } from '../../../utils/error';
import AdminLayout from '../AdminLayout';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}
export default function AdminProductEditScreen() {
  const { query } = useRouter();
  const productId = query.id;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: 'FETCH_SUCCESS' });
        setValue('name', data.name);
        setValue('slug', data.slug);
        setValue('price', data.price);
        setValue('image', data.image);
        setValue('category', data.category);
        setValue('variety', data.variety);
        setValue('countInStock', data.countInStock);
        setValue('description', data.description);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, [productId, setValue]);

  const router = useRouter();

  const uploadHandler = async (e, imageField = 'image') => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const {
        data: { signature, timestamp },
      } = await axios('/api/admin/cloudinary-sign');

      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      const { data } = await axios.post(url, formData);
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue(imageField, data.secure_url);
      toast.success('File uploaded successfully');
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const submitHandler = async ({ name, slug, price, category, image, variety, countInStock, description }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        price,
        category,
        image,
        variety,
        countInStock,
        description,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Edit Product ${productId}`}>
      <AdminLayout>
        <Container>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitHandler)}>
              <h1 className="mb-4 text-xl">{`Edit Product ${productId}`}</h1>
              <div className="mb-4">
                <label htmlFor="Name">
                  <input
                    type="text"
                    className="w-full rounded border p-2  outline-none ring-gray-300  focus:ring"
                    id="name"
                    {...register('name', {
                      required: 'Please enter name',
                    })}
                  />
                </label>
                {errors.name && <div className="text-red-500">{errors.name.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="slug">
                  <input
                    type="text"
                    className="w-full rounded border p-2  outline-none ring-gray-300  focus:ring"
                    id="slug"
                    {...register('slug', {
                      required: 'Please enter slug',
                    })}
                  />
                </label>
                {errors.slug && <div className="text-red-500">{errors.slug.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="price">
                  <input
                    type="text"
                    className="w-full rounded border p-2  outline-none ring-gray-300  focus:ring"
                    id="price"
                    {...register('price', {
                      required: 'Please enter price',
                    })}
                  />
                </label>
                {errors.price && <div className="text-red-500">{errors.price.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="image">
                  <input
                    type="text"
                    className="w-full rounded border p-2  outline-none ring-gray-300  focus:ring"
                    id="image"
                    {...register('image', {
                      required: 'Please enter image',
                    })}
                  />
                </label>
                {errors.image && <div className="text-red-500">{errors.image.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="imageFile">
                  <input
                    type="file"
                    className="w-full rounded border p-2  outline-none ring-gray-300  focus:ring"
                    id="imageFile"
                    onChange={uploadHandler}
                  />
                </label>
                {loadingUpload && <div>Uploading....</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="category">
                  <input
                    type="text"
                    className="w-full rounded border p-2  outline-none ring-gray-300  focus:ring"
                    id="category"
                    {...register('category', {
                      required: 'Please enter category',
                    })}
                  />
                </label>
                {errors.category && <div className="text-red-500">{errors.category.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="variety">
                  <input
                    type="text"
                    className="w-full rounded border p-2  outline-none ring-gray-300  focus:ring"
                    id="variety"
                    {...register('variety', {
                      required: 'Please enter variety',
                    })}
                  />
                </label>
                {errors.variety && <div className="text-red-500">{errors.variety.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">
                  <input
                    type="text"
                    className="w-full rounded border p-2  outline-none ring-gray-300  focus:ring"
                    id="countInStock"
                    {...register('countInStock', {
                      required: 'Please enter countInStock',
                    })}
                  />
                </label>
                {errors.countInStock && <div className="text-red-500">{errors.countInStock.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">
                  <input
                    type="text"
                    className="w-full rounded border p-2  outline-none ring-gray-300  focus:ring"
                    id="description"
                    {...register('description', {
                      required: 'Please enter description',
                    })}
                  />
                </label>
                {errors.description && <div className="text-red-500">{errors.description.message}</div>}
              </div>
              <div className="mb-4">
                <button
                  type="submit"
                  disabled={loadingUpdate}
                  className="rounded bg-yellow-400 py-2 px-4 text-white shadow outline-none hover:bg-yellow-400  active:bg-yellow-500"
                >
                  {loadingUpdate ? 'Loading' : 'Update'}
                </button>
              </div>
              <div className="mb-4  rounded bg-gray-100 py-2  px-4 text-center shadow outline-none hover:bg-gray-200  active:bg-gray-300">
                <Link href={`/admin/products`}>Back</Link>
              </div>
            </form>
          )}
        </Container>
      </AdminLayout>
    </Layout>
  );
}

AdminProductEditScreen.auth = { adminOnly: true };
AdminProductEditScreen.propTypes = {
  product: PropTypes.object,
};
