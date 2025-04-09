import React from 'react';
import { Typography, Paper } from '@mui/material';

/**
 * Card component for displaying key statistics
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the statistic
 * @param {string|number} props.value - The value to display
 * @param {string} props.variant - The Typography variant for the value (default: "h4")
 * @param {Object} props.sx - Additional styles to apply to the Paper component
 * @returns {JSX.Element} The KeyStatsCard component
 */
const KeyStatsCard = ({ title, value, variant = "h4", sx = {} }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, ...sx }}>
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant={variant} align="center">{value}</Typography>
    </Paper>
  );
};

export default KeyStatsCard;