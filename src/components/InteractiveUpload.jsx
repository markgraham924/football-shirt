import { useState } from 'react';
import CameraCapture from './CameraCapture';
import styles from '../styles/InteractiveUpload.module.css';

const CAPTURE_STAGES = {
  FRONT: 'front',
  BACK: 'back',
  LABEL: 'label',
  REVIEW: 'review',
};

export default function InteractiveUpload({ onComplete }) {
  const [currentStage, setCurrentStage] = useState(CAPTURE_STAGES.FRONT);
  const [capturedImages, setCapturedImages] = useState({
    front: null,
    back: null,
    label: null,
  });
  const [retakingStage, setRetakingStage] = useState(null);
  
  const handleCapture = (image) => {
    // Update the captured images with the new image
    setCapturedImages(prev => ({
      ...prev,
      [retakingStage || currentStage]: image
    }));
    
    // If we're retaking an image, go straight back to review
    if (retakingStage) {
      setCurrentStage(CAPTURE_STAGES.REVIEW);
      setRetakingStage(null);
      return;
    }
    
    // Normal flow: advance to next stage
    if (currentStage === CAPTURE_STAGES.FRONT) {
      setCurrentStage(CAPTURE_STAGES.BACK);
    } else if (currentStage === CAPTURE_STAGES.BACK) {
      setCurrentStage(CAPTURE_STAGES.LABEL);
    } else if (currentStage === CAPTURE_STAGES.LABEL) {
      setCurrentStage(CAPTURE_STAGES.REVIEW);
    }
  };
  
  const getStageInstructions = () => {
    if (retakingStage) {
      return `Retaking ${retakingStage} shot`;
    }
    
    switch (currentStage) {
      case CAPTURE_STAGES.FRONT:
        return "Align the front of the shirt within the outline";
      case CAPTURE_STAGES.BACK:
        return "Now capture the back of the shirt";
      case CAPTURE_STAGES.LABEL:
        return "Finally, take a clear photo of the label";
      case CAPTURE_STAGES.REVIEW:
        return "Review your images before submitting";
      default:
        return "";
    }
  };
  
  const handleSubmit = () => {
    onComplete(capturedImages);
  };
  
  const handleRetake = (stage) => {
    // Set which stage we're retaking and switch to camera view
    setRetakingStage(stage);
    
    // This temporarily changes the current stage to the retaking stage
    // but we'll return to REVIEW after capture
    setCurrentStage(stage);
  };
  
  if (currentStage === CAPTURE_STAGES.REVIEW) {
    return (
      <div className={styles.reviewContainer}>
        <h2>Review Your Images</h2>
        <div className={styles.imagesGrid}>
          {Object.entries(capturedImages).map(([stage, image]) => (
            <div key={stage} className={styles.imageContainer}>
              <h3>{stage.charAt(0).toUpperCase() + stage.slice(1)}</h3>
              <img src={image} alt={`${stage} view`} className={styles.reviewImage} />
              <button onClick={() => handleRetake(stage)} className={styles.retakeButton}>
                Retake
              </button>
            </div>
          ))}
        </div>
        <button onClick={handleSubmit} className={styles.submitButton}>
          Submit Images
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <h2>Upload Shirt Images</h2>
      <p className={styles.instructions}>{getStageInstructions()}</p>
      
      <div className={styles.cameraContainer}>
        <CameraCapture 
          onCapture={handleCapture}
          overlayType={retakingStage || currentStage}
        />
      </div>
      
      <div className={styles.progress}>
        <div className={`${styles.step} ${currentStage === CAPTURE_STAGES.FRONT ? styles.active : ''}`}>Front</div>
        <div className={`${styles.step} ${currentStage === CAPTURE_STAGES.BACK ? styles.active : ''}`}>Back</div>
        <div className={`${styles.step} ${currentStage === CAPTURE_STAGES.LABEL ? styles.active : ''}`}>Label</div>
        <div className={`${styles.step} ${currentStage === CAPTURE_STAGES.REVIEW ? styles.active : ''}`}>Review</div>
      </div>
    </div>
  );
}
