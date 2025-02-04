import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CreateCollectionCard from '../components/CreateCollectionCard.tsx';
import { DraggableCollectionCard } from '../components/DraggableCollectionCard.tsx';
import { useGetCollectionsQuery, useUpdateCollectionMutation } from '../services/api.ts';
import {useView} from "../ context/ViewContext.tsx";

export default function Collections() {
  const { data: fetchedCollections, isLoading, error } = useGetCollectionsQuery();
  const { selectedTeam } = useView();
  const [updateCollection] = useUpdateCollectionMutation();

  const [includeSubcollections, setIncludeSubcollections] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const updateParent = async (draggedId: string, targetId: string) => {
    try {
      await updateCollection({
        collectionId: Number(draggedId),
        newCollection: { parent_id: Number(targetId) },
      }).unwrap();
    } catch (err) {
      console.error('Failed to update parent collection:', err);
    }
  };

  const handleDropAttempt = () => {
    if (!includeSubcollections) {
      setSnackbarOpen(true);
    }
  };

  let filteredCollections = fetchedCollections?.filter(
      (col) => !selectedTeam || col.team_id === selectedTeam.id,
  ) || [];

  if (!includeSubcollections) {
    filteredCollections = filteredCollections.filter((col) => !col.parent_id);
  }

  if (isLoading) {
    return <Typography>Loading collections...</Typography>;
  }

  if (error) {
    return <Typography color="error">Failed to load collections.</Typography>;
  }

  if (filteredCollections.length === 0) {
    return <Typography>No collections available for the selected team.</Typography>;
  }

  const cardData = filteredCollections.map((col) => ({
    id: col.id.toString(),
    title: col.name,
    description: col.description,
    imageUrl: col.featured_image || undefined,
  }));

  return (
      <DndProvider backend={HTML5Backend}>
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography component="h2" variant="h6">
                Collections
              </Typography>
              <FormControlLabel
                  control={(
                      <Switch
                          checked={includeSubcollections}
                          onChange={(e) => setIncludeSubcollections(e.target.checked)}
                          color="primary"
                      />
                  )}
                  label="Include Subcollections"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ display: 'flex', alignItems: 'stretch' }}>
              <CreateCollectionCard />
            </Grid>
            {cardData.map((card, index) => (
                <DraggableCollectionCard
                    key={card.id}
                    card={card}
                    index={index}
                    updateParent={updateParent}
                    onDropAttempt={handleDropAttempt} // NEW: Handles drag attempt
                />
            ))}
          </Grid>
        </Box>

        {/* Snackbar Notification */}
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
          <Alert onClose={() => setSnackbarOpen(false)} severity="warning">
            Drag-and-drop is not allowed in the subcollection view.
          </Alert>
        </Snackbar>
      </DndProvider>
  );
}