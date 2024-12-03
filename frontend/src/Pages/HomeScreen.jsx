import React, { useEffect, useState } from "react";
import styles from './HomeScreen.module.css';
import DrawerInfo from '../Components/DrawerInfo'; 
import Search from "../Components/Search";
import CustomToolbar from '../Components/CustomToolbar';
import TruncatedTextCell from '../Components/TruncatedTextCell';
import { Filters } from "../Components/Filters";
import { useFilters } from "../Components/FiltersContext";
// import Switch from '@mui/material/Switch';
import { Navigate, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Drawer, LinearProgress, IconButton, Tooltip, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'; 

export const HomeScreen = () => {
  const [dataGridHeight, setDataGridHeight] = useState(0); //Sets the DataGrid height to the viewport height
  const { filterValues, updateFilterValues } = useFilters();

  const [loadingData, setLoadingData] = useState(false);  //Loading while the endpoint is getting the filtered data

  const [option, setOption] = React.useState('filter');
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for conditional rendering
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  // const [name, setName] = useState('');
  const [dataRows, setDataRows] = useState([]);

  const [loadingTable, setLoadingTable] = useState(false);

  const navigate = useNavigate();

  // saving the values of the filters
  const [locations, setLocations] = useState([]);
  const [positions, setPositions] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [headquarters, setHeadquarters] = useState([]);
  const [connections, setConnections] = useState([]);

  // Set the DataGrid height to the full viewport height
  useEffect(() => {
    const calculateHeight = () => {
        const viewportHeight = window.innerHeight;
        const adjustedHeight = viewportHeight - 24; // Subtract top and bottom margin (12px each)
        setDataGridHeight(adjustedHeight);
    };

    calculateHeight(); // Initial calculation
    window.addEventListener('resize', calculateHeight); // Handle browser resize
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://13.48.244.239:80/api/get_current_user', {
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
        const resp_loc = await fetch('http://13.48.244.239:80/api/get_locations', {
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
        const resp_pos = await fetch('http://13.48.244.239:80/api/get_positions', {
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
        const resp_func = await fetch('http://13.48.244.239:80/api/get_functions', {
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
        const resp_comp = await fetch('http://13.48.244.239:80/api/get_company_metadata', {
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
        const resp_conn = await fetch('http://13.48.244.239:80/api/get_users', {
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

  const refetchData = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", filterValues.paginationModel.page + 1); // always ask for the first page when the filters are applied
      queryParams.append("page_size", filterValues.paginationModel.pageSize); 

      let myURL = '';
      let response = {};
      if (filterValues.mode == 'filter') {
        myURL = `${filterValues.requestURL}&${queryParams.toString()}`
        console.log('Refetching MYURL', myURL)

        response = await fetch(myURL, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
      } else {
        myURL = `${filterValues.requestURL}?${queryParams.toString()}`
        console.log('Refetching MYURL', myURL)

        response = await fetch(myURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            prompt: filterValues.prompt,
          }),
        });
      }

      if (!response.ok) {
        throw new Error('Data refetch failed');
      }

      const data = await response.json();
      updateFilterValues('filteredData', data.results);
      setLoadingTable(false);
      
      
      console.log('Data fetch successful:', data);
    } catch (error) {
      console.error('Error during data refetch:', error);
    }
  };

  useEffect(() => {
    setLoadingTable(true);
    refetchData();
  }, [filterValues.paginationModel]) 

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

      // Force a reload of the page to clear everything
      window.location.reload();

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

//   const rows = [
//     {
//   first_name: "John",
//   last_name: "Doe",
//   location: "San Francisco, CA",
//   "connection_strength": 0,
//   url: "https://www.linkedin.com/in/johndoe/1",
//   connected_with: ["Markus", "Konstantina", "Emily", "Sofia"],
//   bio: "",
//   summary: "Specializes in front-end development and creating user-friendly interfaces. Passionate about mentoring junior developers.",
//   main_role: null,
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
//             "main_role": {
//                 "company": "Dotdash",
//                 "position": "Financial Review Board Member",
//                 "industry": "Book and Periodical Publishing",
//                 "company_website": "https://www.dotdash.com",
//                 "company_linkedin_link": "https://www.linkedin.com/company/dotdashco/",
//                 "company_description": "Dotdash's vibrant brands help over 100 million users each month find answers, solve problems, and get inspired. Dotdash is among the largest and fastest growing publishers online, and has won over 80 awards in the last year alone, including Digiday's 2020 Publisher of the Year. Dotdash brands include Verywell, Investopedia, The Balance, The Spruce, Simply Recipes, Serious Eats, Byrdie, Brides, MyDomaine, Lifewire, TripSavvy, Liquor.com, TreeHugger and Thoughtco.\n",
//                 "company_size": "149",
//                 "company_headquarters": "New York, US",
//                 "year_founded": null,
//                 "description": null,
//                 "start_date": "2022-12-01",
//                 "end_date": null,
//                 "location": "New York, US",
//                 "main_role": true
//             },
//             "other_roles": [
//                 {
//                     "company": "Berkeley College",
//                     "position": "Vice President, Career Services",
//                     "industry": "Higher Education",
//                     "company_website": "https://www.berkeleycollege.edu.com",
//                     "company_linkedin_link": "https://www.linkedin.com/school/berkeley-college/",
//                     "company_description": "Founded in 1931, Berkeley College offers career-focused degrees (Associate’s, Bachelor’s, Master’s) and certificate programs at campuses in New York City, New Jersey, and through nationally recognized online programs. Berkeley College is regionally accredited by the Middle States Commission on Higher Education. \n\nBerkeley focuses on real-world career preparation with a wide range of programs in Business, Healthcare, Criminal Justice, Design, and other in-demand career fields. Curricula are developed with input from industry experts and professors have professional experience in the subjects they teach. Students have access to a wide range of on-campus and online support services, including tutoring Career Services, and more.",
//                     "company_size": "1353",
//                     "company_headquarters": "New York, US",
//                     "year_founded": "1931",
//                     "description": null,
//                     "start_date": "2017-04-01",
//                     "end_date": null,
//                     "location": "New York, US",
//                     "main_role": false
//                 }
//             ],
//             "past_roles": [
//                 {
//                     "company": "Berkeley College",
//                     "position": "Assistant Vice President Career Services and Alumni Relations",
//                     "industry": "Higher Education",
//                     "company_website": "https://www.berkeleycollege.edu.com",
//                     "company_linkedin_link": "https://www.linkedin.com/school/berkeley-college/",
//                     "company_description": "Founded in 1931, Berkeley College offers career-focused degrees (Associate’s, Bachelor’s, Master’s) and certificate programs at campuses in New York City, New Jersey, and through nationally recognized online programs. Berkeley College is regionally accredited by the Middle States Commission on Higher Education. \n\nBerkeley focuses on real-world career preparation with a wide range of programs in Business, Healthcare, Criminal Justice, Design, and other in-demand career fields. Curricula are developed with input from industry experts and professors have professional experience in the subjects they teach. Students have access to a wide range of on-campus and online support services, including tutoring Career Services, and more.",
//                     "company_size": "1353",
//                     "company_headquarters": "New York, US",
//                     "year_founded": "1931",
//                     "description": null,
//                     "start_date": "2014-06-01",
//                     "end_date": "2017-04-01",
//                     "location": "New York, US",
//                     "main_role": false
//                 },
//                 {
//                     "company": "Berkeley College",
//                     "position": "Sr. Director, Alumni Career Services & Counselor Development",
//                     "industry": "Higher Education",
//                     "company_website": "https://www.berkeleycollege.edu.com",
//                     "company_linkedin_link": "https://www.linkedin.com/school/berkeley-college/",
//                     "company_description": "Founded in 1931, Berkeley College offers career-focused degrees (Associate’s, Bachelor’s, Master’s) and certificate programs at campuses in New York City, New Jersey, and through nationally recognized online programs. Berkeley College is regionally accredited by the Middle States Commission on Higher Education. \n\nBerkeley focuses on real-world career preparation with a wide range of programs in Business, Healthcare, Criminal Justice, Design, and other in-demand career fields. Curricula are developed with input from industry experts and professors have professional experience in the subjects they teach. Students have access to a wide range of on-campus and online support services, including tutoring Career Services, and more.",
//                     "company_size": "1353",
//                     "company_headquarters": "New York, US",
//                     "year_founded": "1931",
//                     "description": null,
//                     "start_date": "2012-06-01",
//                     "end_date": "2014-06-01",
//                     "location": "New York, US",
//                     "main_role": false
//                 },
//                 {
//                     "company": "Berkeley College",
//                     "position": "Director, Alumni Career Services",
//                     "industry": "Higher Education",
//                     "company_website": "https://www.berkeleycollege.edu.com",
//                     "company_linkedin_link": "https://www.linkedin.com/school/berkeley-college/",
//                     "company_description": "Founded in 1931, Berkeley College offers career-focused degrees (Associate’s, Bachelor’s, Master’s) and certificate programs at campuses in New York City, New Jersey, and through nationally recognized online programs. Berkeley College is regionally accredited by the Middle States Commission on Higher Education. \n\nBerkeley focuses on real-world career preparation with a wide range of programs in Business, Healthcare, Criminal Justice, Design, and other in-demand career fields. Curricula are developed with input from industry experts and professors have professional experience in the subjects they teach. Students have access to a wide range of on-campus and online support services, including tutoring Career Services, and more.",
//                     "company_size": "1353",
//                     "company_headquarters": "New York, US",
//                     "year_founded": "1931",
//                     "description": null,
//                     "start_date": "2009-05-01",
//                     "end_date": "2012-06-01",
//                     "location": "New York, US",
//                     "main_role": false
//                 }
//             ],
//             "functions": []
//         },
//   ];

  const columns = [
    // { field: "id", headerName: '#', hide: true, width: 50 },
    { 
      field: 'first_name', 
      headerName: 'Name', 
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
      flex: 1
    },
    {
      field: 'position',
      headerName: 'Position',
      renderCell: (params) => (
        <div>
          {params.row.main_role ? params.row.main_role.position : '-'}
        </div>
      ),
      flex: 1
    },
    { 
      field: 'bio', 
      headerName: 'Bio', 
      renderCell: (params) => (
        <TruncatedTextCell value={params.row.bio} />
      ),
      flex: 1
    },
    { 
      field: 'summary', 
      headerName: 'Summary', 
      renderCell: (params) => (
        <TruncatedTextCell value={params.row.summary} />
      ),
      flex: 1
    },        
    { 
      field: 'company', 
      headerName: 'Company', 
      renderCell: (params) => (
        <div>
          {params.row.main_role ? params.row.main_role.company : '-'}
        </div>
      ),
      flex: 1
    },
    { 
      field: 'industry', 
      headerName: 'Industry', 
      renderCell: (params) => (
        <div>
          {params.row.main_role ? params.row.main_role.industry : '-'}
        </div>
      ),
      flex: 1 
    },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'connected_with', headerName: 'Connections', flex: 1 },
    { 
      field: 'connection_strength', 
      headerName: 'Connection Strength', 
      renderCell: (params) => (
        <div>
          {params.row.connection_strength.toFixed(5)}
        </div>
      ),
      flex: 1 }, 
  ].map(column => ({ ...column, sortable: false, filterable: false }));;
  
  const handleRowClick = (params) => {
    console.log(params.row)
    setSelectedRow(params.row); 
    setOpenDrawer(true);
  };

  const handlePaginationModelChange = (newModel) => {
    updateFilterValues('paginationModel', newModel); // Update the pagination model
  };

  const handleOptionsChange = (event, newOption) => {
    if (newOption !== null) {
      setOption(newOption);
    }
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

        {/* Options */}
        <div className={styles.optionsContainer}>
          <ToggleButtonGroup
            color="secondary"
            value={option}
            exclusive
            onChange={handleOptionsChange}
            aria-label="Platform"
          >
            <ToggleButton value="filter">Filter</ToggleButton>
            <ToggleButton value="search">Search</ToggleButton>
          </ToggleButtonGroup>
        </div>        

        {/* Search */}
        {option === 'search' && (
          <div className={styles.filtersContainer}>
            <Search 
              setLoadingData={setLoadingData}
              setLoadingTable={setLoadingTable}
            />
          </div>
        )}

        {/* Filters */}
        {option === 'filter' && (
          <div className={styles.filtersContainer}>
            <Filters
              setLoadingData={setLoadingData}
              setLoadingTable={setLoadingTable}
              locations={locations}
              positions={positions}
              // past_positions={positions}
              functions={functions}
              industries={industries}
              hqs={headquarters}
              connections={connections}
            />
          </div>
        )}
          {/* <div className={styles.sortContainer}>
            <div className={styles.sortTitle}>
              SORTING
            </div>
            <div style={{padding: '16px'}}>
              <p>Sort by Years of Experience</p>
              <Switch
                color="secondary"
                checked={filterValues.expertise} // Bind the switch to state
                onChange={(event) => updateFilterValues('expertise', !filterValues.expertise)} // Update state on toggle
              />
            </div>
          </div> */}
  
        {/* Data Table */}
        <div className={styles.dataGridContainer} style={{ height: `${dataGridHeight}px` }}>
          {loadingData ? (
            // Show loading indicator while loading data
            <LinearProgress />
          ) : filterValues.filteredData.length > 0 ? (
            // Show the DataGrid if there is data
            <DataGrid
              getRowId={(row) => row.url}
              style={{ borderRadius: '10px' }}
              rows={filterValues.filteredData} //{rows}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              disableSelectionOnClick
              getRowHeight={() => 'auto'}         
              onRowClick={handleRowClick}
              loading={loadingTable}
              pagination
              paginationMode="server"
              pageSizeOptions={[15, 20, 25]}
              rowCount={filterValues.rowCount}
              paginationModel={filterValues.paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
              slots={{ toolbar: CustomToolbar }}
              slotProps={{
                toolbar: {
                  printOptions: { disableToolbarButton: true }, // Disable Export print button
                },
              }}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    summary: false, //The Summary column starts as hidden
                  },
                },
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
                '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { 
                  py: '12px' 
                },
              }}
            />
          ) : (
           // Show no data message if there are no data
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

