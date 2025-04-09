import React from 'react';
import { Card, CardActionArea, Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, link, iconColor, iconBgColor, theme }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(to bottom, ${theme.palette.background.paper}, rgba(19, 47, 76, 0.8))`,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
        }
      }}
    >
      <CardActionArea 
        component={RouterLink} 
        to={link}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          flexGrow: 1,
          p: 3
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: iconBgColor,
          }}
        >
          <Icon sx={{ fontSize: 36, color: iconColor }} />
        </Box>
        <Typography variant="h5" component="h3" gutterBottom align="center">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default FeatureCard;