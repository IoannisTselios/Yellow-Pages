import React from 'react'
import './LoginScreen.css'

export default function LoginScreen() {
  return (
    <div className='container'>
        <div className="header">
            <div className="text">Yellow Pages</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            <div className="input">
                <input type="email" placeholder='Email'/>
            </div>
        </div>
        <div className="inputs">
            <div className="input">
                <input type="password" placeholder='Password'/>
            </div>
        </div>
        <div className="submitContainer">
            <div className="submit">Login</div>
        </div>
        <div className="noAccount">Don't have an account?  <span>Register</span></div>
    </div>    
  )
}

