import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation } from 'react-router-dom';
import type {} from '@mui/material/themeCssVarsAugmentation';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs() {
  const location = useLocation();

  // Define breadcrumb titles based on the current path
  const getTitleFromPath = (pathname: string): string | undefined => {
    switch (pathname) {
    case '/':
      return 'Dashboard';
    case '/invoices':
      return 'Invoices';
    case '/archive':
      return 'Archive';
    case '/collections':
      return 'Collections';
    }
  };

  const title = getTitleFromPath(location.pathname);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Strada Take Home</Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
        {title}
      </Typography>
    </StyledBreadcrumbs>
  );
}
