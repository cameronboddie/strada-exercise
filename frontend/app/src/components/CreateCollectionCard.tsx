import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState } from 'react';
import CreateCollectionDialog from './CreateCollectionDialog.tsx';

export default function CreateCollectionCard() {
  const [openCreateCollecionDialog, setOpenCreateCollectionDialog] = useState(false);

  const handleOpenCreateCollectionDialog = () => {
    setOpenCreateCollectionDialog(true);
  };

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          width: 310,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          p: 3,
          flex: 1,
          border: '2px dashed',
          borderColor: 'primary.light',
          bgcolor: 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 3,
            transform: 'scale(1.03)',
            borderColor: 'primary.main',
          },
        }}
        onClick={handleOpenCreateCollectionDialog}
      >
        <CardContent sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              sx={{ fontWeight: '700', color: 'text.primary' }}
            >
              Create a Collection
            </Typography>
            <AddCircleOutlineIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>
        </CardContent>
      </Card>
      <CreateCollectionDialog
        open={openCreateCollecionDialog}
        onClose={() => setOpenCreateCollectionDialog(false)}
      />
    </>
  );
}
