import React, { useEffect, useState } from "react";
import styles from './HomeScreen.module.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Chip, Divider, ListItemText } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

export const HomeScreen = () => {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for conditional rendering
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
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
    { 
      id: 1, 
      col1: 'Bety Boo', 
      linkedinUrl: 'https://www.linkedin.com/in/georgia-tsoukala-5144a4245/', 
      col2: 'Jack, Henry, Mary', 
      col3: 3, 
      col4: 'Student', 
      col5: 'Developer', 
      col6: 'Junior', 
      col7: 'Novo Nordisk', 
      col8: 'Pharmaceutical',
      location: 'Copenhagen', 
      bio: 'A passionate learner with a knack for technology.', 
      summary: 'Currently focused on building skills in full-stack development.'
    },
    { 
      id: 2, 
      col1: 'John Hex', 
      linkedinUrl: 'https://www.linkedin.com/in/georgia-tsoukala-5144a4245/', 
      col2: 'Henry, Mary', 
      col3: 4, 
      col4: 'Data Analyst', 
      col5: 'Data Science', 
      col6: 'Mid', 
      col7: 'Hexagon', 
      col8: 'Sales',
      location: 'Berlin', 
      bio: 'Experienced data analyst with a strong background in sales.', 
      summary: 'Enjoys uncovering insights that drive business growth.'
    },
    { 
      id: 3, 
      col1: 'Arthur Peterson', 
      linkedinUrl: 'https://www.linkedin.com/in/georgia-tsoukala-5144a4245/', 
      col2: 'Henry', 
      col3: 2, 
      col4: 'Change Management', 
      col5: 'Communication', 
      col6: 'Junior', 
      col7: 'Novo Nordisk', 
      col8: 'Pharmaceutical',
      location: 'Amsterdam', 
      bio: 'Communication specialist passionate about change management.', 
      summary: 'Strives to facilitate smooth transitions in complex projects.'
    },
    { 
      id: 4, 
      col1: 'Moby Dick', 
      linkedinUrl: 'https://www.linkedin.com/in/georgia-tsoukala-5144a4245/', 
      col2: 'Mary', 
      col3: 5, 
      col4: 'Product Owner', 
      col5: 'Management', 
      col6: 'CEO', 
      col7: 'DontKnow', 
      col8: 'Pharmaceutical',
      location: 'Stockholm', 
      bio: 'Innovative product owner with a vision for business growth.', 
      summary: 'Focuses on aligning products with customer needs and business goals.'
    },
    { 
      id: 5, 
      col1: 'Alice Wonderland', 
      linkedinUrl: 'https://www.linkedin.com/in/alice-wonderland', 
      col2: 'Bob, Charlie', 
      col3: 3, 
      col4: 'Marketing Specialist', 
      col5: 'Marketing', 
      col6: 'Senior', 
      col7: 'Wonder Corp', 
      col8: 'Entertainment',
      location: 'Paris', 
      bio: 'Creative marketer with a flair for storytelling.', 
      summary: 'Passionate about creating campaigns that resonate with audiences.'
    },
    { 
      id: 6, 
      col1: 'Charlie Brown', 
      linkedinUrl: 'https://www.linkedin.com/in/charlie-brown', 
      col2: 'Alice, David', 
      col3: 4, 
      col4: 'Financial Analyst', 
      col5: 'Finance', 
      col6: 'Mid', 
      col7: 'Peanuts Inc', 
      col8: 'Finance',
      location: 'New York', 
      bio: 'Finance enthusiast with a keen eye for detail.', 
      summary: 'Skilled in identifying financial trends and improving efficiency.'
    },
    { 
      id: 7, 
      col1: 'David Gray', 
      linkedinUrl: 'https://www.linkedin.com/in/david-gray', 
      col2: 'Charlie, Eve', 
      col3: 5, 
      col4: 'UX Designer', 
      col5: 'Design', 
      col6: 'Junior', 
      col7: 'Gray Matter', 
      col8: 'Tech',
      location: 'London', 
      bio: 'User-centric designer with a passion for simplicity.', 
      summary: 'Focuses on creating intuitive and accessible designs.'
    },
    { 
      id: 8, 
      col1: 'Eve White', 
      linkedinUrl: 'https://www.linkedin.com/in/eve-white', 
      col2: 'Alice, Charlie, David', 
      col3: 4, 
      col4: 'HR Manager', 
      col5: 'Human Resources', 
      col6: 'Senior', 
      col7: 'WhiteCo', 
      col8: 'Retail',
      location: 'San Francisco', 
      bio: 'Dedicated HR professional fostering positive workplaces.', 
      summary: 'Specializes in team building and talent acquisition strategies.'
    },
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

  const DrawerInfo = ({ selectedRow }) => (
    <Box sx={{ width: 700, color: '#fff' }} role="presentation">
      <div className={styles.drawerContainer}>

        <div className={styles.profile}>
          <h3 style={{ margin: 0 }}>{selectedRow.col1}</h3>
          <p style={{ margin: 0 }}>{selectedRow.location}</p>
          <a 
            href={selectedRow.linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ fontSize: '0.8em', color: '#B3B3B3' }}
            >
            LinkedIn Profile
          </a>
        </div>       

        <Divider sx={{ bgcolor: '#404040' }}/>

        <div className={styles.connections}>
          <Chip label="Markus" variant="outlined" color="secondary"/>
          <Chip label="Konstantina" variant="outlined" color="secondary"/>
        </div>    

        <Divider sx={{ bgcolor: '#404040' }}/>

        <div className={styles.bioSummary}>
            <p style={{ margin: 0 }}><strong>Bio:</strong> {selectedRow.bio}</p>
            <p style={{ margin: 0 }}><strong>Summary:</strong> {selectedRow.summary}</p>
        </div>

        <Divider sx={{ bgcolor: '#404040' }}/>

        <div className={styles.currentPositions}>
          <h4 style={{ margin: 0 }}>Current Positions</h4>
        </div>        

        <Divider sx={{ bgcolor: '#404040' }}/>

        <div className={styles.pastPositions}>
          <h4 style={{ margin: 0 }}>Current Positions</h4>
        </div> 

      </div> 
    </Box>
  );
 
  const handleRowClick = (params) => {
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
      {/* <button onClick={getData}>Get the connections</button> */}
      <div className={styles.mainContent}>
        <div className={styles.dataGridContainer}>
          <DataGrid 
            style={{ borderRadius: '10px', background: '#fff'}} 
            rows={rows} 
            columns={columns} 
            checkboxSelection 
            disableRowSelectionOnClick
            getRowHeight={() => 'auto'}
            onRowClick={handleRowClick}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 'bold',
              }
            }}
          />
        </div>

        {/* Conditionally render the details container below the table
        {selectedRow && (
          <div className={styles.detailsContainer}>
            <div className={styles.personalDetails}>
              <h2>{selectedRow.col1}</h2>
              <p><strong>Location:</strong> {selectedRow.location}</p>
              <p><strong>Bio:</strong> {selectedRow.bio}</p>
              <p><strong>Summary:</strong> {selectedRow.summary}</p>
            </div>
            
            <div className={styles.companyDetails}>
              <h2>Company info</h2>
              <p><strong>Company:</strong> {selectedRow.col7}</p>
              <p><strong>Headquarters: Athens</strong></p>
              <p><strong>Size: 200</strong></p>
              <p><strong>Year Founded: 2015</strong> </p>
            </div>
          </div>
        )} */}

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
