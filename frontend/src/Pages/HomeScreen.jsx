import React, { useEffect, useState } from "react";
import styles from './HomeScreen.module.css';
import DrawerInfo from '../Components/DrawerInfo'; 

import { Navigate, useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { Button, Drawer, IconButton, Tooltip } from '@mui/material';

import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'; 

import { Filters } from "../Components/Filters";

export const HomeScreen = () => {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for conditional rendering
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  // const [name, setName] = useState('');
  const [dataRows, setDataRows] = useState([]);


  const navigate = useNavigate();

  function getRowId(row) {
    return row.internalId;
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:80/api/get_current_user', {
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
        
        // setName(content.first_name); // Set the user’s name if needed
        setLoading(false); // Stop loading once user is authenticated

      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate('/login');
      }
    })();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const logout = await fetch('http://13.48.244.239:80/api/logout', {
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
      const response = await fetch('http://localhost:80/api/get_connection_list/?page=3', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Data fetch failed');
      }

      const data = await response.json();
      setDataRows(data.results);
      
      console.log('Data fetch successful:', data);
      console.log('here', data.results)
      console.log('this shit', dataRows)

    } catch (error) {
      console.error('Error during data fetch:', error);
    }
  };

  // const rows = [
  //   { 
  //     id: 1, 
  //     col1: 'Bety Boo', 
  //     linkedinUrl: 'https://www.linkedin.com/in/georgia-tsoukala-5144a4245/', 
  //     col2: 'Jack, Henry, Mary', 
  //     col3: 3, 
  //     col4: 'Student', 
  //     col5: 'Developer', 
  //     col6: 'Junior', 
  //     col7: 'Novo Nordisk', 
  //     col8: 'Pharmaceutical',
  //     location: 'Copenhagen', 
  //     bio: 'A passionate learner with a knack for technology.', 
  //     summary: 'Currently focused on building skills in full-stack development.'
  //   },
  //   { 
  //     id: 2, 
  //     col1: 'John Hex', 
  //     linkedinUrl: 'https://www.linkedin.com/in/georgia-tsoukala-5144a4245/', 
  //     col2: 'Henry, Mary', 
  //     col3: 4, 
  //     col4: 'Data Analyst', 
  //     col5: 'Data Science', 
  //     col6: 'Mid', 
  //     col7: 'Hexagon', 
  //     col8: 'Sales',
  //     location: 'Berlin', 
  //     bio: 'Experienced data analyst with a strong background in sales.', 
  //     summary: 'Enjoys uncovering insights that drive business growth.'
  //   },
  // ];

  const columns = [
    // { field: "id", headerName: '#', hide: true, width: 50 },
    { 
      field: 'first_name', 
      headerName: 'Name', 
      width: 150, 
      renderCell: (params) => (
        <div>
          <div>{params.value + ' ' + params.row.last_name}</div>
          <a 
            href={params.row.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ fontSize: '0.8em', color: '#0073b1' }}
          >
            View LinkedIn
          </a>
        </div>
      ),
    },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'connected_with', headerName: 'Connections', width: 150 },
    { field: 'connection_strength', headerName: 'Connection Strength', width: 120 }, 
    {
      field: 'position',
      headerName: 'Position',
      renderCell: (params) => (
        <div>
          {params.row.main_role ? params.row.main_role.position : 'N/A'}
        </div>
      ),

      // I do not know why the below is not working...
      // valueGetter: (params) => {
      //   console.log('ValueGetter Params:', params);
      //   return params?.row?.main_role ? params.row.main_role.position : 'N/A'
      // }, // Retrieves position from main_role
      width: 150
    },
    // { field: 'col5', headerName: 'Function', width: 150 },
    // { field: 'col6', headerName: 'Seniority', width: 150 },
    { 
      field: 'company', 
      headerName: 'Company', 
      renderCell: (params) => (
        <div>
          {params.row.main_role ? params.row.main_role.company : 'N/A'}
        </div>
      ),
      width: 150 },
    // { field: 'col8', headerName: 'Industry', width: 150 },
  ];
  
  const handleRowClick = (params) => {
    console.log(params.row)
    setSelectedRow(params.row); 
    setOpenDrawer(true);
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
      </div>
      <div className={styles.underline}></div>
      
      <div className={styles.mainContent}>
         <Button variant="contained" color="primary" sx={{ marginRight: '16px'}} onClick={getData}>Get Data</Button>
        <div className={styles.filtersContainer}>
          <Filters></Filters>
        </div>

        <div className={styles.dataGridContainer}>
          { dataRows.length > 0 &&
          <DataGrid 
            getRowId={(row) => row.url}
            style={{ borderRadius: '10px'}} 
            rows={dataRows} 
            columns={columns} 
            checkboxSelection 
            disableRowSelectionOnClick
            disableSelectionOnClick
            disableDensitySelector
            getRowHeight={() => 'auto'}
            onRowClick={handleRowClick}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                printOptions: { disableToolbarButton: true }                
              }
            }}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 'bold',
                whiteSpace: "normal",
                lineHeight: 1.2,
              },
              "& .MuiDataGrid-columnHeader": {
                height: "auto",
              },
              "& .MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
            }}
          />
          }
        </div>

      </div>
      <div>      
        <Drawer 
          open={openDrawer} 
          onClose={() => setOpenDrawer(false)} 
          anchor={'right'}
          sx={{ 
            "& .MuiDrawer-paper": { 
              backgroundColor: "#181818" 
            }
          }}
        >
          <DrawerInfo selectedRow={selectedRow} />
        </Drawer>
      </div>
    </div>
  );
}

