import React from 'react';
import { Box, useTheme } from '@mui/material';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * Reusable Bar Chart component
 * 
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Data for the bar chart
 * @param {string} props.dataKey - The data key for the bar values
 * @param {string} props.xAxisKey - The key for x-axis values
 * @param {number} props.height - Height of the chart (default: 300)
 * @param {string} props.fill - Color for the bars (optional)
 * @param {boolean} props.vertical - Whether to display bars vertically (default: true)
 * @param {Object} props.margin - Chart margins (optional)
 * @param {string} props.yAxisLabel - Label for the Y axis (optional)
 * @param {Object} props.xAxisConfig - Additional configuration for X axis (optional)
 * @returns {JSX.Element} The BarChartComponent
 */
const BarChartComponent = ({ 
  data, 
  dataKey, 
  xAxisKey = 'name', 
  height = 300, 
  fill,
  vertical = true,
  margin = { top: 5, right: 30, left: 20, bottom: 5 },
  yAxisLabel,
  xAxisConfig = {}
}) => {
  const theme = useTheme();
  const barFill = fill || theme.palette.primary.main;
  
  // Configure Y axis with label if provided
  const yAxisProps = yAxisLabel ? {
    label: { 
      value: yAxisLabel, 
      angle: -90, 
      position: 'left',
      style: { fill: theme.palette.text.primary }
    }
  } : {};

  // Configure X axis with any additional props
  const xAxisProps = {
    dataKey: xAxisKey,
    ...xAxisConfig
  };

  return (
    <Box sx={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={margin}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis {...xAxisProps} />
          <YAxis {...yAxisProps} />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={barFill} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChartComponent;