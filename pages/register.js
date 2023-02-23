import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Container, Typography, Divider, TextField, Stack, Button, Box } from '@mui/material';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { getError } from '../utils/error';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '50vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(2, 0),
}));

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Create Account">
      <StyledRoot>
        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Register Page
            </Typography>
            <Divider sx={{ my: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>
            <Stack spacing={3}>
              <form onSubmit={handleSubmit(submitHandler)}>
                <Box sx={{ mb: 5 }}>
                  <TextField
                    label="Name"
                    fullWidth
                    type="text"
                    {...register('name', {
                      required: 'Please enter name',
                    })}
                  />
                  {errors.name && <div className="text-red-500">{errors.name.message}</div>}
                </Box>
                <Box sx={{ mb: 5 }}>
                  <TextField
                    label="Email"
                    fullWidth
                    type="email"
                    {...register('email', {
                      required: 'Please enter email',
                      pattern: {
                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                        message: 'Please enter valid email',
                      },
                    })}
                  />
                  {errors.email && <div className="text-red-500">{errors.email.message}</div>}
                </Box>
                <Stack direction="row" spacing={5}>
                  <Box sx={{ mb: 5 }}>
                    <TextField
                      label="Password"
                      type="password"
                      {...register('password', {
                        required: 'Please enter password',
                        minLength: { value: 6, message: 'password is more than 5 chars' },
                      })}
                    />
                    {errors.password && <div className="text-red-500 ">{errors.password.message}</div>}
                  </Box>
                  <Box sx={{ mb: 5 }}>
                    <TextField
                      label="CPassword"
                      type="password"
                      id="confirmPassword"
                      {...register('confirmPassword', {
                        required: 'Please enter confirm password',
                        validate: (value) => value === getValues('password'),
                        minLength: {
                          value: 6,
                          message: 'confirm password is more than 5 chars',
                        },
                      })}
                    />
                    {errors.confirmPassword && <div className="text-red-500 ">{errors.confirmPassword.message}</div>}
                    {errors.confirmPassword && errors.confirmPassword.type === 'validate' && (
                      <div className="text-red-500 ">Password do not match</div>
                    )}
                  </Box>
                </Stack>
                <Box sx={{ mb: 1 }}>
                  Already have an account?&nbsp;
                  <Link href={`/login?redirect=${redirect || '/'}`}>Sign</Link>
                </Box>
                <Button
                  sx={{ my: 2 }}
                  size="large"
                  fullWidth
                  type="submit"
                  className="primary-button rounded py-2 px-4 shadow outline-none hover: bg-yellow-400 active:bg-yellow-500"
                >
                  Register
                </Button>
              </form>
            </Stack>
          </StyledContent>
        </Container>
      </StyledRoot>
    </Layout>
  );
}
