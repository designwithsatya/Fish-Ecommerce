import { useRef, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { Box, AppBar, Toolbar, Badge, Divider, Typography, Stack, MenuItem, IconButton } from '@mui/material';
import { Store } from '../utils/Store';
import MenuPopover from './MenuPopover';
import Iconify from './Iconify/Iconify';
import ScrollIndicator from './scroll/ScrollIndicator';
import Searchbar from './Searchbar';
import { bgBlur } from '../utils/cssStyles';

const MENU_OPTIONS = [
  {
    label: 'Profile',
    linkTo: '/profile',
  },
  {
    label: 'Order-History',
    linkTo: '/order-history',
  },
];

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 65;

const RootStyle = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.blugray[500] }),
  boxShadow: 'none',
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -5,
    top: 13,
    border: `2px solid ${theme.palette.gray[300]}`,
    padding: '0 4px',
  },
}));

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { cart } = state;
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const LogoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(null);
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <RootStyle>
        <ToolbarStyle>
          <IconButton onClick={onOpenSidebar} sx={{ color: '#fff', mr: 1 }}>
            <Iconify icon="eva:menu-2-fill" />
          </IconButton>
          <Typography variant="overline" sx={{ flexGrow: 1 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              Fish Store
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Searchbar />
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1 }}>
            <Link href="/cart">
              <IconButton aria-label="cart">
                <StyledBadge color="error" max={99} badgeContent={cartItemsCount}>
                  <Iconify icon="eva:shopping-cart-fill" width={24} height={24} />
                </StyledBadge>
              </IconButton>
            </Link>

            {status === 'loading' ? (
              'Loading'
            ) : session?.user ? (
              <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                  p: 0,
                  mt: 1.5,
                  ml: 0.75,
                  width: 180,
                  '& .MuiMenuItem-root': {
                    typography: 'body2',
                    borderRadius: 0.75,
                  },
                }}
              >
                <Stack sx={{ p: 1 }}>
                  {MENU_OPTIONS.map((option) => (
                    <MenuItem key={option.label} href={option.linkTo} component={Link} onClick={handleClose}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Stack>
                {session.user.isAdmin && (
                  <Stack sx={{ p: 1 }}>
                    <MenuItem href="/admin/dashboard" component={Link}>
                      Admin Dashboard
                    </MenuItem>
                  </Stack>
                )}
                <Stack sx={{ p: 1 }}>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  <MenuItem href="#" onClick={LogoutClickHandler}>
                    LogOut
                  </MenuItem>
                </Stack>
              </MenuPopover>
            ) : (
              <MenuItem href="/login" component={Link}>
                Login
              </MenuItem>
            )}
            {session?.user ? (
              <Box id="adminuser" ref={anchorRef} onClick={handleOpen}>
                <Typography sx={{ cursor: 'pointer' }} variant="body2" noWrap>
                  {session.user.name}
                </Typography>
              </Box>
            ) : null}
          </Stack>
        </ToolbarStyle>
        <ScrollIndicator />
      </RootStyle>
    </>
  );
}
