import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ResponsiveDrawer from './RestaurantSidebar';

const drawerWidth = 240;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <ResponsiveDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          p: 0, // Ensure no padding here
        }}
      >
        <Toolbar />
        <Box sx={{ padding: 2 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
