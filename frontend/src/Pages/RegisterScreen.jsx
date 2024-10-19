import React, { useState } from 'react';
import styles from './RegisterScreen.module.css';
import InputField from '../Components/InputField'; 
import Button from '@mui/material/Button';
import { Link, Navigate } from 'react-router-dom';

export const RegisterScreen = () => {
  const [redirect, setRedirect] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log({
      firstName,
      lastName,
      position,
      linkedinUrl,
      email,
      password
    });

    if (selectedFile) {
      console.log({ file: selectedFile.name });

      const isCSV = selectedFile.name.endsWith('.csv') || selectedFile.type === 'text/csv' || selectedFile.type === 'text/comma-separated-values';
      if (!isCSV) {
        console.log('The uploaded file is not a csv!')
        setSelectedFile(null);
        return;
      }

      setSelectedFile(selectedFile);
    }

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          position,
          url: linkedinUrl,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Register failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      setRedirect(true);
      
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  if (redirect) {
    return <Navigate to='/login' replace />;
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
              <div className={styles.text}>Create account</div>
              <div className={styles.underline}></div> 
          </div>

          <form onSubmit={handleRegister}>
            <div className={styles.formGrid}>
              <InputField 
                type="text" 
                placeholder="First Name" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                autoComplete="given-name"
                required
              /> 
              <InputField 
                type="text" 
                placeholder="Last Name" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                autoComplete="family-name" 
                required
              /> 
              <InputField 
                type="text"
                placeholder="Current Position" 
                value={position} 
                onChange={(e) => setPosition(e.target.value)} 
                autoComplete="off" 
                required
              /> 
              <InputField 
                type="url" 
                placeholder="LinkedIn URL" 
                value={linkedinUrl} 
                onChange={(e) => setLinkedinUrl(e.target.value)} 
                autoComplete="off" 
                required
              /> 
              <InputField 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                autoComplete="email" 
                required
              /> 
              <InputField 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                autoComplete="new-password" 
                required
              />
              <InputField 
                type="password" 
                placeholder="Retype Password" 
                value={rePassword} 
                onChange={(e) => setRePassword(e.target.value)} 
                autoComplete="new-password" 
                required
              />
              <InputField 
                type="file" 
                placeholder="Upload CSV" 
                accept=".csv" 
                onChange={(e) => setSelectedFile(e.target.files[0])} 
              />
            </div>
            <div className={styles.submitContainer}> 
              <Button type='submit' variant="contained" color='primary' size='large'>Register</Button>
            </div>
          </form>

          <div className={styles.noAccount}> 
            Already have an account? <span><Link to="/login"> Login </Link></span>
          </div>
          
        </div> 
      </div>
    </div>
  );
}
