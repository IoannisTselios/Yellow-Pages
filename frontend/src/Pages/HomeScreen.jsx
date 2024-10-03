import React, { useEffect, useState } from "react"
import { SubmitButton } from "../Components/Buttons"
import { Navigate } from 'react-router-dom';

export const HomeScreen = () => {
  const [redirect, setRedirect] = useState(false);

  const [name, setName] = useState('')

  useEffect(() => {
    // (
    //   async () => {
    //     const response = await fetch('http://localhost:8000/api/get_current_user', {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       credentials: 'include',
    //     });

    //     const content = await response.json();

    //     setName(content.name);
    //   }
     
    // )();
  })

  const handleLogout = async () => {
    try {
      const logout = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
     
      if (!logout.ok) {
        throw new Error('Login failed');
      }

      // If logout is successful, handle response (e.g., redirect, save token)
      const data = await logout.json();

      console.log('Logout successful:', data);

      setRedirect(true);

    } catch (error) {
      console.error('Error during logout:', error);
    }

  } 

  if (redirect) {
    return <Navigate to='/login' replace />;
  }

  return (
    <div>
        <p>HOME PAGE</p>
        <SubmitButton label='Logout' onClick={handleLogout}></SubmitButton>
    </div>
  );
}
