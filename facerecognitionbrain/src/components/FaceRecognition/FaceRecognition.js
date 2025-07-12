import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box, error }) => {
  return (
    <div
      className='center ma mt2'
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {error && (
        <div style={{
          color: '#ff4d4d',
          fontWeight: '600',
          fontSize: '1.2rem',
          marginBottom: '10px',
          textAlign: 'center',
          userSelect: 'none',
          fontFamily: 'Arial, sans-serif',
        }}>
          {error}
        </div>
      )}

      {imageUrl && (
        <img
          id="inputimage"
          alt=""
          src={imageUrl}
          style={{ width: '500px', height: 'auto', display: 'block' }}
        />
      )}

      {box && Array.isArray(box) && box.map((faceBox, i) => (
        <div
          key={i}
          className="bounding-box"
          style={{
            position: 'absolute',
            top: faceBox.topRow,
            right: faceBox.rightCol,
            bottom: faceBox.bottomRow,
            left: faceBox.leftCol,
            border: '3px solid #149df2',
            boxShadow: '0 0 10px #149df2',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        />
      ))}
    </div>
  );
};

export default FaceRecognition;
