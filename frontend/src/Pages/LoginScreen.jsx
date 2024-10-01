import React from 'react'
import './LoginScreen.css'
import InputField from '../Components/InputField'; 
import { SubmitButton } from '../Components/Buttons';

export default function LoginScreen() {
  return (
    <div className='container'>
        <div className="header">
            <div className="text">Yellow Pages</div>
            <div className="underline"></div>
        </div>
        <InputField type="email" placeholder="Email" /> 
        <InputField type="password" placeholder="Password" />
        <div className="submitContainer">
            <SubmitButton label="Login" onClick={() => console.log('Login clicked')} />
        </div>
        <div className="noAccount">Don't have an account? <span> Register</span></div>
    </div>    
  )
}

