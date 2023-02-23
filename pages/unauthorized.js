import { useRouter } from 'next/router';
import Link from 'next/link';

import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
import Layout from '../components/Layout';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(5, 0),
}));

export default function Unauthorized() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <Layout title="Unauthorized Page">
      <Container>
        {message && (
          <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h2" paragraph>
              Access Denied
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              The page you're trying access has restricted access. Please {message}
            </Typography>
            <Box
              component="img"
              src="/static/illustrations/page403.svg"
              sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
            />
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button
                size="large"
                className="primary-button rounded py-2 px-4 shadow outline-none hover: bg-yellow-400 active:bg-yellow-500"
              >
                Go to HomePage
              </Button>
            </Link>
          </ContentStyle>
        )}
      </Container>
    </Layout>
  );
}
