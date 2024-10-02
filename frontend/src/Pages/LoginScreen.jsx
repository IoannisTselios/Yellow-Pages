import React, { useState } from 'react'
import './LoginScreen.css'
import InputField from '../Components/InputField'; 
import { SubmitButton } from '../Components/Buttons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Send POST request to the backend
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      // If login is successful, handle response (e.g., redirect, save token)
      const data = await response.json();
      console.log('Login successful:', data);

      // Store the token or update UI
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="wrapper">
      <div className='container'>
          <div className="header">
              <div className="text">Yellow Pages</div>
              <div className="underline"></div>
          </div>
          <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> 
          <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="submitContainer">
              <SubmitButton label="Login" onClick={handleLogin} />
          </div>
          <div className="noAccount">Don't have an account? <span> Register</span> </div>
      </div> 
    </div>   
  )
}

