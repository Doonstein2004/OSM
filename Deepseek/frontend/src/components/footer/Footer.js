import React from 'react';
import { Box, Container, Typography, Link, Divider, useTheme } from '@mui/material';
import { SportsSoccer as SoccerIcon } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
            <SoccerIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
              LIGA SIMULATOR
            </Typography>
          </Box>
          <Link>
            SanPancho.com
          </Link>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {currentYear}
            {' Liga Simulator. Todos los derechos reservados.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;