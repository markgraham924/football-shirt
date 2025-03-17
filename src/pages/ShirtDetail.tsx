import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  CircularProgress,
  Button,
  Divider,
  Chip,
  Card,
  CardMedia,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { getShirtById, Shirt } from '../services/ShirtService';

const ShirtDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shirt, setShirt] = useState<Shirt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchShirt() {
      if (!id) {
        setError('No shirt ID provided');
        setLoading(false);
        return;
      }

      try {
        const shirtData = await getShirtById(id);
        setShirt(shirtData);
      } catch (err) {
        console.error('Error fetching shirt:', err);
        setError('Failed to load shirt details');
      } finally {
        setLoading(false);
      }
    }

    fetchShirt();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !shirt) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button
          component={Link}
          to="/marketplace"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Marketplace
        </Button>
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            {error || 'Shirt not found'}
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Format the date
  const formattedDate = shirt.createdAt instanceof Date 
    ? shirt.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown date';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Button
        component={Link}
        to="/marketplace"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Marketplace
      </Button>

      <Grid container spacing={4}>
        {/* Image Column */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardMedia
              component="img"
              image={shirt.imageUrl}
              alt={shirt.name}
              sx={{ 
                width: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
                bgcolor: '#f5f5f5'
              }}
            />
          </Card>
        </Grid>

        {/* Details Column */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {shirt.name}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {shirt.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                Owner: {' '}
                <Link to={`/profile/${shirt.userId}`} style={{ textDecoration: 'none' }}>
                  <Chip 
                    label={shirt.userDisplayName} 
                    clickable 
                    color="primary" 
                  />
                </Link>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                Added on: {formattedDate}
              </Typography>
            </Box>

            {/* Metadata Section */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Shirt Details
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {shirt.team && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Team:
                  </Typography>
                  <Typography variant="body1">{shirt.team}</Typography>
                </Grid>
              )}
              
              {shirt.league && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    League:
                  </Typography>
                  <Typography variant="body1">{shirt.league}</Typography>
                </Grid>
              )}
              
              {shirt.season && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Season:
                  </Typography>
                  <Typography variant="body1">{shirt.season}</Typography>
                </Grid>
              )}
              
              {shirt.kitType && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Kit Type:
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {shirt.kitType}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShirtDetail;
