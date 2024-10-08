import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './InputField.css'; 

export default function InputField({ type, placeholder, value, onChange, autoComplete }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="inputWrapper"> 
      {type === 'password' ? (
        <TextField
          variant="outlined"
          label={placeholder}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete || 'current-password'}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <TextField
          variant="outlined"
          label={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete || 'on'}
          fullWidth
        />
      )}
    </div>
  );
}
