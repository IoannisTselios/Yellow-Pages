import React from 'react';
import './InputField.css'; 

export default function InputField({ type, placeholder, value, onChange  }) {
  return (
    <div className="inputWrapper"> 
      <div className="inputContainer"> 
        <input 
          type={type} 
          placeholder={placeholder} 
          value={value}
          onChange={onChange}
        /> 
      </div>
    </div>
  );
}