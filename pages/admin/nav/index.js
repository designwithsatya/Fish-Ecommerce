import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Box, Drawer, Typography } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import useResponsive from '../../../components/hooks/useResponsive';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/NavSection';
import navConfig from './config';

const NAV_WIDTH = 280;
const NAV_HEIGHT = '70px';

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { pathname } = router.pathname;

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ mb: 2, mx: 2.5 }} style={{ marginTop: '15px' }}>
        <StyledAccount>
          <Box sx={{ ml: 2 }}>
            {session?.user ? (
              <Typography variant="subtitle2" sx={{ color: 'text.primary', textTransform: 'uppercase' }}>
                {session.user.name}
              </Typography>
            ) : (
              'designwithsatya'
            )}
          </Box>
        </StyledAccount>
      </Box>
      <NavSection navConfig={navConfig} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH, NAV_HEIGHT },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              NAV_HEIGHT,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
              marginTop: NAV_HEIGHT,
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH, NAV_HEIGHT },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
