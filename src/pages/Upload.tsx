import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  TextField, 
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { addShirt } from '../services/ShirtService';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [shirtName, setShirtName] = useState('');
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !shirtName) {
      setError('Please provide both a name and image for your shirt');
      return;
    }
    
    if (!currentUser) {
      setError('You must be logged in to upload shirts');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Use the addShirt service function to upload the shirt
      await addShirt(shirtName, description, file);
      
      setSuccess(true);
      
      // Clear form after successful upload
      setShirtName('');
      setDescription('');
      setFile(null);
      setPreviewUrl(null);
      
      // Redirect to profile after a brief success message
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload shirt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" sx={{ my: 4 }}>
        Upload a New Shirt
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Shirt uploaded successfully! Redirecting to your profile...
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Shirt Name
            </Typography>
            <TextField
              fullWidth
              value={shirtName}
              onChange={(e) => setShirtName(e.target.value)}
              placeholder="e.g., Manchester United 2020 Home Kit"
              disabled={loading}
              required
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about your shirt..."
              disabled={loading}
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              component="label"
              disabled={loading}
            >
              Select Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </Button>
          </Box>
          
          {previewUrl && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Preview:
              </Typography>
              <img 
                src={previewUrl} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '300px' }}
              />
            </Box>
          )}
          
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            disabled={loading || !file || !shirtName || success}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                Uploading...
              </>
            ) : (
              'Upload Shirt'
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Upload;
