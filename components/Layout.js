import PropTypes from 'prop-types';
import { useState } from 'react';
import Head from 'next/head';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled(Box)({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  width: '100vw',
  paddingTop: APP_BAR_MOBILE + 20,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const Layout = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{title ? `${title}- Fish Ecommerce` : 'Fish Store'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="ecommerce website" />
        <meta name="keywords" content="fish,online fish,upfish,i want fish,new fish,fish online,website" />
        <meta name="author" content="DesignWithsatya" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-left" autoClose={5000} limit={1} />
      <RootStyle>
        <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
        <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
        <Main>{children}</Main>
      </RootStyle>
    </>
  );
};

export default Layout;
Layout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};
