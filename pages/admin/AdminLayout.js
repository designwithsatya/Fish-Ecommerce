import { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Nav from './nav';

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <StyledRoot>
      <Nav openNav={open} onCloseNav={() => setOpen(false)} />
      <Main>{children}</Main>
    </StyledRoot>
  );
}
AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
