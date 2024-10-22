import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, Box, List } from '@mui/material';
import {
  FaAddressBook,
  FaCog,
  FaHandshake,
  FaIndustry,
  FaSignOutAlt,
  FaSlidersH,
  FaUserFriends,
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchData } from '../FetchData';
import { ProfileUrl } from '../../services/ApiUrls';
import logo from '../../assets/images/auth/app_logo.png';
import './styles.css';
import { useMyContext } from '../../context/Context';
import Nav from './Nav';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [screen, setScreen] = useState('contacts');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<boolean>(true);

  const {
    userRole,
    setUserRole,
    setUserId,
    setProfileId,
    userData,
    setUserData,
  } = useMyContext();

  useEffect(() => {
    toggleScreen();
  }, [location.pathname]);

  useEffect(() => {
    userProfile();
  }, []);

  const toggleScreen = () => {
    const currentScreen = location.pathname.split('/')[2] || 'deals';
    if (currentScreen !== screen) {
      setScreen(currentScreen);
    }
  };

  const Header = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('Token'),
    org: localStorage.getItem('org'),
  };

  const userProfile = () => {
    fetchData(`${ProfileUrl}/`, 'GET', null as any, Header)
      .then((res: any) => {
        if (res?.user_obj) {
          setUserData(res?.user_obj);
          setUserRole(res?.user_obj.role);
          setUserId(res?.user_obj.user_details.id);
          setProfileId(res?.user_obj.id);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  };

  const navigations = useMemo(
    () => [
      {
        name: 'contacts',
        icone: <FaAddressBook className="nav-icon" size={24} />,
        canAccess: ['USER', 'ADMIN', 'SALES MANAGER', 'SALES REP'],
        position: 'top',
      },
      {
        name: 'deals',
        icone: <FaHandshake className="nav-icon" size={24} />,
        canAccess: ['ADMIN', 'SALES MANAGER', 'SALES REP'],
        position: 'top',
      },
      {
        name: 'accounts',
        icone: <FaIndustry className="nav-icon" size={24} />,
        canAccess: ['ADMIN', 'SALES MANAGER', 'SALES REP'],
        position: 'top',
      },
      {
        name: 'users',
        icone: <FaUserFriends className="nav-icon" size={24} />,
        canAccess: ['USER', 'ADMIN', 'SALES MANAGER', 'SALES REP'],
        position: 'top',
      },

      {
        name: 'dashboard',
        icone: <FaSlidersH className="nav-icon" size={24} />,
        canAccess: ['ADMIN', 'SALES MANAGER'],
        position: 'bottom',
      },
      {
        name: 'settings',
        icone: <FaCog className="nav-icon" size={24} />,
        canAccess: ['ADMIN'],
        position: 'bottom',
      },
      {
        name: 'profile',
        icone: (
          <Avatar
            src={userData?.user_details?.profile_pic}
            sx={{ height: 30, width: 30 }}
          />
        ),
        canAccess: ['USER', 'ADMIN', 'SALES MANAGER', 'SALES REP'],
        position: 'bottom',
      },
      {
        name: 'logout',
        icone: <FaSignOutAlt className="nav-icon" size={24} />,
        canAccess: ['USER', 'ADMIN', 'SALES MANAGER', 'SALES REP'],
        position: 'bottom',
      },
    ],
    [userRole]
  );

  const handleClick = (name: string) => {
    if (name === 'logout') {
      localStorage.clear();
      navigate('/login');
    } else if (name === 'profile') {
      navigate(`/app/profile/${userData?.id}`);
    } else {
      navigate(`/app/${name}`);
    }
    setScreen(name);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderNavItems = (position: 'top' | 'bottom') =>
    navigations
      .filter(
        (nav) =>
          nav.position === position &&
          nav.canAccess.includes(userRole as string)
      )
      .map(({ name, icone }, idx) => (
        <Nav
          key={name + idx}
          screen={screen}
          open={open}
          name={name}
          icone={icone}
          handleClick={() => handleClick(name)}
        />
      ));

  return (
    <Box>
      <div className="sidbar">
        <Box className="sidebar-top-container">
          <div
            className="sidebar-logo-container"
            onClick={() => setOpen(!open)}
          >
            <img className="sidebar-logo" src={logo} alt="App Logo" />
            {open && <span className="sidebar-app-name">Bottle CRM</span>}
          </div>
        </Box>
        <Box className="sidebar-nav-top">
          <List>{renderNavItems('top')}</List>
        </Box>
        <Box className="sidebar-nav-botton">
          <List>{renderNavItems('bottom')}</List>
        </Box>
      </div>
    </Box>
  );
};

export default Sidebar;
