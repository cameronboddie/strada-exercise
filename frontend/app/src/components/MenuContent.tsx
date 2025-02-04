import { Link, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from '../ context/AuthContext.tsx';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, link: '/' },
  { text: 'Archive', icon: <AnalyticsRoundedIcon />, link: '/archive' },
  { text: 'Collections', icon: <PeopleRoundedIcon />, link: '/collections' },
];

const secondaryListItems = [
  {
    text: 'Invoices', icon: <SettingsRoundedIcon />, link: '/invoices', requiredPermission: 'View Invoice',
  },
];

export default function MenuContent() {
  const location = useLocation();
  const { permissions } = useAuth();

  return (
    <Stack sx={{ flexGrow: 1, p: 1 }}>
      {/* Main List */}
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={Link}
              to={item.link}
              selected={location.pathname === item.link}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Secondary List with Permission Handling */}
      <List dense>
        {secondaryListItems.map((item, index) => {
          const hasPermission = permissions?.includes(item.requiredPermission ?? '');

          return (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!hasPermission ? 'You do not have permission to view this section' : ''}>
                <span>
                  <ListItemButton
                    component={hasPermission ? Link : 'div'}
                    to={hasPermission ? item.link : '#'}
                    selected={location.pathname === item.link}
                    disabled={!hasPermission}
                    sx={{ opacity: hasPermission ? 1 : 0.5 }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} secondary={item.text === 'Invoices' ? 'View Invoices' : undefined} />
                  </ListItemButton>
                </span>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
}
