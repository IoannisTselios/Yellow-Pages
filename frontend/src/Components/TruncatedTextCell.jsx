import React from 'react';
import { Tooltip } from '@mui/material';

const TruncatedTextCell = ({ value }) => {
  const displayText = value !== '' && value !== 'nan' ? value : '-';

  return (
    <Tooltip title={displayText} arrow>
      <div
        style={{
          display: '-webkit-box', // Enable flexbox for multi-line truncation
          WebkitBoxOrient: 'vertical', // Set box orientation to vertical (for text)
          overflow: 'hidden', // Hide text that overflows
          WebkitLineClamp: 3, // Limit to 3 lines
          textOverflow: 'ellipsis', // Add ellipsis (...) when truncated
          wordWrap: 'break-word', // Ensure long words break properly
        }}
      >
        {displayText}
      </div>
    </Tooltip>
  );
};

export default TruncatedTextCell;
