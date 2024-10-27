import React, { useEffect, useState } from "react";
import styles from './HomeScreen.module.css';
import { Navigate } from 'react-router-dom';
import { Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

export const HomeScreen = () => {
  const [redirect, setRedirect] = useState(false);

  const [name, setName] = useState('')

  useEffect(() => {
    (
      async () => {
        const response = await fetch('http://localhost:8000/api/get_current_user', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const content = await response.json();

        setName(content.first_name);
        // console.log('Here is the name', content.first_name)
      }
     
    )();
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

  const getData = async () => {
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZXhwIjoxNzI5Njg0MjAzLCJpYXQiOjE3Mjk2ODA2MDN9.8DPnmDqejPWz_zaQqYWPO5HPfalp2ExB3wSk3hwM1_Y"; 

      const response = await fetch('http://localhost:8000/api/get_connection_list/', {
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        // credentials: 'include',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
     
      if (!response.ok) {
        throw new Error('Data fetch failed');
      }

      const data = await response.json();

      console.log('Data fetch successful:', data);

    } catch (error) {
      console.error('Error during data fetch:', error);
    }

  } 

  const rows = [
    { id: 1, col1: 'Bety Boo', col2: 'Jack, Henry, Mary', col3: 'Student', col4: 'Developer', col5: 'Junior', col6: 'Novo Nordisk', col7: 'Pharmaceutical' },
    { id: 2, col1: 'John Hex', col2: 'Henry, Mary', col3: 'Data Analyst', col4: 'Data Science', col5: 'Mid', col6: 'Hexagon', col7: 'Sales' },
    { id: 3, col1: 'Arthur Peterson', col2: 'Henry', col3: 'Change Management', col4: 'Communication', col5: 'Junior', col6: 'Novo Nordisk', col7: 'Pharmaceutical' },
    { id: 4, col1: 'Moby Dick', col2: 'Mary', col3: 'Product Owner', col4: 'Management', col5: 'CEO', col6: 'DontKnow', col7: 'Pharmaceutical' },
  ];

  const columns = [
    { field: "id", headerName: '#', hide: true, width: 50 },
    { field: 'col1', headerName: 'Name', width: 150},
    { field: 'col2', headerName: 'Connections', width: 150 },
    { field: 'col3', headerName: 'Position', width: 150 },
    { field: 'col4', headerName: 'Function', width: 150 },
    { field: 'col5', headerName: 'Seniority', width: 150 },
    { field: 'col6', headerName: 'Company', width: 150 },
    { field: 'col7', headerName: 'Industry', width: 150 },
  ];

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          <img src="Assets\image.png" alt="Logo" />
          <div className={styles.text}>Yellow Pages</div>
        </div>
        <Tooltip title="Logout" placement="left">
          <IconButton color="secondary" onClick={handleLogout}><ExitToAppRoundedIcon /></IconButton>
        </Tooltip>
        {/* <Button variant="outlined" color='secondary' size='small' onClick={handleLogout} endIcon={<ExitToAppRoundedIcon />}> Logout </Button> */}
      </div>
      <div className={styles.underline}></div>
      <div className={styles.mainContent}>
  
        <DataGrid style={{ borderRadius: '10px', background: '#fff'}} rows={rows} columns={columns} checkboxSelection disableRowSelectionOnClick/>

        


      </div>
    </div>
  );
}
