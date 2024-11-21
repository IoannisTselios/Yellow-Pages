import React, { useEffect, useState } from "react";
import styles from './HomeScreen.module.css';
import DrawerInfo from '../Components/DrawerInfo'; 

import { Navigate, useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { Button, CircularProgress, Drawer, IconButton, LinearProgress, Tooltip } from '@mui/material';

import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'; 

import { Filters } from "../Components/Filters";
import { useFilters } from "../Components/FiltersContext";

export const HomeScreen = () => {
  const { filterValues, updateFilterValues } = useFilters();

  const [loadingData, setLoadingData] = useState(false);  //Loading while the endpoint is getting the filtered data

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

//   const rows = [
//     {
//   first_name: "John",
//   last_name: "Doe",
//   location: "San Francisco, CA",
//   "connection_strength": 0,
//   url: "https://www.linkedin.com/in/johndoe/1",
//   connected_with: ["Markus", "Konstantina", "Emily", "Sofia"],
//   bio: "John is a software engineer with over 10 years of experience in building scalable web applications.",
//   summary: "Specializes in front-end development and creating user-friendly interfaces. Passionate about mentoring junior developers.",
//   main_role: {
//     position: "Lead Frontend Developer",
//     start_date: "2020-05-15", // YYYY-MM-DD
//     company: "Tech Solutions Inc.",
//     industry: "Software Development",
//     company_size: "201-500",
//     year_founded: 2010,
//     location: "San Francisco, CA"
//   },
//   other_roles: [
//     {
//       position: "Frontend Developer",
//       start_date: "2018-03-10",
//       company: "Web Creatives Ltd.",
//       industry: "Web Development",
//       company_size: "51-200",
//       year_founded: 2012,
//       location: "New York, NY"
//     },
//     {
//       position: "UI/UX Designer",
//       start_date: "2015-08-01",
//       company: "Creative Minds Studio",
//       industry: "Design Services",
//       company_size: "11-50",
//       year_founded: 2008,
//       location: "Los Angeles, CA"
//     }
//   ],
//   past_roles: [
//     {
//       position: "Junior Frontend Developer",
//       start_date: "2012-06-01",
//       end_date: "2015-07-31",
//       company: "Startup Hub",
//       industry: "Tech Startups",
//       company_size: "1-10",
//       year_founded: 2011,
//       location: "Austin, TX"
//     },
//     {
//       position: "Intern",
//       start_date: "2011-01-01",
//       end_date: "2012-05-31",
//       company: "Digital Innovators",
//       industry: "IT Services",
//       company_size: "51-200",
//       year_founded: 2005,
//       location: "Boston, MA"
//     }
//   ]
// },
//         {
//             "first_name": "Amy",
//             "last_name": "Soricelli",
//             "location": "New York, New York, United States",
//             "connection_strength": 0,
//             "url": "https://www.linkedin.com/in/amysoricelli",
//             "bio": "Vice President, Career Services",
//             "summary": "A lifetime of  Compassionate Recruiting for all levels of office support staff.    \n\nStrong partnerships with a loyal band of clients and candidates:  \n\n*27,450+ LinkedIn connections/ 28,955 followers. \n\n\"Placed\" 5,000+  people in .various roles and industries.\n\nManagement and support of a dynamic team of Career Service professionals.  \n\nCustomer relations;  Student engagement\n\nVirtual workshops on all aspects of job search and career readiness.\n\nDedicated assistance with the process of career development for all alumni from all programs.\n\nA member of numerous committees related to Student Success, Community Service, Strategic Planning, Retention, and Social Media\n\nMentor for the Leadership Berkeley Program.\n\nI believe in building strong relationships, listening effectively, and acting quickly but compassionately.\n*In order for me to be a happy person -  each day must include employment assistance of some kind.",
//             "connected_with": [
//                 "Nico"
//             ],
//             "main_role": null,
//             "other_roles": [],
//             "past_roles": [],
//             "functions": []
//         },
//         {
//             "first_name": "Dylan",
//             "last_name": "Wolff",
//             "location": "Oslo, Oslo, Norway",
//             "connection_strength": 0,
//             "url": "https://www.linkedin.com/in/dylan-wolff-oslo",
//             "bio": "Senior Investment Professional and Business Executive",
//             "summary": "I am a senior investment professional and business executive with over 30 years of international experience in private equity, secondaries, venture, equities, portfolio management, asset allocation, infrastructure, startups, fintech, impact investing, sustainable finance, hedge funds, management consulting and law. \n\nI was previously a partner at NorgesInvestor, an Engagement Manager (Project Leader) at McKinsey, the Chief Investment Officer at UNI Pensjon, and a corporate lawyer at Telenor. I currently advise the CEO of Capassa, a B2B SaaS fintech scaleup.\n\nI hold degrees in business and law from leading Canadian universities, in addition to a \"Mini-MBA\" education from McKinsey and courses in many subjects including sustainable finance, AI, negotiations, valuation, and many more. \n\nI am originally from Canada, but have been living in Norway since 1993. I speak and write fluent English and Norwegian, as well as intermediate French and basic Spanish.\n\nI can be reached at dylanwolff01@gmail.com.",
//             "connected_with": [
//                 "Mads"
//             ],
//             "main_role": null,
//             "other_roles": [],
//             "past_roles": [],
//             "functions": []
//         },
//   ];

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

        {/* Filters */}
        <div className={styles.filtersContainer}>
          <Filters
            setLoadingData={setLoadingData}
            locations={locations}
            positions={positions}
            functions={functions}
            industries={industries}
            hqs={headquarters}
            connections={connections}
          />
        </div>
  
        {/* Data Table */}
        <div className={styles.dataGridContainer}>
          {loadingData ? (
            // Show loading indicator while loading data
            <LinearProgress />
            // <CircularProgress size={80} />
          ) : filterValues.filteredData.length > 0 ? (
            // Show the DataGrid if there is data
            <DataGrid
              getRowId={(row) => row.url}
              style={{ borderRadius: '10px' }}
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
          ) : (
            // Show no data message if there is no data
            <p className={styles.noDataMessage}>No results. Try adjusting the filters!</p>
          )}
        </div>
      </div>
  
      {/* Drawer */}
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

