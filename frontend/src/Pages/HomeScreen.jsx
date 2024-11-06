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

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import HubIcon from '@mui/icons-material/Hub';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export const HomeScreen = () => {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for conditional rendering
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  // for the filters tabs
  const [value, setValue] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }; 

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
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'col2', headerName: 'Connections', width: 150 },
    { field: 'col3', headerName: 'Connection Strength', width: 120 }, 
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
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0 }}>Bio</h4>
            <p style={{ margin: 0, paddingTop: 5 }}>{selectedRow.bio}</p>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0 }}>Summary</h4>
            <p style={{ margin: 0, paddingTop: 5 }}>{selectedRow.summary}</p>
          </div>
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

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ padding: '16px' }}>{children}</Box>}
      </div>
    );
  }

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
        <div className={styles.detailsContainer}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="icon tabs"
                sx={{ minHeight: '48px'}}
              >
                <Tab icon={<PersonIcon />} iconPosition="start" label="Person" sx={{ minHeight: '48px', paddingTop: '0px', paddingBottom: '0px', textTransform: 'none',
                  //  "&.Mui-selected": { color: "#ff0000", },
                   }}/>
                <Tab icon={<BusinessIcon />} iconPosition="start" label="Company" sx={{ minHeight: '48px', paddingTop: '0px', paddingBottom: '0px', textTransform: 'none',}}/>
                <Tab icon={<HubIcon />} iconPosition="start" label="General" sx={{ minHeight: '48px', paddingTop: '0px', paddingBottom: '0px', textTransform: 'none',}}/>
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={top100Films}
                getOptionLabel={(option) => option.title}
                // defaultValue={[top100Films[13]]}
                filterSelectedOptions
                style={{ display: 'inline-block', width: '250px', marginRight: '12px' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Position"
                    // placeholder="Favorites"
                  />
                )}
              />
              <Autocomplete
                multiple
                id="tags-outlined"
                options={top100Films}
                getOptionLabel={(option) => option.title}
                // defaultValue={[top100Films[13]]}
                filterSelectedOptions
                style={{ display: 'inline-block', width: '250px'}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Function"
                    // placeholder="Favorites"
                  />
                )}
              />
              <FormControlLabel
                value="bottom"
                control={<Switch color="primary" />}
                label="Include past"
                labelPlacement="top"
                sx={{ verticalAlign: 'top'}}
              />
              <Autocomplete
                multiple
                id="tags-outlined"
                options={top100Films}
                getOptionLabel={(option) => option.title}
                // defaultValue={[top100Films[13]]}
                filterSelectedOptions
                style={{ display: 'inline-block', width: '250px', marginRight: '12px' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seniority"
                    // placeholder="Favorites"
                  />
                )}
              />
              <Autocomplete
                multiple
                id="tags-outlined"
                options={top100Films}
                getOptionLabel={(option) => option.title}
                // defaultValue={[top100Films[13]]}
                filterSelectedOptions
                style={{ display: 'inline-block', width: '250px' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Industry"
                    // placeholder="Favorites"
                  />
                )}
              />
              <FormControlLabel
                value="bottom"
                control={<Switch color="primary" />}
                label="Include past"
                labelPlacement="top"
                sx={{ verticalAlign: 'top'}}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              Item Two
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              Item Three
            </CustomTabPanel>
          </Box>
        </div>

        <div className={styles.dataGridContainer}>
          <DataGrid 
            style={{ borderRadius: '10px'}} //, background: '#fff'
            rows={rows} 
            columns={columns} 
            checkboxSelection 
            disableRowSelectionOnClick
            disableSelectionOnClick
            getRowHeight={() => 'auto'}
            onRowClick={handleRowClick}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 'bold',
                whiteSpace: "normal", // Allows text to wrap
                lineHeight: 1.2,
              },
              "& .MuiDataGrid-columnHeader": {
                height: "auto",        // Allows the header row height to adjust automatically
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none", // Removes the border outline when a cell is focused
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none", // Removes the border outline when a cell is clicked or focused
              }
            }}
          />
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

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  {
    title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  {
    title: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983,
  },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
  },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];
