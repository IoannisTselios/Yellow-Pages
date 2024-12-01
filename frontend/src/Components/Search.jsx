import React from 'react';
import { OutlinedInput, Button } from '@mui/material';

const SearchBar = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '16px' }}>
      <OutlinedInput
        placeholder="Enter a search prompt here"
        sx={{ flexGrow: 1 }}
      />
      <Button variant="contained" color="primary"> Search </Button>
    </div>
  );
};

export default SearchBar;


//onClick={handleApply}