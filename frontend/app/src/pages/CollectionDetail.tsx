import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import CollectionCard from '../components/CollectionCard.tsx';
import CreateContentDialog from '../components/CreateContentDialog.tsx';
import {
  useGetCollectionQuery,
  useGetSubCollectionsQuery,
  useGetContentByCollectionIdQuery,
} from '../services/api.ts';

export default function CollectionDetail() {
  const { id } = useParams<{ id: string }>();
  const collectionId = Number(id);
  const navigate = useNavigate();

  // Dialog state
  const [open, setOpen] = useState(false);

  const {
    data: collection,
    isLoading: isCollectionLoading,
    error: collectionError,
  } = useGetCollectionQuery(collectionId);

  const {
    data: subcollections,
    isLoading: isSubCollectionsLoading,
    error: subCollectionsError,
  } = useGetSubCollectionsQuery(collectionId);

  const {
    data: content,
    isLoading: isContentLoading,
    error: contentError,
  } = useGetContentByCollectionIdQuery(collectionId);

  if (isCollectionLoading || isSubCollectionsLoading || isContentLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (collectionError || subCollectionsError || contentError || !collection) {
    return <Typography color="error">Failed to load collection details.</Typography>;
  }

  const hasSubcollections = subcollections && subcollections.length > 0;
  const hasContent = content && content.length > 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section with Name, Description & Button on Opposite Ends */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2,
      }}
      >
        <Box>
          <Typography variant="h4">{collection.name}</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {collection.description}
          </Typography>
        </Box>
        {(hasSubcollections || hasContent) && (
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Create Content
          </Button>
        )}
      </Box>

      <CreateContentDialog open={open} onClose={() => setOpen(false)} collectionId={collectionId} />

      {!hasSubcollections && !hasContent ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
          flexDirection="column"
        >
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            No content or subcollections available. Start by adding content!
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Create Content
          </Button>
        </Box>
      ) : (
        <>
          {/* Subcollections Section */}
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Subcollections</Typography>
          <Grid container spacing={2}>
            {hasSubcollections ? (
              subcollections.map((sub) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={sub.id}>
                  <Box
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/collections/${sub.id}`)} // Navigate to subcollection
                  >
                    <CollectionCard
                      id={sub.id.toString()}
                      title={sub.name}
                      description={sub.description}
                      imageUrl={sub.featured_image || undefined}
                    />
                  </Box>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No subcollections found.
              </Typography>
            )}
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Content Section */}
          <Typography variant="h5" sx={{ mb: 2 }}>Content</Typography>
          <Grid container spacing={2}>
            {hasContent ? (
              content.map((item) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.id}>
                  <Box
                    component="img"
                    src={item.image_url}
                    alt={`Gallery ${item.id}`}
                    sx={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      objectFit: 'cover',
                      borderRadius: 2,
                    }}
                  />
                </Grid>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No content available in this collection.
              </Typography>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
}
