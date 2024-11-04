import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ResponsiveDrawer from './Deliveryboysidebar'; // Sidebar component

interface MainLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <ResponsiveDrawer /> {/* Sidebar Component */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm:` calc(100% - ${drawerWidth}px)` },
          p: 3,
        }}
      >
        <Toolbar />
        {children} {/* This is where page content will be rendered */}
      </Box>
    </Box>
  );
};

export default MainLayout;