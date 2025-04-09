import React from 'react';
import { Box } from '@mui/material';
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

/**
 * Reusable Radar Chart component
 * 
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Data for the radar chart
 * @param {string} props.dataKey - The key for radar values
 * @param {string} props.nameKey - The key for data point names
 * @param {number} props.height - Height of the chart (default: 400)
 * @param {string} props.stroke - Color for stroke (optional)
 * @param {string} props.fill - Color for fill (optional)
 * @param {number} props.fillOpacity - Opacity for fill (default: 0.6)
 * @param {string} props.name - Name for the data series
 * @returns {JSX.Element} The RadarChartComponent
 */
const RadarChartComponent = ({ 
  data, 
  dataKey, 
  nameKey = 'subject', 
  height = 400, 
  stroke = '#8884d8', 
  fill = '#8884d8', 
  fillOpacity = 0.6, 
  name = 'Series'
}) => {
  return (
    <Box sx={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius={90} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey={nameKey} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar 
            name={name} 
            dataKey={dataKey} 
            stroke={stroke} 
            fill={fill} 
            fillOpacity={fillOpacity} 
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RadarChartComponent;