import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'error.main' }}>
        403
      </Typography>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Access Denied
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        You do not have permission to view this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </Box>
  );
}
