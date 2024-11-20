import React, { useState } from 'react';
import styles from './LoginScreen.module.css';
import InputField from '../Components/InputField'; 
import { Link, Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function LoginScreen() {
  const [redirect, setRedirect] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();  // Prevent the default form submission

    console.log({
      email,
      password
    });

    try {
      // Send POST request to the backend
      const response = await fetch('http://localhost:80/api/login', { //'http://localhost:80/api/login', {
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
    <div className={styles.wrapper}>

      <div className={styles.leftSide}> 
        <div className={styles.appName}>Yellow Pages</div>
        <div className={styles.motto}>Our motto goes here</div>
      </div>

      <div className={styles.rightSide}> 
        <div className={styles.container}>

          <div className={styles.header}>
            <div className={styles.text}>Welcome back</div>
            <div className={styles.underline}></div>
          </div>

          <form onSubmit={handleLogin}>
            <InputField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <InputField
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />  
            <div className={styles.submitContainer}>  
              <Button type='submit' variant="contained" color='primary' size='large'>LOGIN</Button>
            </div> 
          </form> 

          <div className={styles.noAccount}> 
            Don't have an account yet? <span><Link to="/register"> Register </Link></span>
          </div>
          
        </div> 
      </div>
    </div>
  );
}  