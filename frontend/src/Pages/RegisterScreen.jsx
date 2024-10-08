import React, { useState } from 'react';
import styles from './RegisterScreen.module.css';
import InputField from '../Components/InputField'; 
import { SubmitButton } from '../Components/Buttons';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

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
    })

    console.log({
      file: selectedFile.name
    })

    try {
      // Send POST request to the backend
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          position: position,
          url: linkedinUrl,
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Register failed');
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

  }

  if (redirect) {
    return <Navigate to='/login' replace />;
  }

  return (
    <div className={styles.wrapper}> 
      <div className={styles.container}> 
          <div className={styles.header}> 
              <div className={styles.text}>Yellow Pages</div>
              <div className={styles.underline}></div> 
          </div>
          <form onSubmit={handleRegister}>
            <InputField type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} /> 
            <InputField type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} /> 
            <InputField placeholder="Current Position" value={position} onChange={(e) => setPosition(e.target.value)} /> 
            <InputField type="url" placeholder="LinkedIn URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} /> 

            <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> 
            <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <InputField type="password" placeholder="Retype Password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} />

            <InputField type="file" accept=".csv" onChange={(e) => setSelectedFile(e.target.files[0])} />

            <div className={styles.submitContainer}> 
              <SubmitButton label="Register" />
            </div>
          </form>

          <div className={styles.noAccount}> 
            Already have an account? <span><Link to="/login"> Login </Link></span>
          </div>
      </div> 
    </div>
  );
}