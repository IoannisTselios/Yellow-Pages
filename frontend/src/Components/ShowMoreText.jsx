import React, { useState } from 'react';

const ShowMoreText = ({ text, limit = 180, style }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const isTextTruncated = text.length > limit;

  return (
    <p style={{ ...style }}>
      {isTextTruncated
        ? isExpanded
          ? `${text} `
          : `${text.slice(0, limit)}... `
        : text}
      {isTextTruncated && (
        <span
          onClick={toggleExpanded}
          style={{
            color: '#B3B3B3',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </span>
      )}
    </p>
  );
};

export default ShowMoreText;
