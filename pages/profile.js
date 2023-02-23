import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Container } from '@mui/material';
import { getError } from '../utils/error';
import Layout from '../components/Layout';

export default function ProfileScreen() {
  const { data: session } = useSession();

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('name', session.user.name);
    setValue('email', session.user.email);
  }, [session.user, setValue]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put('/api/auth/update', {
        name,
        email,
        password,
      });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      toast.success('Profile updated successfully');
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Profile">
      <Container>
        <div className="container mx-auto my-5 p-5 ">
          <div className="md:flex no-wrap md:-mx-2 flex items-center">
            <div className="w-full mx-2 h-64 ">
              <div className="bg-white p-3 shadow-sm rounded-sm">
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                  <span className="text-green-500">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">About</span>
                </div>
                <div className="text-gray-700">
                  <div className="grid md:grid-cols-2 text-sm">
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">First Name</div>
                      <div className="px-4 py-2">{session.user.name}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">User Id</div>
                      <div className="px-4 py-2">{session.user._id}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Gender</div>
                      <div className="px-4 py-2">Female</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Contact No.</div>
                      <div className="px-4 py-2">+11 998001001</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Current Address</div>
                      <div className="px-4 py-2">Beech Creek, PA, Pennsylvania</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Permanant Address</div>
                      <div className="px-4 py-2">Arlington Heights, IL, Illinois</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Email.</div>
                      <div className="px-4 py-2">
                        <a className="text-blue-800" href="mailto:jane@example.com">
                          {session.user.email}
                        </a>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Birthday</div>
                      <div className="px-4 py-2">Feb 06, 1998</div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="block w-full text-purple-800 text-sm font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:shadow-outline focus:bg-purple-300 hover:shadow-xs p-3 my-4"
                >
                  Edit Information
                </button>
              </div>
            </div>
          </div>
        </div>
        <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitHandler)}>
          <h1 className="mb-4 text-xl">Update Profile</h1>
          <div className="mb-4">
            <label htmlFor="name">
              <input
                type="text"
                className="w-full rounded border p-2 outline-none ring-yellow-300 focus:ring"
                id="name"
                {...register('name', {
                  required: 'Please enter name',
                })}
              />
              \
            </label>
            {errors.name && <div className="text-red-500">{errors.name.message}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="email">
              <input
                type="email"
                className="w-full rounded border p-2 outline-none ring-yellow-300 focus:ring"
                id="email"
                {...register('email', {
                  required: 'Please enter email',
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                    message: 'Please enter valid email',
                  },
                })}
              />
            </label>
            {errors.email && <div className="text-red-500">{errors.email.message}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="password">
              <input
                className="w-full rounded border p-2 outline-none ring-yellow-300 focus:ring"
                type="password"
                id="password"
                {...register('password', {
                  minLength: { value: 6, message: 'password is more than 5 chars' },
                })}
              />
            </label>
            {errors.password && <div className="text-red-500 ">{errors.password.message}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword">
              <input
                className="w-full rounded border p-2 outline-none ring-yellow-300 focus:ring"
                type="password"
                id="confirmPassword"
                {...register('confirmPassword', {
                  validate: (value) => value === getValues('password'),
                  minLength: {
                    value: 6,
                    message: 'confirm password is more than 5 chars',
                  },
                })}
              />
            </label>
            {errors.confirmPassword && <div className="text-red-500 ">{errors.confirmPassword.message}</div>}
            {errors.confirmPassword && errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500 ">Password do not match</div>
            )}
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="primary-button primary-button rounded py-2 px-4 shadow outline-none hover: bg-yellow-400 active:bg-yellow-500"
            >
              Update Profile
            </button>
          </div>
        </form>
      </Container>
    </Layout>
  );
}

ProfileScreen.auth = true;
