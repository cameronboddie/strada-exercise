import React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useSearchParams } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { useGetContentQuery } from '../services/api.ts';
import { useView } from '../ context/ViewContext.tsx';

export default function Archive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedTeam } = useView();
  const isArtwork = searchParams.get('artwork') === 'true';
  const { data: content, isLoading } = useGetContentQuery();

  // Filter images based on medium type
  const contentImages = content
    ?.filter((c) => c.medium === 'Photography' && c.team_name.toLocaleLowerCase() === selectedTeam?.toLocaleLowerCase())
    .map((c) => c.image_url);

  const artworkImages = content
    ?.filter((c) => c.medium === 'Art' && c.team_name.toLocaleLowerCase() === selectedTeam?.toLocaleLowerCase())
    .map((c) => c.image_url);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchParams(value === 'artwork' ? { artwork: 'true' } : { content: 'true' });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Archive
      </Typography>

      {/* Toggle Radio Buttons */}
      <FormControl component="fieldset">
        <RadioGroup row value={isArtwork ? 'artwork' : 'content'} onChange={handleToggle}>
          <FormControlLabel value="artwork" control={<Radio />} label="View All Art" />
          <FormControlLabel value="content" control={<Radio />} label="View All Content" />
        </RadioGroup>
      </FormControl>

      {/* Loading State */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2, width: '100%' }}>
          {((isArtwork ? artworkImages : contentImages) ?? []).length === 0 ? (
            <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
              No images available.
            </Typography>
          ) : (
            (isArtwork ? artworkImages : contentImages)?.map((image, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                <Box
                  component="img"
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  sx={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                />
              </Grid>
            ))
          )}
        </Grid>
      )}
    </>
  );
}
