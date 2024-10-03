import React, { useState } from 'react'
import './LoginScreen.css'
import InputField from '../Components/InputField'; 
import { SubmitButton } from '../Components/Buttons';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

export default function LoginScreen() {
  const [redirect, setRedirect] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log({
      email,
      password
    })

    try {
      // Send POST request to the backend
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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

      // Store the token or update UI
      // localStorage.setItem('accessToken', data.access);
      // localStorage.setItem('refreshToken', data.refresh);

      console.log('Login successful:', data);

      setRedirect(true);
      
    } catch (error) {
      console.error('Error during login:', error);
    }

  };

  if (redirect) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className="wrapper">
      <div className="container">
          <div className="header">
              <div className="text">Yellow Pages</div>
              <div className="underline"></div>
          </div>
          <form onSubmit={handleLogin}>
            <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> 
            <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="submitContainer">  
              <SubmitButton label="Login"/>
            </div>
          </form>
          <div className="noAccount">Don't have an account yet? <span><Link to="/register"> Register </Link></span></div>
      </div> 
    </div>   
  )
}

