import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useGetCollectionsQuery, useGetContentQuery, useGetInvoicesQuery } from '../services/api.ts';
import CreateCollectionCard from '../components/CreateCollectionCard.tsx';
import CollectionCard from '../components/CollectionCard.tsx';
import AccountsReceivableAgingChart from '../components/AccountsReceivableAgingChart.tsx';
import DashboardCard from '../components/DashboardCard.tsx';
import RecentMedia from '../components/RecentMedia.tsx';
import { useView } from '../ context/ViewContext.tsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedTeam } = useView();

  const {
    data: collections,
    isLoading: isCollectionsLoading,
    error: collectionError,
  } = useGetCollectionsQuery();

  const {
    data: content,
    isLoading: isContentLoading,
    error: contentError,
  } = useGetContentQuery();

  const {
    data: invoices,
    isLoading: isInvoicesLoading,
    error: invoicesError,
  } = useGetInvoicesQuery();

  const filteredCollections = collections?.filter(
    (collection) => collection.team_id === selectedTeam?.id,
  ) || [];
  const recentCollections = filteredCollections.slice(0, 3);

  const filteredContent = content?.filter(
    (item) => item.team_id === selectedTeam?.id,
  ) || [];
  const recentArtwork = filteredContent
    .filter((item) => item.medium === 'Art')
    .slice(0, 6)
    .map((item) => item.image_url);

  const recentContent = filteredContent
    .filter((item) => item.medium === 'Photography')
    .slice(0, 6)
    .map((item) => item.image_url);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12 }}>
          <DashboardCard linkTitle="Collections" link="/collections">
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Collections (
              {String(selectedTeam?.name).charAt(0).toUpperCase() + String(selectedTeam?.name).slice(1) || 'No Team Selected'}
              )
            </Typography>
            <Box sx={{
              display: 'flex', flexWrap: 'wrap', gap: 2, p: 2, justifyContent: 'center',
            }}
            >
              <CreateCollectionCard />

              {isCollectionsLoading && (
                <Typography>Loading collections...</Typography>
              )}

              {collectionError && (
                <Typography color="error">Error loading collections.</Typography>
              )}

              {recentCollections.length > 0
                  && recentCollections.map((collection) => (
                    <Box
                      key={collection.id}
                      sx={{
                        cursor: 'pointer',
                        flex: '1 1 0px',
                        minWidth: 220,
                        maxWidth: 300,
                      }}
                      onClick={() => navigate(`/collections/${collection.id}`)}
                    >
                      <CollectionCard
                        id={collection.id.toString()}
                        title={collection.name}
                        description={collection.description}
                        imageUrl={collection.featured_image || undefined}
                      />
                    </Box>
                  ))}
            </Box>
          </DashboardCard>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <DashboardCard linkTitle="Artwork" link="/archive?artwork=true">
            {isContentLoading && <Typography>Loading artwork...</Typography>}
            {contentError && <Typography color="error">Error loading artwork.</Typography>}
            {recentArtwork.length > 0 ? (
              <RecentMedia title="Artwork" images={recentArtwork} />
            ) : (
              <Typography>No artwork available for this team.</Typography>
            )}
          </DashboardCard>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <DashboardCard linkTitle="Content" link="/archive?content=true">
            {isContentLoading && <Typography>Loading content...</Typography>}
            {contentError && <Typography color="error">Error loading content.</Typography>}
            {recentContent.length > 0 ? (
              <RecentMedia title="Content" images={recentContent} />
            ) : (
              <Typography>No content available for this team.</Typography>
            )}
          </DashboardCard>
        </Grid>

        <Grid size={{ xs: 12 }} mb={2}>
          <DashboardCard linkTitle="Invoice Summary" link="/invoices">
            {isInvoicesLoading && <Typography>Loading invoices...</Typography>}
            {invoicesError && <Typography color="error">Error loading invoices.</Typography>}
            {invoices && <AccountsReceivableAgingChart title="Aging Accounts Receivable" invoices={invoices} />}
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
}
