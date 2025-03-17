import React from 'react';
import styles from '../styles/ShirtOverlay.module.css';

const ShirtOverlay = ({ type }) => {
  // Create better and more accurate SVG outlines for each type
  let svgPath = '';
  let instructions = '';
  
  switch (type) {
    case 'front':
      // Scaled up front shirt outline with collar (20% larger)
      svgPath = 'M 60,20 L 140,20 C 145,20 150,25 150,30 L 150,50 L 160,60 L 160,70 L 150,80 L 150,180 L 50,180 L 50,80 L 40,70 L 40,60 L 50,50 L 50,30 C 50,25 55,20 60,20 Z';
      instructions = 'Position the front of shirt within the outline';
      break;
    case 'back':
      // Scaled up back shirt outline (20% larger)
      svgPath = 'M 60,20 L 140,20 C 145,20 150,25 150,30 L 150,50 L 160,60 L 160,70 L 150,80 L 150,180 L 50,180 L 50,80 L 40,70 L 40,60 L 50,50 L 50,30 C 50,25 55,20 60,20 Z';
      instructions = 'Position the back of shirt within the outline';
      break;
    case 'label':
      // Scaled up label shape (20% larger)
      svgPath = 'M 65,55 L 135,55 L 135,145 L 100,145 L 95,150 L 90,145 L 65,145 Z';
      instructions = 'Center the label in the outline';
      break;
    default:
      return null;
  }
  
  return (
    <div className={styles.overlayWrapper}>
      <svg className={styles.overlaySvg} viewBox="0 0 200 200">
        {/* Semi-transparent mask for outside the outline */}
        <mask id="outlineMask">
          <rect width="100%" height="100%" fill="white" />
          <path d={svgPath} fill="black" />
        </mask>
        
        <rect 
          width="100%" 
          height="100%" 
          fill="rgba(0,0,0,0.5)" 
          mask="url(#outlineMask)" 
        />
        
        {/* The visible outline - made thicker for better visibility */}
        <path 
          d={svgPath} 
          className={styles.outlinePath} 
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeDasharray="none"
          filter="drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.9))"
        />
      </svg>
      
      {/* Instructions text */}
      <div className={styles.instructions}>
        {instructions}
      </div>
    </div>
  );
};

export default ShirtOverlay;
