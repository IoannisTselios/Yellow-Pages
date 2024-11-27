import React, { useState } from "react";
import styles from './Filters.module.css';

import { Box, Button, Tooltip, Slider, Typography, Badge } from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import HubIcon from '@mui/icons-material/Hub'; 

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';

// import { VariableSizeList } from 'react-window';

import { useFilters } from "../Components/FiltersContext";

// const LISTBOX_PADDING = 8; // Adjust as needed

// function renderRow({ data, index, style }) {
//   const item = data[index];
//   return <div style={style}>{item.label}</div>;
// }

// function ListboxComponent(props) {
//   const { children, ...other } = props;
//   const items = React.Children.toArray(children);
//   const itemSize = 36; // Height of each item

//   return (
//     <VariableSizeList
//       height={Math.min(8, items.length) * itemSize + 2 * LISTBOX_PADDING}
//       width="100%"
//       itemCount={items.length}
//       itemSize={() => itemSize}
//       itemData={items}
//       {...other}
//     >
//       {renderRow}
//     </VariableSizeList>
//   );
// }

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

const companySizes = [
  '1-10',
  '10-50',
  '50-200',
  '200-500',
  '500-1000',
  '1000-5000',
  '5000-10000',
  '10000+',
];

export const Filters = ({setLoadingData, setLoadingTable, locations, positions, functions, industries, hqs, connections}) => {
  const { filterValues, updateFilterValues } = useFilters();  

  //Controlling the tabs for the filters
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Handling company size results
  const getStart = (value) => {
    return value.split('-')[0]
  }
  const getEnd = (value) => {
    if (value.split('-').length > 1)
      return value.split('-')[1]
    else 
      return value.split('-')[0]
  }

  const determineExpertise = () => {
    console.log('ppp', filterValues.selectedPosition)
    console.log('ppp', filterValues.selectedCompanyName)
    console.log('ppp', filterValues.selectedCompanyIndustry)
    console.log('ppp', filterValues.selectedFunction)
    if (filterValues.selectedPosition.length > 0) {
      return "position_months";
    } else if (filterValues.selectedCompanyName) {
      return "company_months";
    } else if (filterValues.selectedCompanyIndustry.length > 0) {
      return "industry_months";
    } else if (filterValues.selectedFunction.length > 0) {
      return "function_months";
    }

    return '';
  }

  const generateEndpoint = (params) => {
    const baseURL = "http://13.48.244.239:80/api/get_connection_list/";

    const queryParams = new URLSearchParams();

    if (params.selectedFirstName) {
      queryParams.append("first_name", params.selectedFirstName);
    }
    if (params.selectedLastName) {
      queryParams.append("last_name", params.selectedLastName);
    }

    if (params.selectedLocation.length > 0) {
      queryParams.append("location", params.selectedLocation.join(","));
    }

    if (params.selectedPosition.length > 0) {
      queryParams.append("main_position", params.selectedPosition.join(","));
      queryParams.append("current_position", params.selectedPosition.join(","));
    }

    if (params.selectedPastPosition.length > 0) {
      queryParams.append("past_position", params.selectedPastPosition.join(","));
    }

    if (params.selectedKeyword) {
      queryParams.append("keyword", params.selectedKeyword);
    }

    if (params.includePastCompanies && params.selectedCompanyName) {
      queryParams.append("company", params.selectedCompanyName); // is it contains or exact or what?
      // when to use current and when main??
    } else if (params.selectedCompanyName) {
      queryParams.append("main_company", params.selectedCompanyName);
    }

    if (params.includePastIndustry && params.selectedCompanyIndustry.length > 0) {
      queryParams.append("industry", params.selectedCompanyIndustry.join(","));
    } else if (params.selectedCompanyIndustry.length > 0) {
      queryParams.append("main_industry", params.selectedCompanyIndustry.join(","));
    }

    if (params.selectedCompanyHeadquarters.length > 0) {
      queryParams.append("headquarters", params.selectedCompanyHeadquarters.join(","));
    }

    if (params.includePastFunction && params.selectedFunction.length > 0) {
      queryParams.append("function", params.selectedFunction.join(","));
    } else if (params.selectedFunction.length > 0) {
      queryParams.append("current_function", params.selectedFunction.join(","));
    }

    if (params.selectedConnections.length > 0) {
      queryParams.append("connected_with", params.selectedConnections.join(","));
    }

    if (params.selectedCompanySize.length === 2) {
      // Determine the minimum company size
      // If lower limit is infinite (10000+), set the minimum company size to 10,000
      if(params.selectedCompanySize[0] === 7){ 
        queryParams.append("main_company_size_min", 10000);
      } else { // Otherwise, use the starting value of the selected company size range
        queryParams.append("main_company_size_min", getStart(companySizes[params.selectedCompanySize[0]]));
      }         

      // Determine the maximum company size
      //If upper limit is not infinite (10000+), set the maximum company size 
      if((params.selectedCompanySize[1]) !== 7){ 
        queryParams.append("main_company_size_max", getEnd(companySizes[params.selectedCompanySize[1]]));
      }     
    }

    if (params.selectedCompanyYear.length === 2) {
      queryParams.append("main_company_year_min", params.selectedCompanyYear[0]);
      queryParams.append("main_company_year_max", params.selectedCompanyYear[1]);
    }

    const sort_param = determineExpertise();
    if (params.expertise && sort_param != '') {
      queryParams.append("sort_by", sort_param);
    }

    updateFilterValues('requestURL', `${baseURL}?${queryParams.toString()}`);

    // add the requested page at the end so that we save the general url and call it for another page
    queryParams.append("page", 1); // always ask for the first page when the filters are applied
    queryParams.append("page_size", 15); // always ask for 15 results per page when the filters are applied

    return `${baseURL}?${queryParams.toString()}`;
  };

  const handleApply = async () => {
    console.log('Submitted', filterValues); 
    // 13.48.244.239:80/api/get_connection_list/?location=Denmark&keyword=pre-seed,seed&main_company=Google&past_company=Microsoft,Azure&current_company=Netflix,Sequoia&company=Apple,Google&main_company_size_min=100&main_company_size_max=5000&past_company_size_min=50&past_company_size_max=10000&current_company_size_min=200&current_company_size_max=500&company_size_min=10&company_size_max=1000&main_industry=Tech,Finance&past_industry=Healthcare&current_industry=Education&industry=Retail&main_position=Manager&past_position=Analyst&current_position=Developer&position=Engineer&connected_with=Mads&current_function=General Law&function=Academic Research&first_name=Artemis&page=2
    const my_endpoint = generateEndpoint(filterValues);
    console.log('MY ENDPOINT', my_endpoint)

    setLoadingData(true);  //Loading set to true before the fetch request
    setLoadingTable(true);  //Loading table set to true before the fetch request

    // initialize paging before request
    const pagModel = {page: 0, pageSize: filterValues.paginationModel.pageSize}
    updateFilterValues('paginationModel', pagModel)

    try {
      const response_filter = await fetch(my_endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response_filter.ok) {
        throw new Error('Filtering failed');
      }

      const filter_data = await response_filter.json();

      console.log('THIS DATA', filter_data);
      updateFilterValues('filteredData', filter_data.results);
      await updateFilterValues('rowCount', filter_data.count);
      const page_size = Math.ceil(filter_data.count / filter_data.total_pages)
      // await updateFilterValues('pageSize', page_size);
      console.log(filterValues)

    } catch (error) {
      console.error('Error during filtering:', error);
    } finally {
      setLoadingData(false);  //Loading set to false when the fetch is done or an error occurs
      setLoadingTable(false);  //Loading table set to false when the fetch is done or an error occurs
    }
  }

  //Clears filters and filtered results by setting them to their default values
  const handleClear = async () => {    
    updateFilterValues('selectedFirstName', "");
    updateFilterValues('selectedLastName', "");
    updateFilterValues('selectedLocation', []);
    updateFilterValues('selectedPosition', []);
    updateFilterValues('selectedPastPosition', []);
    updateFilterValues('selectedFunction', []);
    updateFilterValues('includePastFunction', false);

    updateFilterValues('selectedCompanyName', "");
    updateFilterValues('includePastCompanies', false);
    updateFilterValues('selectedCompanyIndustry', []);
    updateFilterValues('includePastIndustry', false);
    updateFilterValues('selectedCompanyHeadquarters', []);
    updateFilterValues('selectedCompanySize', [0, 7]);
    updateFilterValues('selectedCompanyYear', [1800, 2024]);

    updateFilterValues('selectedKeyword', "");
    updateFilterValues('selectedConnections', []);    

    updateFilterValues('filteredData', []);    
  };

  // Helper function to determine if filters are active for a specific tab
  const isTabActive = (tab) => {
    switch (tab) {
      case "person":
        return (
          filterValues.selectedFirstName ||
          filterValues.selectedLastName ||
          filterValues.selectedLocation.length > 0 ||
          filterValues.selectedPosition.length > 0 ||
          filterValues.selectedPastPosition.length > 0 ||
          filterValues.selectedFunction.length > 0 ||
          filterValues.includePastFunction
        );
      case "company":
        return (
          filterValues.selectedCompanyName ||
          filterValues.selectedCompanyIndustry.length > 0 ||
          filterValues.includePastIndustry ||
          filterValues.includePastCompanies ||
          filterValues.selectedCompanyHeadquarters.length > 0 ||
          filterValues.selectedCompanySize[0] !== 0 ||
          filterValues.selectedCompanySize[1] !== 7 ||
          filterValues.selectedCompanyYear[0] !== 1800 ||
          filterValues.selectedCompanyYear[1] !== 2024
        );
      case "general":
        return (
          filterValues.selectedKeyword ||
          filterValues.selectedConnections.length > 0
        );
      default:
        return false;
    }
  };

  const [inputPosValue, setInputPosValue] = useState("");
  const [inputPastPosValue, setInputPastPosValue] = useState("");
  const [filteredPosOptions, setFilteredPosOptions] = useState([]);
  const [filteredPastPosOptions, setFilteredPastPosOptions] = useState([]);


  const handleInputChange = (event, value) => {
    setInputPosValue(value);

    // Show options only if input has 3 or more characters
    if (value.length >= 3) {
      setFilteredPosOptions(
        positions.filter((option) =>
          option.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredPosOptions([]);
    }
  };

  const handlePastInputChange = (event, value) => {
    setInputPastPosValue(value);

    // Show options only if input has 3 or more characters
    if (value.length >= 3) {
      setFilteredPastPosOptions(
        positions.filter((option) =>
          option.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredPastPosOptions([]);
    }
  };

  return (
      <Box sx={{ width: '100%' }}>
        <Box className={styles.tabsContainer}>
          <Tabs value={value} onChange={handleChange} aria-label="icon tabs" /*sx={{ minHeight: '48px', flexGrow: 1 }} */>
            <Tab
              icon={
                <Badge
                  color="secondary"
                  variant="dot"
                  invisible={!isTabActive("person")}
                >
                  <PersonIcon />
                </Badge>
              }
              iconPosition="start"
              label="Person"
            />
            <Tab
              icon={
                <Badge
                  color="secondary"
                  variant="dot"
                  invisible={!isTabActive("company")}
                >
                  <BusinessIcon />
                </Badge>
              }
              iconPosition="start"
              label="Company"
            />
            <Tab
              icon={
                <Badge
                  color="secondary"
                  variant="dot"
                  invisible={!isTabActive("general")}
                >
                  <HubIcon />
                </Badge>
              }
              iconPosition="start"
              label="General"
            />
          </Tabs>
          <div>
            <Button variant="outlined" color="primary" onClick={handleClear} sx={{ marginRight: '16px', borderWidth: '2px', '&:hover': { borderColor: '#fdb73e' } }}>Clear Filters</Button>
            <Button variant="contained" color="primary" sx={{ marginRight: '16px'}} onClick={handleApply}>Apply Filters</Button>
          </div>          
        </Box>

          {/* Person Tab */}
          <CustomTabPanel value={value} index={0} >
            <div className={styles.filtersContainer}>

              <TextField className={styles.filter}
                variant="outlined"
                label="First Name"
                value={filterValues.selectedFirstName}
                onChange={(event) => updateFilterValues('selectedFirstName', event.target.value)} 
              /> 

              <TextField className={styles.filter}
                variant="outlined"
                label="Last Name"
                value={filterValues.selectedLastName}
                onChange={(event) => updateFilterValues('selectedLastName', event.target.value)} 
              /> 

              <Autocomplete className={styles.filter}
                multiple
                limitTags={2}
                options={locations}
                getOptionLabel={(option) => option}
                value={filterValues.selectedLocation}
                onChange={(event, value) => updateFilterValues('selectedLocation', value)}
                filterOptions={(options, state) =>
                  options.filter((option) =>
                    option.toLowerCase().startsWith(state.inputValue.toLowerCase())
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Location"
                  />
                )}
              />

              <Autocomplete className={styles.filter}
                multiple
                freeSolo
                limitTags={2}
                options={filteredPosOptions} // Use filtered options here
                getOptionLabel={(option) => option}
                value={filterValues.selectedPosition}
                onChange={(event, value) => updateFilterValues("selectedPosition", value)}
                onInputChange={handleInputChange} // Handle input change
                noOptionsText={inputPosValue.length < 3 ? 'Start typing to view options' : 'No options'}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Position"
                  />
                )}
              />

              <Autocomplete className={styles.filter}
                multiple
                freeSolo
                limitTags={2}
                options={filteredPastPosOptions} // Use filtered options here
                getOptionLabel={(option) => option}
                value={filterValues.selectedPastPosition}
                onChange={(event, value) => updateFilterValues("selectedPastPosition", value)}
                onInputChange={handlePastInputChange} // Handle input change
                noOptionsText={inputPastPosValue.length < 3 ? 'Start typing to view options' : 'No options'}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Past Position"
                  />
                )}
              />

              <div style={{ display: 'flex'}}>
                <Autocomplete className={styles.filter}
                  multiple
                  limitTags={2}
                  options={functions}
                  getOptionLabel={(option) => option}
                  value={filterValues.selectedFunction}
                  onChange={(event, value) => updateFilterValues('selectedFunction', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Function"
                    />
                  )}
                />                
                <Tooltip title="Include Past Functions" placement="top">
                  <Switch
                    color="secondary"
                    checked={filterValues.includePastFunction} // Bind the switch to state
                    onChange={(event) => updateFilterValues('includePastFunction', !filterValues.includePastFunction)} // Update state on toggle
                    sx={{ transform: 'rotate(-90deg)', alignSelf: 'center'}} 
                  />
                </Tooltip>
              </div>

              {/* Seniority in case we implement it */}
              {/* <FormControl className={styles.filter}>
                <InputLabel id="seniority">Seniority</InputLabel>
                <Select
                  labelId="seniority-label"
                  defaultValue = ""
                  onChange={(event) => updateFilterValues('selectedSeniority', event.target.value)}
                  value={filterValues.selectedSeniority}
                  label="Seniority"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="entry">Entry</MenuItem>
                  <MenuItem value="mid">Mid</MenuItem>
                  <MenuItem value="senior">Senior</MenuItem>
                </Select>
              </FormControl> */}
              
            </div>
          </CustomTabPanel>

          {/* Company Tab */}
          <CustomTabPanel value={value} index={1}>
            <div className={styles.filtersContainer}>

              <div style={{ display: 'flex'}}>
                {/* <Autocomplete className={styles.filter}
                  multiple
                  limitTags={2}
                  options={top100Films}
                  getOptionLabel={(option) => option.title}
                  value={filterValues.selectedCompanyName}
                  onChange={(event, value) => updateFilterValues('selectedCompanyName', value)}  // Update state on change
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Company Name"
                    />
                  )}
                />   */}
                <TextField className={styles.filter}
                  variant="outlined"
                  label="Company Name"
                  value={filterValues.selectedCompanyName}
                  onChange={(event) => updateFilterValues('selectedCompanyName', event.target.value)} 
                />   
                <Tooltip title="Include Past Companies" placement="top">
                  <Switch
                    color="secondary"
                    checked={filterValues.includePastCompanies} // Bind the switch to state
                    onChange={(event) => updateFilterValues('includePastCompanies', !filterValues.includePastCompanies)} // Update state on toggle
                    sx={{ transform: 'rotate(-90deg)', alignSelf: 'center'}} 
                  />
                </Tooltip>
              </div>

              <div style={{ display: 'flex'}}>  
                <Autocomplete className={styles.filter}
                  multiple
                  limitTags={2}
                  options={industries}
                  getOptionLabel={(option) => option}
                  value={filterValues.selectedCompanyIndustry}
                  onChange={(event, value) => updateFilterValues('selectedCompanyIndustry', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Industry"
                    />
                  )}
                />
                <Tooltip title="Include Past Industries" placement="top">
                  <Switch
                    color="secondary"
                    checked={filterValues.includePastIndustry} // Bind the switch to state
                    onChange={(event) => updateFilterValues('includePastIndustry', !filterValues.includePastIndustry)} // Update state on toggle
                    sx={{ transform: 'rotate(-90deg)', alignSelf: 'center'}} 
                  />
                </Tooltip>
              </div>

              <Autocomplete className={styles.filter}
                multiple
                limitTags={2}
                options={hqs}
                getOptionLabel={(option) => option}
                value={filterValues.selectedCompanyHeadquarters}
                onChange={(event, value) => updateFilterValues('selectedCompanyHeadquarters', value)}
                filterOptions={(options, state) =>
                  options.filter((option) =>
                    option.toLowerCase().startsWith(state.inputValue.toLowerCase())
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Headquarters"
                  />
                )}
              />

              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker className={styles.filterSmall} label={'Year From'} views={['year']} />
                  <DatePicker className={styles.filterSmall} label={'Year To'} views={['year']} />
                </DemoContainer>
              </LocalizationProvider> */}

              <Box className={styles.filter}>
                <Typography id="company-year-slider" gutterBottom>
                  Year Founded: {filterValues.selectedCompanyYear[0]} - {filterValues.selectedCompanyYear[1]}
                </Typography>
                <Slider className={styles.filter}
                  value={filterValues.selectedCompanyYear}
                  defaultValue={[2014, 2024]}
                  // valueLabelDisplay="on"
                  aria-labelledby="company-year-slider"
                  step={1}
                  // marks
                  min={1800}
                  max={2024}
                  onChange={(event, value) => updateFilterValues('selectedCompanyYear', value)}
                />
              </Box>

              <Box className={styles.filter}>
              <Typography id="company-size-slider" gutterBottom>
                Company Size: 
                {filterValues.selectedCompanySize[0] === 7
                  ? " 10000+"
                  : ` ${getStart(companySizes[filterValues.selectedCompanySize[0]])} - ${getEnd(companySizes[filterValues.selectedCompanySize[1]])}`}
              </Typography>
                <Slider
                  value={filterValues.selectedCompanySize}
                  min={0}
                  max={companySizes.length - 1}
                  step={1}
                  marks={companySizes.map((size, index) => ({
                    value: index,
                    // label: index === 0 ? "1" : (index === companySizes.length - 1 ? "10,000+" : '') 
                    // label: index === 0 || index === companySizes.length - 1 ? size : '', // Show label only for the first and last marks
                  }))}
                  // valueLabelFormat={valueLabelFormat}
                  onChange={(event, value) => updateFilterValues('selectedCompanySize', value)}
                  aria-labelledby="company-size-slider"
                />
              </Box>

            </div>
          </CustomTabPanel>

          {/* General Tab */}
          <CustomTabPanel value={value} index={2}>
            <div className={styles.filtersContainer}>

              <TextField className={styles.filter}
                variant="outlined"
                label="Keyword"
                value={filterValues.selectedKeyword}
                onChange={(event) => updateFilterValues('selectedKeyword', event.target.value)} 
              />

              <Autocomplete className={styles.filter}
                multiple
                limitTags={2}
                options={connections}
                getOptionLabel={(option) => option}
                value={filterValues.selectedConnections}
                onChange={(event, value) => updateFilterValues('selectedConnections', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Connections"
                  />
                )}
              />

            </div> 
          </CustomTabPanel>
          
      </Box>
  );
}