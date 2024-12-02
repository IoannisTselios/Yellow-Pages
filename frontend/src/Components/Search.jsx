import React, { useState } from 'react';
import { OutlinedInput, Button } from '@mui/material';

import { useFilters } from "../Components/FiltersContext";

const SearchBar = ({setLoadingData, setLoadingTable}) => {
  const { filterValues, updateFilterValues } = useFilters();  
  // const [prompt, setPrompt] = useState('');

  const handleSearch = async () => {
    updateFilterValues('mode', 'search');
    
    console.log(filterValues.prompt);

    setLoadingData(true);  //Loading set to true before the fetch request
    setLoadingTable(true);  //Loading table set to true before the fetch request

    // initialize paging before request
    const pagModel = {page: 0, pageSize: filterValues.paginationModel.pageSize}
    updateFilterValues('paginationModel', pagModel)

    const baseURL = 'http://localhost:80/api/generate_query/';
    updateFilterValues('requestURL', baseURL);

    try {
      // Send POST request to the backend
      const response = await fetch(baseURL, { 
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          prompt: filterValues.prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Prompt sending failed');
      }

      // If search is successful, handle response 
      const data = await response.json(); 
      updateFilterValues('filteredData', data.results);
      await updateFilterValues('rowCount', data.count);           
        
    } catch (error) {
        console.error('Error during search', error);
    } finally {
      setLoadingData(false);  //Loading set to false when the fetch is done or an error occurs
      setLoadingTable(false);  //Loading table set to false when the fetch is done or an error occurs
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '16px' }}>
      <OutlinedInput
        value={filterValues.prompt}
        placeholder="Enter a prompt here for AI-assisted search"
        onChange={(event) => updateFilterValues('prompt', event.target.value)} 
        sx={{ flexGrow: 1 }}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}> Search </Button>
    </div>
  );
};

export default SearchBar;