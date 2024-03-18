import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import { RiMenu3Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import './SideBar.css';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function SideNavbar() {
  const navigate = useNavigate();

  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ left: open });
  };

  const handleLogout = () => {
    Cookies.remove('token');
    toast.success('Logout Successfully');
    navigate('/');
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/super-admin-dashboard')}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={'Home'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/change-password-super-admin')}
          >
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary={'Change Password'} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/profile-show-super-admin')}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={'Profile'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/create-company')}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={'Create Company'} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {/* {['All mail', 'Trash', 'Spam'].map((text, index) => ( */}
        <ListItem disablePadding onClick={handleLogout}>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={'LogOut'} />
          </ListItemButton>
        </ListItem>
        {/* ))} */}
      </List>
    </Box>
  );

  return (
    <div className="p-2">
      <RiMenu3Fill onClick={toggleDrawer('left', true)} className="menuIcon" />
      <Drawer anchor="left" open={state.left} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
}
