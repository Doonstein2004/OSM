import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Divider,
  useMediaQuery,
  Avatar,
  Container
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TableChartIcon from '@mui/icons-material/TableChart';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import CloseIcon from '@mui/icons-material/Close';

const NavigationMenu = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const menuItems = [
    { text: 'Inicio', path: '/', icon: <HomeIcon /> },
    { text: 'Equipos', path: '/teams', icon: <SportsSoccerIcon /> },
    { text: 'Partidos', path: '/matches', icon: <ListAltIcon /> },
    { text: 'Clasificación', path: '/standings', icon: <TableChartIcon /> },
    { text: 'Estadísticas', path: '/analytics', icon: <EqualizerIcon /> },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ width: 280, height: '100%', backgroundColor: theme.palette.background.default }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        p={2}
        sx={{ backgroundColor: theme.palette.primary.dark }}
      >
        <Typography variant="h6" component="div" sx={{ color: '#fff', fontWeight: 'bold' }}>
          FUTBOL SIMULATOR
        </Typography>
        <IconButton edge="end" color="inherit" onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={item.text}
            onClick={handleDrawerToggle}
            sx={{
              backgroundColor: isActive(item.path) ? 'rgba(144, 202, 249, 0.08)' : 'transparent',
              borderLeft: isActive(item.path) ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
              '&:hover': {
                backgroundColor: 'rgba(144, 202, 249, 0.12)',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.secondary
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: isActive(item.path) ? '600' : '400',
                color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.primary
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ 
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Avatar 
                  src="/soccer-ball.svg" 
                  alt="Logo"
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                  FUTBOL SIM
                </Typography>
              </>
            ) : (
              <>
                <Avatar 
                  src="/soccer-ball.svg" 
                  alt="Logo"
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Typography variant="h6" component={Link} to="/" sx={{ 
                  mr: 4, 
                  textDecoration: 'none', 
                  color: 'white',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  FUTBOL SIMULATOR
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                  {menuItems.map((item) => (
                    <Button
                      key={item.text}
                      component={Link}
                      to={item.path}
                      sx={{
                        my: 2, 
                        mx: 1,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        fontWeight: isActive(item.path) ? '600' : '400',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          backgroundColor: theme.palette.primary.main,
                          transform: isActive(item.path) ? 'scaleX(1)' : 'scaleX(0)',
                          transition: 'transform 0.2s ease-in-out'
                        },
                        '&:hover::after': {
                          transform: 'scaleX(1)'
                        }
                      }}
                      startIcon={item.icon}
                    >
                      {item.text}
                    </Button>
                  ))}
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default NavigationMenu;