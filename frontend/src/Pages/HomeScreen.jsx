import React, { useEffect, useState } from "react";
import styles from './HomeScreen.module.css';
import DrawerInfo from '../Components/DrawerInfo'; 

import { Navigate, useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { Button, Drawer, IconButton, Tooltip } from '@mui/material';

import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'; 

import { Filters } from "../Components/Filters";
import { useFilters } from "../Components/FiltersContext";

export const HomeScreen = () => {
  const { filterValues, updateFilterValues } = useFilters();

  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for conditional rendering
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  // const [name, setName] = useState('');
  const [dataRows, setDataRows] = useState([]);

  const navigate = useNavigate();

  // saving the values of the filters
  const [locations, setLocations] = useState([]);
  const [positions, setPositions] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [headquarters, setHeadquarters] = useState([]);
  const [connections, setConnections] = useState([]);


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

  useEffect(() => {
    (async () => {

      try {
        const resp_loc = await fetch('http://localhost:80/api/get_locations', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!resp_loc.ok) {
          throw new Error('Error fetching locations');
        }

        const data_loc = await resp_loc.json();
        setLocations(data_loc.locations);

      } catch (error) {
        console.error("Locations fetch failed:", error);
      }

      try {
        const resp_pos = await fetch('http://localhost:80/api/get_positions', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!resp_pos.ok) {
          throw new Error('Error fetching positions');
        }

        const data_pos = await resp_pos.json();
        setPositions(data_pos.positions);

      } catch (error) {
        console.error("Locations fetch failed:", error);
      }

      try {
        const resp_func = await fetch('http://localhost:80/api/get_functions', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!resp_func.ok) {
          throw new Error('Error fetching functions');
        }

        const data_func = await resp_func.json();
        setFunctions(data_func.functions);

      } catch (error) {
        console.error("Functions fetch failed:", error);
      }

      try {
        const resp_comp = await fetch('http://localhost:80/api/get_company_metadata', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!resp_comp.ok) {
          throw new Error('Error fetching company metadata');
        }

        const data_comp = await resp_comp.json();
        setIndustries(data_comp.industries);
        setHeadquarters(data_comp.headquarters);

      } catch (error) {
        console.error("Company metadata fetch failed:", error);
      }

      try {
        const resp_conn = await fetch('http://localhost:80/api/get_users', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!resp_conn.ok) {
          throw new Error('Error fetching connections');
        }

        const data_conn = await resp_conn.json();
        setConnections(data_conn.users);

      } catch (error) {
        console.error("Connections fetch failed:", error);
      }

    })();
  }, [loading])

  const handleLogout = async () => {
    try {
      const logout = await fetch('http://localhost:80/api/logout', {
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

  // const getData = async () => {
  //   try {
  //     const response = await fetch('http://localhost:80/api/get_connection_list/', {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //     });

  //     if (!response.ok) {
  //       throw new Error('Data fetch failed');
  //     }

  //     const data = await response.json();
  //     setDataRows(data.results);
      
  //     console.log('Data fetch successful:', data);
  //     console.log('here', data.results)
  //     console.log('this shit', dataRows)

  //   } catch (error) {
  //     console.error('Error during data fetch:', error);
  //   }
  // };

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
    { 
      field: 'industry', 
      headerName: 'Industry', 
      renderCell: (params) => (
        <div>
          {params.row.main_role ? params.row.main_role.industry : 'N/A'}
        </div>
      ),
      width: 150 },
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
         {/* <Button variant="contained" color="primary" sx={{ marginRight: '16px'}} onClick={getData}>Get Data</Button> */}
        <div className={styles.filtersContainer}>
          <Filters locations={locations} positions={positions} functions={functions} industries={industries} hqs={headquarters} connections={connections}></Filters>
        </div>

        <div className={styles.dataGridContainer}>
          { filterValues.filteredData.length > 0 &&
          <DataGrid 
            getRowId={(row) => row.url}
            style={{ borderRadius: '10px'}} 
            rows={filterValues.filteredData} 
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

