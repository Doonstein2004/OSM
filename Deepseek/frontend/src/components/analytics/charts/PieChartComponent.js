import React from 'react';
import { Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { safeToFixed } from '../../../utils/formatters';

// Default colors for the pie chart
const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

/**
 * Reusable Pie Chart component
 * 
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Data for the pie chart
 * @param {string} props.dataKey - The key in data objects to use for the pie values
 * @param {string} props.nameKey - The key in data objects to use for segment names
 * @param {number} props.height - Height of the chart (default: 300)
 * @param {Array<string>} props.colors - Colors to use for the chart (optional)
 * @param {Object} props.tooltipFormatter - Function to format tooltip values (optional)
 * @returns {JSX.Element} The PieChartComponent
 */
const PieChartComponent = ({ 
  data, 
  dataKey, 
  nameKey = 'name',
  height = 300, 
  colors = DEFAULT_COLORS,
  tooltipFormatter
}) => {
  const renderCustomizedLabel = ({ name, percent }) => {
    return `${name}: ${safeToFixed(percent * 100, 1)}%`;
  };

  return (
    <Box sx={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey={dataKey}
            nameKey={nameKey}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PieChartComponent;