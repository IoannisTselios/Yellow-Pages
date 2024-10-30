import React, { useEffect, useState } from "react";
import styles from './HomeScreen.module.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

export const HomeScreen = () => {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for conditional rendering
  const [selectedRow, setSelectedRow] = useState(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:8000/api/get_current_user', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('User not authenticated');
        }

        const content = await response.json();
        if (!content || !content.id) {
          throw new Error('User data is empty or invalid');
        }
        
        setName(content.first_name); // Set the user’s name if needed
        setLoading(false); // Stop loading once user is authenticated

      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate('/login');
      }
    })();
  }, [navigate]);

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
        throw new Error('Logout failed');
      }

      setRedirect(true);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (redirect) {
    return <Navigate to='/login' replace />;
  }

  // Only render the main content once loading is complete
  if (loading) {
    return <div>Loading...</div>; // Placeholder while waiting for authentication check
  }

  const getData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/get_connection_list/'
        // , {
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        // credentials: 'include',
      //   method: 'GET',
      //   headers: {
      //       'Authorization': `Bearer ${token}`
      //   }
      // }
      );
      if (!response.ok) {
        throw new Error('Data fetch failed');
      }

      const data = await response.json();
      console.log('Data fetch successful:', data);

    } catch (error) {
      console.error('Error during data fetch:', error);
    }
  };

  const rows = [
    { id: 1, col1: 'Bety Boo', linkedinUrl: 'https://www.linkedin.com/in/georgia-tsoukala-5144a4245/', col2: 'Jack, Henry, Mary', col3: 3, col4: 'Student', col5: 'Developer', col6: 'Junior', col7: 'Novo Nordisk', col8: 'Pharmaceutical' },
    { id: 2, col1: 'John Hex', linkedinUrl: 'https://www.linkedin.com/in/georgia-tsoukala-5144a4245/', col2: 'Henry, Mary', col3: 4, col4: 'Data Analyst', col5: 'Data Science', col6: 'Mid', col7: 'Hexagon', col8: 'Sales' },
    { id: 3, col1: 'Arthur Peterson', linkedinUrl: 'https://www.linkedin.com/in/georgia-tsoukala-5144a4245/', col2: 'Henry', col3: 2, col4: 'Change Management', col5: 'Communication', col6: 'Junior', col7: 'Novo Nordisk', col8: 'Pharmaceutical' },
    { id: 4, col1: 'Moby Dick', linkedinUrl: 'https://www.linkedin.com/in/georgia-tsoukala-5144a4245/', col2: 'Mary', col3: 5, col4: 'Product Owner', col5: 'Management', col6: 'CEO', col7: 'DontKnow', col8: 'Pharmaceutical' },
  ];

  const columns = [
    { field: "id", headerName: '#', hide: true, width: 50 },
    { 
      field: 'col1', 
      headerName: 'Name', 
      width: 150, 
      renderCell: (params) => (
        <div>
          <div>{params.value}</div>
          <a 
            href={params.row.linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ fontSize: '0.8em', color: '#0073b1' }}
          >
            View LinkedIn
          </a>
        </div>
      ),
    },
    { field: 'col2', headerName: 'Connections', width: 150 },
    { field: 'col3', headerName: 'Connection Strength', width: 150 }, 
    { field: 'col4', headerName: 'Position', width: 150 },
    { field: 'col5', headerName: 'Function', width: 150 },
    { field: 'col6', headerName: 'Seniority', width: 150 },
    { field: 'col7', headerName: 'Company', width: 150 },
    { field: 'col8', headerName: 'Industry', width: 150 },
  ];
 
  const handleRowClick = (params) => {
    setSelectedRow(params.row); 
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          <img src="Assets/image.png" alt="Logo" />
          <div className={styles.text}>Yellow Pages</div>
        </div>
        <Tooltip title="Logout" placement="left">
          <IconButton color="secondary" onClick={handleLogout}><ExitToAppRoundedIcon /></IconButton>
        </Tooltip>
         {/* <Button variant="outlined" color='secondary' size='small' onClick={handleLogout} endIcon={<ExitToAppRoundedIcon />}> Logout </Button> */}
      </div>
      <div className={styles.underline}></div>
      {/* <button onClick={getData}>Get the connections</button> */}
      <div className={styles.mainContent}>
        <DataGrid 
          style={{ borderRadius: '10px', background: '#fff'}} 
          rows={rows} 
          columns={columns} 
          checkboxSelection 
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          onRowClick={handleRowClick}
        />
        {/* Conditionally render the detail box */}
        {selectedRow && (
          <div className={styles.detailBox}>
            <h2>Details</h2>
            <p><strong>Name:</strong> {selectedRow.col1}</p>        
          {/* Add more fields if needed */}
          </div>
        )}
      </div>
    </div>
  );
}
