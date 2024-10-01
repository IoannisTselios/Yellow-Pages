import React from 'react';
import './Buttons.css'; 

// Submit Button
export const SubmitButton = ({ label, onClick }) => {
  return (
    <div className="submitButton" onClick={onClick}>
      {label}
    </div>
  );
};