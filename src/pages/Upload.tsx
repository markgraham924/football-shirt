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
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Grid
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { addShirt } from '../services/ShirtService';
import InteractiveUpload from '../components/InteractiveUpload';
import { teams, leagues } from '../data/footballData';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [shirtName, setShirtName] = useState('');
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'traditional' | 'interactive'>('traditional');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [season, setSeason] = useState<string>('');
  const [kitType, setKitType] = useState<string>('');
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUploadMethodChange = (
    event: React.MouseEvent<HTMLElement>,
    newMethod: 'traditional' | 'interactive',
  ) => {
    if (newMethod !== null) {
      setUploadMethod(newMethod);
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleInteractiveComplete = (images: {
    front: string;
    back: string;
    label: string;
  }) => {
    setPreviewUrl(images.front);
    
    fetch(images.front)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "shirt-front.jpg", { type: "image/jpeg" });
        setFile(file);
      });
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
      
      await addShirt(
        shirtName, 
        description, 
        file, 
        {
          team: selectedTeam,
          league: selectedLeague,
          season,
          kitType
        }
      );
      
      setSuccess(true);
      
      setShirtName('');
      setDescription('');
      setFile(null);
      setPreviewUrl(null);
      setSelectedTeam('');
      setSelectedLeague('');
      setSeason('');
      setKitType('');
      
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
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Choose Upload Method
          </Typography>
          <ToggleButtonGroup
            value={uploadMethod}
            exclusive
            onChange={handleUploadMethodChange}
            aria-label="upload method"
          >
            <ToggleButton value="traditional" aria-label="traditional upload">
              Upload from Device
            </ToggleButton>
            <ToggleButton value="interactive" aria-label="interactive upload">
              Take Photos
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
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
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Shirt Metadata
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={teams}
                  value={selectedTeam}
                  onChange={(_, newValue) => setSelectedTeam(newValue || '')}
                  renderInput={(params) => 
                    <TextField 
                      {...params} 
                      label="Team" 
                      fullWidth 
                      disabled={loading}
                    />
                  }
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={leagues}
                  value={selectedLeague}
                  onChange={(_, newValue) => setSelectedLeague(newValue || '')}
                  renderInput={(params) => 
                    <TextField 
                      {...params} 
                      label="League" 
                      fullWidth 
                      disabled={loading}
                    />
                  }
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Season"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  placeholder="e.g., 2022-2023"
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={loading}>
                  <InputLabel>Kit Type</InputLabel>
                  <Select
                    value={kitType}
                    label="Kit Type"
                    onChange={(e) => setKitType(e.target.value)}
                  >
                    <MenuItem value="home">Home</MenuItem>
                    <MenuItem value="away">Away</MenuItem>
                    <MenuItem value="third">Third</MenuItem>
                    <MenuItem value="goalkeeper">Goalkeeper</MenuItem>
                    <MenuItem value="special">Special Edition</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          
          {uploadMethod === 'traditional' ? (
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
          ) : (
            <Box sx={{ mb: 3 }}>
              <InteractiveUpload onComplete={handleInteractiveComplete} />
            </Box>
          )}
          
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
