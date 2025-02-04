import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

export type RecentArtworkProps = {
  images: string[];
  title:string
};

export default function RecentMedia({ images, title }: RecentArtworkProps) {
  return (
    <Grid container spacing={2} sx={{ width: '100%', margin: 0 }}>
      <Grid size={{ xs: 12 }}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
      </Grid>
      {images.map((image, index) => (
        <Grid
          size={{
            xs: 6, sm: 4,
          }}
          key={index}
        >
          <Box
            component="img"
            src={image}
            alt={`Artwork ${index + 1}`}
            sx={{
              width: '100%',
              height: 220, // Adjust height to fit design
              objectFit: 'cover',
              borderRadius: 2,
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
