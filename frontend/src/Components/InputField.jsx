import React from 'react';
import './InputField.css'; 

export default function InputField({ type, placeholder }) {
  return (
    <div className="inputWrapper"> 
      <div className="inputContainer"> 
        <input type={type} placeholder={placeholder} /> 
      </div>
    </div>
  );
}