import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from '@mui/material/Card';
import { ReactNode } from 'react';

export type DashboardCardProps = {
    linkTitle: string;
    link: string;
    children: ReactNode;
};

export default function DashboardCard({ linkTitle, link, children }: DashboardCardProps) {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      {children}

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Link to={link} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
            {linkTitle}
            {' '}
            <ArrowForwardIosIcon sx={{ ml: 0.5 }} />
          </Typography>
        </Link>
      </Box>
    </Card>
  );
}
