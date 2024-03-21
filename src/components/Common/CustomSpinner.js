import React from 'react';
import { Spinner } from 'react-bootstrap';
import './CustomSpinner.css';

function CustomSpinner() {
  return (
    <div className="overlay">
      <Spinner animation="border" variant="info" size="md" />
    </div>
  );
}

export default CustomSpinner;
