import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CircularProgress,
  CardActionArea,
  Button,
  Box,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { getAllShirts, Shirt } from '../services/ShirtService';

const Marketplace: React.FC = () => {
  const [shirts, setShirts] = useState<Shirt[]>([]);
  const [filteredShirts, setFilteredShirts] = useState<Shirt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchShirts = async () => {
      try {
        const allShirts = await getAllShirts();
        setShirts(allShirts);
        setFilteredShirts(allShirts);
      } catch (error) {
        console.error("Error fetching shirts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShirts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = shirts.filter(shirt => 
        shirt.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        shirt.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredShirts(filtered);
    } else {
      setFilteredShirts(shirts);
    }
  }, [searchQuery, shirts]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" sx={{ my: 4 }}>
        Football Shirt Marketplace
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search for shirts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filteredShirts.length === 0 ? (
        <Typography>No shirts found matching your search.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredShirts.map((shirt) => (
            <Grid item xs={12} sm={6} md={4} key={shirt.id}>
              <Card>
                <CardActionArea component={Link} to={`/shirt/${shirt.id}`}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={shirt.imageUrl}
                    alt={shirt.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {shirt.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {shirt.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Owned by: {shirt.userDisplayName}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Marketplace;
