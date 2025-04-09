import React from 'react';
import { Box } from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

/**
 * Reusable Line Chart component
 * 
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Data for the line chart
 * @param {Array<Object>} props.lines - Configuration for each line
 * @param {string} props.xAxisKey - The key for x-axis values
 * @param {number} props.height - Height of the chart (default: 300)
 * @param {Object} props.margin - Chart margins (optional)
 * @param {Object} props.yAxisConfig - Configuration for Y axis (optional)
 * @returns {JSX.Element} The LineChartComponent
 */
const LineChartComponent = ({ 
  data, 
  lines, 
  xAxisKey = 'name', 
  height = 300, 
  margin = { top: 5, right: 30, left: 20, bottom: 5 },
  yAxisConfig = {}
}) => {
  return (
    <Box sx={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis {...yAxisConfig} />
          <Tooltip />
          <Legend />
          
          {lines.map((line, index) => (
            <Line
              key={`line-${index}`}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke || '#8884d8'}
              strokeWidth={line.strokeWidth || 2}
              name={line.name || line.dataKey}
              dot={line.dot}
              activeDot={line.activeDot}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LineChartComponent;