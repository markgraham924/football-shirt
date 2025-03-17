import { useState, useRef, useEffect } from 'react';
import styles from '../styles/CameraCapture.module.css';
import ShirtOverlay from './ShirtOverlay';

const CameraCapture = ({ onCapture, overlayType }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [autoCropEnabled, setAutoCropEnabled] = useState(true);
  
  useEffect(() => {
    let mounted = true;
    
    async function enableStream() {
      try {
        const constraints = { 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (mounted) {
          setStream(mediaStream);
          setError(null);
          
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        }
      } catch (err) {
        if (mounted) {
          console.error('Error accessing camera:', err);
          setError('Could not access camera. Please check permissions.');
        }
      }
    }
    
    enableStream();
    
    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Get crop dimensions based on overlay type
  const getCropDimensions = (canvasWidth, canvasHeight, type) => {
    // These values are percentages of the canvas dimensions that match
    // the SVG viewBox (200x200) and the scaled-up path definitions in ShirtOverlay
    let cropSettings = {
      front: { x: 0.25, y: 0.10, width: 0.55, height: 0.80 },  // Adjusted for larger outline
      back: { x: 0.25, y: 0.10, width: 0.55, height: 0.80 },   // Adjusted for larger outline
      label: { x: 0.32, y: 0.28, width: 0.35, height: 0.45 }   // Adjusted for larger outline
    };
    
    // Get settings for current overlay type or use defaults
    const settings = cropSettings[type] || cropSettings.front;
    
    // Calculate actual pixel values
    return {
      x: Math.floor(canvasWidth * settings.x),
      y: Math.floor(canvasHeight * settings.y),
      width: Math.floor(canvasWidth * settings.width),
      height: Math.floor(canvasHeight * settings.height)
    };
  };
  
  const handleCapture = () => {
    if (!videoRef.current) return;
    
    setIsCapturing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      // Set canvas dimensions to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      let finalImageData;
      
      if (autoCropEnabled) {
        // Get crop dimensions based on overlay type
        const { x, y, width, height } = getCropDimensions(
          canvas.width,
          canvas.height,
          overlayType
        );
        
        // Create a new canvas for the cropped image
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = width;
        croppedCanvas.height = height;
        
        // Draw the cropped portion to the new canvas
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCtx.drawImage(
          canvas, 
          x, y, width, height,
          0, 0, width, height
        );
        
        finalImageData = croppedCanvas.toDataURL('image/jpeg');
      } else {
        // Use the full uncropped image
        finalImageData = canvas.toDataURL('image/jpeg');
      }
      
      onCapture(finalImageData);
    } catch (err) {
      console.error('Error capturing image:', err);
      setError('Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };
  
  const toggleAutoCrop = () => {
    setAutoCropEnabled(!autoCropEnabled);
  };
  
  return (
    <div className={styles.cameraWrapper}>
      {error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={styles.videoPreview} 
          />
          
          <ShirtOverlay type={overlayType} />
          
          <div className={styles.controls}>
            <button 
              onClick={handleCapture} 
              disabled={isCapturing || !stream} 
              className={styles.captureButton}
            >
              {isCapturing ? 'Capturing...' : 'Take Photo'}
            </button>
            
            <button 
              onClick={toggleAutoCrop}
              className={`${styles.autoCropToggle} ${autoCropEnabled ? styles.enabled : ''}`}
            >
              {autoCropEnabled ? 'Auto-Crop: ON' : 'Auto-Crop: OFF'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;
