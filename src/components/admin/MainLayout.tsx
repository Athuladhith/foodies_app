import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ResponsiveDrawer from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <ResponsiveDrawer /> 
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)`},
          p: 3,
        }}
      >
        <Toolbar />
        {children} 
      </Box>
    </Box>
  );
};

export default MainLayout;