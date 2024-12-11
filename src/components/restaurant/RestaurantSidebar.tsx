


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import CategoryIcon from '@mui/icons-material/Category';
import MessageIcon from '@mui/icons-material/Message';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DashboardIcon from '@mui/icons-material/Dashboard'


const drawerWidth = 260;

const menuItems = [
  { text: 'Restaurant Home', icon: <RestaurantIcon />, to: 'restauranthome' },
  { text: 'Food Items', icon: <FastfoodIcon />, to: 'fooditem' },
  { text: 'Categories', icon: <CategoryIcon />, to: 'categorylist' },
  { text: 'Cuisines', icon: <RestaurantMenuIcon />, to: 'cuisine' },
  { text: 'Messages', icon: <MessageIcon />, to: 'restaurantchat' },
  { text: 'Dashboard', icon: <DashboardIcon />, to: 'dashboard' },
];

interface Props {
  window?: () => Window;
}

const ResponsiveDrawer: React.FC<Props> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/restaurantlogin');
  };

  const drawer = (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1e88e5, #42a5f5)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#ffffff',
      }}
    >
      <Box>
        <Toolbar
          sx={{
            justifyContent: 'center',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            py: 2,
            color: '#ffffff',
          }}
        >
          Dashboard
        </Toolbar>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />
        <List>
           {menuItems.map((item, index) => (
             <ListItem key={index} disablePadding>
               <ListItemButton
                 component={Link}
                 to={`/${item.to}`}
                 sx={{
                   color: '#ffffff',
                  '&:hover': {
                   background: 'rgba(255, 255, 255, 0.1)',
                   },
                }}
              >
                <ListItemIcon sx={{ color: '#ffffff' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
             </ListItemButton>
           </ListItem>
          ))}
         </List>
      </Box>
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { sm: 'none' },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Restaurant Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default ResponsiveDrawer;
