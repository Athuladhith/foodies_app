

import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ResponsiveDrawer from './RestaurantSidebar';
import { CssBaseline } from '@mui/material';

const drawerWidth = 0;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <CssBaseline />
      <ResponsiveDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: { sm: `${drawerWidth}px` }, 
          backgroundColor: '#ffffff',
          boxShadow: 2,
          borderRadius: 2,
          m: 0,
          overflow: 'hidden',
        }}
      >
        <Toolbar />
        <Box sx={{ padding: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
