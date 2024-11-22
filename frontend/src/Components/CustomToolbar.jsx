import React from 'react';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarExport } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const CustomToolbar = (props) => {
  return (
    <GridToolbarContainer sx={{ paddingBottom: '4px' }}>
      <GridToolbarColumnsButton />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarExport
        printOptions={props.printOptions}
        slotProps={{
          tooltip: { title: 'Export selected rows' },
          button: { variant: 'outlined' },
        }}
      />
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
