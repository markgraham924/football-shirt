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
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Divider,
  Paper,
  Autocomplete
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { Link } from 'react-router-dom';
import { getAllShirts, Shirt } from '../services/ShirtService';
import { teams, leagues } from '../data/footballData';

// Extend the Shirt type to include metadata
interface ShirtWithMetadata extends Shirt {
  metadata?: {
    team?: string;
    league?: string;
    season?: string;
    kitType?: string;
  };
}

const Marketplace: React.FC = () => {
  const [shirts, setShirts] = useState<ShirtWithMetadata[]>([]);
  const [filteredShirts, setFilteredShirts] = useState<ShirtWithMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New filter state variables
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedKitType, setSelectedKitType] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique seasons from shirts data
  const uniqueSeasons = [...new Set(shirts.map(shirt => 
    shirt.metadata?.season).filter(Boolean))];

  useEffect(() => {
    const fetchShirts = async () => {
      try {
        const allShirts = await getAllShirts();
        setShirts(allShirts as ShirtWithMetadata[]);
        setFilteredShirts(allShirts as ShirtWithMetadata[]);
      } catch (error) {
        console.error("Error fetching shirts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShirts();
  }, []);

  useEffect(() => {
    // Apply all filters: text search and metadata filters
    let filtered = [...shirts];
    
    // Text search filter
    if (searchQuery) {
      filtered = filtered.filter(shirt => 
        shirt.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        shirt.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Team filter
    if (selectedTeam) {
      filtered = filtered.filter(shirt => 
        shirt.metadata?.team === selectedTeam
      );
    }
    
    // League filter
    if (selectedLeague) {
      filtered = filtered.filter(shirt => 
        shirt.metadata?.league === selectedLeague
      );
    }
    
    // Season filter
    if (selectedSeason) {
      filtered = filtered.filter(shirt => 
        shirt.metadata?.season === selectedSeason
      );
    }
    
    // Kit type filter
    if (selectedKitType) {
      filtered = filtered.filter(shirt => 
        shirt.metadata?.kitType === selectedKitType
      );
    }
    
    setFilteredShirts(filtered);
  }, [searchQuery, selectedTeam, selectedLeague, selectedSeason, selectedKitType, shirts]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTeam('');
    setSelectedLeague('');
    setSelectedSeason('');
    setSelectedKitType('');
  };
  
  const activeFilterCount = [
    searchQuery, 
    selectedTeam, 
    selectedLeague, 
    selectedSeason, 
    selectedKitType
  ].filter(Boolean).length;

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

      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Search bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            <Button 
              variant="outlined" 
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterListIcon />}
              color={showFilters ? "primary" : "inherit"}
            >
              Filters
              {activeFilterCount > 0 && (
                <Chip 
                  size="small" 
                  label={activeFilterCount} 
                  sx={{ ml: 1 }}
                  color="primary"
                />
              )}
            </Button>
            
            {activeFilterCount > 0 && (
              <Button
                variant="text"
                color="error"
                onClick={clearAllFilters}
                startIcon={<ClearAllIcon />}
              >
                Clear
              </Button>
            )}
          </Box>
          
          {/* Filter section, conditionally shown */}
          {showFilters && (
            <>
              <Divider />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Autocomplete
                    options={teams}
                    value={selectedTeam}
                    onChange={(_, newValue) => setSelectedTeam(newValue || '')}
                    renderInput={(params) => 
                      <TextField {...params} label="Team" fullWidth />
                    }
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Autocomplete
                    options={leagues}
                    value={selectedLeague}
                    onChange={(_, newValue) => setSelectedLeague(newValue || '')}
                    renderInput={(params) => 
                      <TextField {...params} label="League" fullWidth />
                    }
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="season-filter-label">Season</InputLabel>
                    <Select
                      labelId="season-filter-label"
                      value={selectedSeason}
                      label="Season"
                      onChange={(e) => setSelectedSeason(e.target.value)}
                    >
                      <MenuItem value="">Any Season</MenuItem>
                      {uniqueSeasons.map((season) => (
                        <MenuItem key={season} value={season}>
                          {season}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="kit-type-filter-label">Kit Type</InputLabel>
                    <Select
                      labelId="kit-type-filter-label"
                      value={selectedKitType}
                      label="Kit Type"
                      onChange={(e) => setSelectedKitType(e.target.value)}
                    >
                      <MenuItem value="">Any Type</MenuItem>
                      <MenuItem value="home">Home</MenuItem>
                      <MenuItem value="away">Away</MenuItem>
                      <MenuItem value="third">Third</MenuItem>
                      <MenuItem value="goalkeeper">Goalkeeper</MenuItem>
                      <MenuItem value="special">Special Edition</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Paper>

      {filteredShirts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">No shirts found matching your criteria.</Typography>
          <Button variant="text" onClick={clearAllFilters} sx={{ mt: 2 }}>
            Clear all filters
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">
              Showing {filteredShirts.length} shirts
            </Typography>
          </Box>
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
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {shirt.metadata?.team && (
                          <Chip label={shirt.metadata.team} size="small" variant="outlined" />
                        )}
                        {shirt.metadata?.season && (
                          <Chip label={shirt.metadata.season} size="small" variant="outlined" />
                        )}
                        {shirt.metadata?.kitType && (
                          <Chip 
                            label={shirt.metadata.kitType.charAt(0).toUpperCase() + shirt.metadata.kitType.slice(1)} 
                            size="small" 
                            variant="outlined" 
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Owned by: {shirt.userDisplayName}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Marketplace;
