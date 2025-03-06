import React from 'react';

const EnvDebug: React.FC = () => {
  return (
    <div style={{ margin: '20px', padding: '10px', border: '1px solid #ccc' }}>
      <h3>Environment Variables:</h3>
      <pre>
        {JSON.stringify({
          FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
          ENV: process.env.REACT_APP_ENV,
        }, null, 2)}
      </pre>
    </div>
  );
};

export default EnvDebug;
