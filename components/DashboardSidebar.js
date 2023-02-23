import { useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Drawer, Avatar, Typography, Divider } from '@mui/material';
import useResponsive from './hooks/useResponsive';
import Scrollbar from './scrollbar';
import NavSection from './NavSection';
import navConfig from './NavConfig';

const DRAWER_WIDTH = 280;
const DRAWER_HIGHT = '70px';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    // width: DRAWER_WIDTH,
  },
}));
const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const router = useRouter();
  const { pathname } = router;
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box style={{ marginTop: '15px' }} sx={{ mb: 5, mx: 2.5 }}>
        <AccountStyle>
          <Avatar src="" alt="photoURL" />
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              Satyendra SIngh
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Web Developer
            </Typography>
          </Box>
        </AccountStyle>
      </Box>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <NavSection navConfig={navConfig} />
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <>
      <RootStyle>
        {!isDesktop && (
          <Drawer
            open={isOpenSidebar}
            onClose={onCloseSidebar}
            PaperProps={{
              sx: { width: DRAWER_WIDTH, marginTop: DRAWER_HIGHT },
            }}
          >
            {renderContent}
          </Drawer>
        )}

        {isDesktop && (
          <Drawer
            open={isOpenSidebar}
            onClose={onCloseSidebar}
            PaperProps={{
              sx: {
                width: DRAWER_WIDTH,
                bgcolor: 'background.default',
                marginTop: DRAWER_HIGHT,
              },
            }}
          >
            {renderContent}
          </Drawer>
        )}
      </RootStyle>
    </>
  );
}
