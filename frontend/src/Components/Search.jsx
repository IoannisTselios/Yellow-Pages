import React, { useState } from 'react';
import { OutlinedInput, Button } from '@mui/material';

import { useFilters } from "../Components/FiltersContext";

const SearchBar = () => {
  const { filterValues, updateFilterValues } = useFilters();  
  const [prompt, setPrompt] = useState('');

  const handleSearch = async () => {
    
    console.log(prompt);

    try {
      // Send POST request to the backend
      const response = await fetch('http://localhost:80/api/generate_query/', { 
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Prompt sending failed');
      }

      // If search is successful, handle response 
      const data = await response.json();
      updateFilterValues('filteredData', data);             
        
    } catch (error) {
        console.error('Error during search', error);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '16px' }}>
      <OutlinedInput
        value={prompt}
        placeholder="Enter a prompt here for AI-assisted search"
        onChange={(event) => setPrompt(event.target.value)} 
        sx={{ flexGrow: 1 }}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}> Search </Button>
    </div>
  );
};

export default SearchBar;