import React, { useState } from "react";
import styles from './Filters.module.css';

import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import HubIcon from '@mui/icons-material/Hub'; 

import { Box, Button, Slider, Typography, Badge, Input, FormControl, FormHelperText, Checkbox } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { useFilters } from "../Components/FiltersContext";

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
    const baseURL = "http://localhost:80/api/get_connection_list/";

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

    if (params.includePastPosition && params.selectedPosition.length > 0) {
      queryParams.append("position", params.selectedPosition.join(","));
    } else if (params.selectedPosition.length > 0) {
      queryParams.append("main_position", params.selectedPosition.join(","));
      queryParams.append("current_position", params.selectedPosition.join(",")); //TODO: check if current contains main
    }

    if (params.selectedKeyword.length > 0) {
      queryParams.append("keyword", params.selectedKeyword.join(","));
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

    if (params.selectedCompanyYearStart > 0) {
      queryParams.append("main_company_year_min", params.selectedCompanyYearStart);
    }
    if (params.selectedCompanyYearEnd > 0) {
      queryParams.append("main_company_year_max", params.selectedCompanyYearEnd);
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
    updateFilterValues('mode', 'filter')
    console.log('Submitted', filterValues); 
    
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
    // updateFilterValues('selectedPastPosition', []);
    updateFilterValues('includePastPosition', false);
    updateFilterValues('selectedFunction', []);
    updateFilterValues('includePastFunction', false);

    updateFilterValues('selectedCompanyName', "");
    updateFilterValues('includePastCompanies', false);
    updateFilterValues('selectedCompanyIndustry', []);
    updateFilterValues('includePastIndustry', false);
    updateFilterValues('selectedCompanyHeadquarters', []);
    updateFilterValues('selectedCompanySize', [0, 7]);
    updateFilterValues('selectedCompanyYearStart', 1400);
    updateFilterValues('selectedCompanyYearEnd', 2024);

    updateFilterValues('selectedKeyword', []);
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
          // filterValues.includePastPosition ||
          filterValues.selectedFunction.length > 0
          // || filterValues.includePastFunction
        );
      case "company":
        return (
          filterValues.selectedCompanyName ||
          filterValues.selectedCompanyIndustry.length > 0 ||
          // filterValues.includePastIndustry ||
          // filterValues.includePastCompanies ||
          filterValues.selectedCompanyHeadquarters.length > 0 ||
          filterValues.selectedCompanySize[0] !== 0 ||
          filterValues.selectedCompanySize[1] !== 7 ||
          filterValues.selectedCompanyYearStart !== 1400 ||
          filterValues.selectedCompanyYearEnd !== 2024
        );
      case "general":
        return (
          filterValues.selectedKeyword.length > 0 ||
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
    console.log(value)
    console.log(inputPosValue)
    // Show options only if input has 3 or more characters
    if (value.length >= 3) {
      const lowercasedValue = value.toLowerCase();

      const startsWithOptions = positions.filter((option) =>
        option.toLowerCase().startsWith(lowercasedValue)
      );

      const exactMatchOptions = positions.filter(
        (option) =>
          !startsWithOptions.includes(option) &&
          option.toLowerCase().includes(` ${lowercasedValue} `)
      );

      const containsOptions = positions.filter(
        (option) =>
          !startsWithOptions.includes(option) &&
          !exactMatchOptions.includes(option) &&
          option.toLowerCase().includes(lowercasedValue)
      );

      setFilteredPosOptions([...startsWithOptions, ...exactMatchOptions, ...containsOptions]);
    } else {
      setFilteredPosOptions([]); // Reset to empty list if input is cleared
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

              <div style={{ display: 'flex'}}>
                <FormControl className={styles.filter}> 
                  <Autocomplete
                    multiple
                    freeSolo
                    limitTags={2}
                    options={filteredPosOptions} // Use filtered options here
                    getOptionLabel={(option) => option}
                    value={filterValues.selectedPosition}
                    onChange={(event, value) => updateFilterValues("selectedPosition", value)}
                    onInputChange={handleInputChange} // Handle input change
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Position"
                      />
                    )}
                  />
                  <FormHelperText component="div" style={{ margin: 0, display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-start' }}>
                    <Checkbox
                      style={{padding: '8px', marginLeft: '-10px'}}
                      size="small"
                      checked={filterValues.includePastPosition} 
                      onChange={(event) => updateFilterValues('includePastPosition', !filterValues.includePastPosition)} 
                    />         
                    <span>Include Past Positions</span>           
                  </FormHelperText>
                </FormControl>
              </div>

              <div style={{ display: 'flex'}}>
                <FormControl className={styles.filter}> 
                  <Autocomplete 
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
                  <FormHelperText component="div" style={{ margin: 0, display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-start' }}>
                    <Checkbox
                      style={{padding: '8px', marginLeft: '-10px'}}
                      size="small"
                      checked={filterValues.includePastFunction}
                      onChange={(event) => updateFilterValues('includePastFunction', !filterValues.includePastFunction)}
                    />   
                    <span>Include Past Functions</span>                 
                  </FormHelperText>
                </FormControl>      
              </div>
              
            </div>
          </CustomTabPanel>

          {/* Company Tab */}
          <CustomTabPanel value={value} index={1}>
            <div className={styles.filtersContainer}>

              <div style={{ display: 'flex'}}>
                <FormControl className={styles.filter}> 
                  <TextField 
                    variant="outlined"
                    label="Company Name"
                    value={filterValues.selectedCompanyName}
                    onChange={(event) => updateFilterValues('selectedCompanyName', event.target.value)} 
                  />   
                  <FormHelperText component="div" style={{ margin: 0, display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-start' }}>
                    <Checkbox
                      style={{padding: '8px', marginLeft: '-10px'}}
                      size="small"
                      checked={filterValues.includePastCompanies}
                      onChange={(event) => updateFilterValues('includePastCompanies', !filterValues.includePastCompanies)}
                    />   
                    <span>Include Past Companies</span>                 
                  </FormHelperText>
                </FormControl>  
              </div>

              <div style={{ display: 'flex'}}>  
              <FormControl className={styles.filter}> 
                <Autocomplete
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
                <FormHelperText component="div" style={{ margin: 0, display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-start' }}>
                    <Checkbox
                      style={{padding: '8px', marginLeft: '-10px'}}
                      size="small"
                      checked={filterValues.includePastIndustry}
                      onChange={(event) => updateFilterValues('includePastIndustry', !filterValues.includePastIndustry)}
                    />   
                    <span>Include Past Industries</span>                 
                  </FormHelperText>
                </FormControl>                 
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

              <Box className={styles.filter}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography id="company-year-slider" gutterBottom sx={{ marginRight: 2 }}>
                    Year Founded:
                  </Typography>
                  <div style={{display: 'flex', alignItems: 'center' }}>

                  <Input
                    value={filterValues.selectedCompanyYearStart}
                    size="small"
                    onChange={(event) => {
                      const value = event.target.value === "" ? "" : Number(event.target.value);
                      updateFilterValues("selectedCompanyYearStart", value);
                    }}
                    onBlur={(event) => {
                      let value = Number(event.target.value);
                      if (isNaN(value) || value < 1400) {
                        value = 1400; // Enforce minimum year
                      }
                      updateFilterValues("selectedCompanyYearStart", value);
                    }}
                    sx={{ width: 50, marginRight: 1 }}
                  />
                  <Typography sx={{ marginRight: 1 }}> - </Typography>
                  <Input
                    value={filterValues.selectedCompanyYearEnd}
                    size="small"
                    onChange={(event) => {
                      const value = event.target.value === "" ? "" : Number(event.target.value);
                      updateFilterValues("selectedCompanyYearEnd", value);
                    }}
                    onBlur={(event) => {
                      let value = event.target.value === "" ? 1400 : Number(event.target.value);
                      if (isNaN(value) || value > 2024) {
                        value = 2024; // Enforce maximum year
                      }
                      updateFilterValues("selectedCompanyYearEnd", value);
                    }}
                    sx={{ width: 50 }}
                  />
                  </div>
                </Box>
                <Slider className={styles.filter}
                  size="small"
                  value={[filterValues.selectedCompanyYearStart, filterValues.selectedCompanyYearEnd]}
                  defaultValue={[2000, 2024]}
                  aria-labelledby="company-year-slider"
                  step={1}
                  min={1400}
                  max={2024}
                  onChange={(event, value) => {
                    updateFilterValues('selectedCompanyYearStart', value[0])
                    updateFilterValues('selectedCompanyYearEnd', value[1])
                  }}
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
                  size="small"
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

              <Autocomplete
                className={styles.filter}
                multiple
                freeSolo
                limitTags={2}
                options={[]} // No predefined options
                value={filterValues.selectedKeyword || []} // Fallback to an empty array
                onChange={(event, value) => updateFilterValues('selectedKeyword', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Keywords"
                    placeholder="Type and press Enter"
                    variant="outlined"
                  />
                )}
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