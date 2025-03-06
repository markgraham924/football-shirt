import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Box, 
  CircularProgress,
  CardActionArea
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getUserShirts, Shirt } from '../services/ShirtService';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const [shirts, setShirts] = useState<Shirt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileUser, setProfileUser] = useState<any>(null);
  const { currentUser, getUserProfile } = useAuth();
  const { userId } = useParams();
  
  const profileId = userId || (currentUser ? currentUser.uid : null);
  const isCurrentUserProfile = currentUser && (!userId || userId === currentUser.uid);

  useEffect(() => {
    async function loadProfile() {
      if (!profileId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Get user profile info
        if (!isCurrentUserProfile) {
          const userProfile = await getUserProfile(profileId);
          setProfileUser(userProfile);
        }
        
        // Get user's shirts
        const userShirts = await getUserShirts(profileId);
        setShirts(userShirts);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [profileId, isCurrentUserProfile, getUserProfile]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography color="error" sx={{ mt: 4 }}>{error}</Typography>
      </Container>
    );
  }

  if (!profileId) {
    return (
      <Container maxWidth="lg">
        <Typography sx={{ mt: 4 }}>Please log in to view your profile</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isCurrentUserProfile 
            ? "My Shirt Collection" 
            : `${profileUser?.displayName || 'User'}'s Collection`}
        </Typography>
        
        {shirts.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {isCurrentUserProfile 
              ? "You haven't added any shirts yet." 
              : "This user hasn't added any shirts yet."}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {shirts.map((shirt) => (
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
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
