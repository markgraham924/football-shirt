import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Football Shirt Collection
        </Typography>
        <Typography variant="body1">
          A place where you can track your football shirt collection and explore shirts from other collectors.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
