import React, { useEffect, useState } from "react";
import styles from './Filters.module.css';

import { Box, Button, Drawer, IconButton, Tooltip } from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import HubIcon from '@mui/icons-material/Hub'; 

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { useFilters } from "../Components/FiltersContext";

export const Filters = () => {
  const { filterValues, updateFilterValues } = useFilters();

  // Controlling the tabs for the filters
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
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
      <Box sx={{ width: '100%' }}>
        <Box className={styles.tabsContainer}>
          <Tabs value={value} onChange={handleChange} aria-label="icon tabs" /*sx={{ minHeight: '48px', flexGrow: 1 }} */>
            <Tab icon={<PersonIcon />} iconPosition="start" label="Person" className={styles.tab} />
            <Tab icon={<BusinessIcon />} iconPosition="start" label="Company" className={styles.tab}/>
            <Tab icon={<HubIcon />} iconPosition="start" label="General" className={styles.tab} />
          </Tabs>
          <Button variant="contained" color="primary" sx={{ marginRight: '16px'}}>Apply Filters</Button>
        </Box>
          {/* <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
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
            <Button variant="contained" color="primary">Apply Filters</Button>
          </Box> */}

          {/* Person Tab */}
          <CustomTabPanel value={value} index={0} >
            <div className={styles.filtersContainer}>

              <Autocomplete className={styles.filter}
                multiple
                limitTags={2}
                options={top100Films}
                getOptionLabel={(option) => option.title}
                value={filterValues.selectedLocation}
                onChange={(event, value) => updateFilterValues('selectedLocation', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Location"
                  />
                )}
              />

              <Autocomplete className={styles.filter}
                multiple
                limitTags={2}
                options={top100Films}
                getOptionLabel={(option) => option.title}
                // defaultValue={[top100Films[13]]}
                // filterSelectedOptions
                value={filterValues.selectedPosition}
                onChange={(event, value) => updateFilterValues('selectedPosition', value)}  // Update state on change
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Position"
                    // placeholder="Favorites"
                  />
                )}
              />

              <div style={{ display: 'flex'}}>
                <Autocomplete className={styles.filter}
                  multiple
                  limitTags={2}
                  options={top100Films}
                  getOptionLabel={(option) => option.title}
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

              <Autocomplete className={styles.filter}
                multiple
                limitTags={2}
                options={top100Films}
                getOptionLabel={(option) => option.title}
                value={filterValues.selectedSeniority}
                onChange={(event, value) => updateFilterValues('selectedSeniority', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seniority"
                  />
                )}
              />
              
            </div>
          </CustomTabPanel>

          {/* Company Tab */}
          <CustomTabPanel value={value} index={1}>
            <div className={styles.filtersContainer}>

              <Autocomplete className={styles.filter}
                multiple
                limitTags={2}
                options={top100Films}
                getOptionLabel={(option) => option.title}
                value={filterValues.selectedCompanyName}
                onChange={(event, value) => updateFilterValues('selectedCompanyName', value)}  // Update state on change
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Name"
                  />
                )}
              />

              <div style={{ display: 'flex'}}>  
                <Autocomplete className={styles.filter}
                  multiple
                  limitTags={2}
                  options={top100Films}
                  getOptionLabel={(option) => option.title}
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
                {/* <FormControlLabel
                  value="bottom"
                  control={
                    <Switch 
                      color="secondary"
                      checked={filterValues.includePastFunction} // Bind the switch to state
                      onChange={(event) => updateFilterValues('includePastFunction', !filterValues.includePastFunction) } // Update state on toggle 
                    />
                  }
                  label="Include past"
                  labelPlacement="top"
                  sx={{ verticalAlign: 'top'}}
                /> */}
              </div>

              <Autocomplete className={styles.filter}
                multiple
                limitTags={2}
                options={top100Films}
                getOptionLabel={(option) => option.title}
                value={filterValues.selectedCompanyHeadquarters}
                onChange={(event, value) => updateFilterValues('selectedCompanyHeadquarters', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Headquarters"
                  />
                )}
              />

            </div>
          </CustomTabPanel>

          {/* General Tab */}
          <CustomTabPanel value={value} index={2}>
            <div className={styles.filtersContainer}>

              <Autocomplete className={styles.filter}
                multiple
                limitTags={2}
                options={top100Films}
                getOptionLabel={(option) => option.title}
                value={filterValues.selectedKeyword}
                onChange={(event, value) => updateFilterValues('selectedKeyword', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Keyword"
                  />
                )}
              />

              <Autocomplete className={styles.filter}
                multiple
                limitTags={2}
                options={top100Films}
                getOptionLabel={(option) => option.title}
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