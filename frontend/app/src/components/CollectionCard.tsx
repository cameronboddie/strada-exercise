import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export type CollectionCardProps = {
    id:string
    title: string;
    imageUrl?: string;
    description: string;
};

export default function CollectionCard({
  id,
  title,
  imageUrl,
  description,
}: CollectionCardProps) {
  return (
    <Card
      id={id}
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3,
          transform: 'scale(1.03)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardMedia
        component="img"
        image={imageUrl}
        alt={title}
        sx={{
          width: '100%',
          height: 160,
          objectFit: 'cover',
        }}
      />
      <CardContent>
        <Typography component="h2" variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

CollectionCard.defaultProps = {
  imageUrl:
        'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
};
