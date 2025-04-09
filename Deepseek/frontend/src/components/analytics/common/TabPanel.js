import React from 'react';
import { Box } from '@mui/material';

/**
 * TabPanel component that shows/hides content based on the current tab value
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to be displayed in the tab panel
 * @param {number} props.value - The current tab value
 * @param {number} props.index - The index of this tab panel
 * @returns {JSX.Element} The TabPanel component
 */
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default TabPanel;