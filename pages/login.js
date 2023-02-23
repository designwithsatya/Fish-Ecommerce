import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  Divider,
  TextField,
  Stack,
  Button,
  Checkbox,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import Iconify from '../components/Iconify/Iconify';
import { getError } from '../utils/error';
import 'react-toastify/dist/ReactToastify.css';

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

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
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
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(getError(error));
    }
  };
  return (
    <>
      <Layout title="Login">
        <StyledRoot>
          <Container maxWidth="sm">
            <StyledContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Please Login This Page
              </Typography>
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  OR
                </Typography>
              </Divider>
              <Stack spacing={3}>
                <form onSubmit={handleSubmit(submitHandler)}>
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
                  <Box>
                    <TextField
                      name="password"
                      label="password"
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Please enter password',
                        minLength: { value: 6, message: 'password is more than 6 chars' },
                      })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {errors.password && <div className="text-red-500 ">{errors.password.message}</div>}
                  </Box>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                    <Checkbox name="remember" label="Remember me" />
                    <Link
                      href="/forgatepassword"
                      style={{ textDecoration: 'none', cursor: 'pointer' }}
                      variant="subtitle2"
                      underline="hover"
                    >
                      Forgot password?
                    </Link>
                  </Stack>
                  <Button
                    sx={{ mb: 5 }}
                    size="large"
                    fullWidth
                    type="submit"
                    className="primary-button rounded py-2 px-4 shadow outline-none hover: bg-yellow-400 active:bg-yellow-500"
                  >
                    Login
                  </Button>
                  <div className="mb-4 ">
                    New user?&nbsp;
                    <Link href={`/register?redirect=${redirect || '/'}`}>Create an account</Link>
                  </div>
                </form>
              </Stack>
            </StyledContent>
          </Container>
        </StyledRoot>
      </Layout>
    </>
  );
};

export default LoginScreen;
