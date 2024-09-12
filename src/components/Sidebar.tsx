
import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Box, Drawer, IconButton, List, ListItem, ListItemIcon, Popover, Toolbar, Tooltip, Typography } from '@mui/material';
import { FaAddressBook, FaBars, FaBriefcase, FaBuilding, FaChartLine, FaCog, FaDiceD6, FaHandshake, FaIndustry, FaSignOutAlt, FaSlidersH, FaTachometerAlt, FaUserFriends, FaUsers } from "react-icons/fa";
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { fetchData } from './FetchData';
import { ProfileUrl } from '../services/ApiUrls';
import { Header1 } from './FetchData';
import OrganizationModal from '../pages/organization/OrganizationModal';
import AddContacts from '../pages/contacts/AddContacts';
import Contacts from '../pages/contacts/Contacts';
import EditContact from '../pages/contacts/EditContacts';
import ContactDetails from '../pages/contacts/ContactDetails';
import Users from '../pages/users/Users';
import Deals from '../pages/deals/Deals';
import Cases from '../pages/cases/Cases';
import Accounts from '../pages/accounts/Accounts';
import { AddAccount } from '../pages/accounts/AddAccount';
import { EditAccount } from '../pages/accounts/EditAccount';
import { AccountDetails } from '../pages/accounts/AccountDetails';
import { AddUsers } from '../pages/users/AddUsers';
import { EditUser } from '../pages/users/EditUser';
import UserDetails from '../pages/users/UserDetails';
import { DealDetails } from '../pages/deals/DealDetails';
import { AddCase } from '../pages/cases/AddCase';
import { EditCase } from '../pages/cases/EditCase';
import { CaseDetails } from '../pages/cases/CaseDetails';
import logo from '../assets/images/auth/app_logo.png';
import { StyledListItemButton, StyledListItemText } from '../styles/CssStyled';
import MyContext, { useMyContext } from '../context/Context';
import DealsCardView from '../pages/deals/DealsCardView';


// declare global {
//     interface Window {
//         drawer: any;
//     }
// }

export default function Sidebar(props: any) {
    const navigate = useNavigate()
    const location = useLocation()
    const [screen, setScreen] = useState('contacts')
    const [drawerWidth, setDrawerWidth] = useState(200)
    const [headerWidth, setHeaderWidth] = useState(drawerWidth)
    const [loading, setLoading] = useState(true);
    const [userDetail, setUserDetail] = useState<any>(null);
    const [organizationModal, setOrganizationModal] = useState(false)
    // const [navList, setNavList] = useState<string[]>(['deals', 'contacts', 'accounts', 'users']);
    const organizationModalClose = () => { setOrganizationModal(false) }
    const { userRole, setUserRole, setUserId, userId, setProfileId, profileId } = useMyContext();
    console.log(userRole)

    useEffect(() => {
        toggleScreen()
    }, [navigate])

    const toggleScreen = () => {
        // console.log(location.pathname.split('/'), 'll')
        if (location.pathname.split('/')[1] === '' || location.pathname.split('/')[1] === undefined || location.pathname.split('/')[2] === 'leads') {
            setScreen('deals')
        } else if (location.pathname.split('/')[2] === 'contacts') {
            setScreen('contacts')
        } else if (location.pathname.split('/')[2] === 'deals') {
            setScreen('deals')
        } else if (location.pathname.split('/')[2] === 'accounts') {
            setScreen('accounts')
        } else if (location.pathname.split('/')[2] === 'companies') {
            setScreen('companies')
        } else if (location.pathname.split('/')[2] === 'users') {
            setScreen('users')
        } else if (location.pathname.split('/')[2] === 'cases') {
            setScreen('cases')
        }
    }

    useEffect(() => {
        userProfile()
    }, [])

    const Header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Token'),
        org: localStorage.getItem('org')
      }

    const userProfile = () => {
        fetchData(`${ProfileUrl}/`, 'GET', null as any, Header)
            .then((res: any) => {
                console.log(res, 'user')
                if (res?.user_obj) {
                    setUserDetail(res?.user_obj)
                    setUserRole(res?.user_obj.role)
                    setUserId(res?.user_obj.user_details.id)
                    setProfileId(res?.user_obj.id)
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error:', error)
                setLoading(false);
            })
    }


    const navList = userRole === 'USER' ? ['contacts', 'users'] : ['deals', 'contacts', 'accounts', 'users'];
    const navListBottom = userRole === 'ADMIN' ? ['dashboard', 'settings', 'profile', 'logout'] : ['profile', 'logout'];
    const navIcons = (text: any, screen: any): React.ReactNode => {
        switch (text) {
            case 'contacts':
                return screen === 'contacts' ? <FaAddressBook fill='#7B61FF' size={22} /> : <FaAddressBook size={22}/>
            case 'deals':
                return screen === 'deals' ? <FaHandshake fill='#7B61FF'  size={22}/> : <FaHandshake  size={22}/>
            case 'accounts':
                return screen === 'accounts' ? <FaBuilding fill='#7B61FF'  size={22}/> : <FaBuilding  size={22}/>
            case 'companies':
                return screen === 'companies' ? <FaIndustry fill='#7B61FF' size={22}/> : <FaIndustry size={22}/>
            // case 'analytics':
            //     return screen === 'analytics' ? <FaChartLine fill='#3e79f7' /> : <FaChartLine />
            case 'users':
                return screen === 'users' ? <FaUserFriends fill='#7B61FF' size={22}/> : <FaUserFriends size={22}/>
            case 'cases':
                return screen === 'cases' ? <FaBriefcase fill='#7B61FF' size={22}/> : <FaBriefcase size={22}/>
            default: return <FaDiceD6 fill='#7B61FF' />
        }
    }
    const navIconsBottom = (text: any, screen: any): React.ReactNode => {
        switch (text) {
            case 'logout':
                return screen === 'logout' ? <FaSignOutAlt fill='#7B61FF' size={22}/> : <FaSignOutAlt size={22}/>
            case 'profile':
                return screen === 'profile' ? <Avatar src={userDetail?.user_details?.profile_pic} sx={{ height: 30, width: 30 }} />:  <Avatar src={userDetail?.user_details?.profile_pic} sx={{ height: 30, width: 30 }} />;
            case 'dashboard':
                return screen === 'dashboard' ? <FaSlidersH fill='#7B61FF' size={22}/> : <FaSlidersH size={22}/>
            case 'settings':
                return screen === 'settings' ? <FaCog fill='#7B61FF' size={22}/> : <FaCog size={22}/>
        
        }
    }


    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        userProfile();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    // console.log(screen, 'sidebar');
    const context = { drawerWidth: drawerWidth, screen: screen }

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a loader/spinner
    }

    return (
        <>
            <Box>
                <AppBar position="fixed"
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        height: '60px',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        // boxShadow: 'none',
                        // borderBottom: `0.5px solid #0000001f`
                        boxShadow: '1px'
                    }}
                >
                    <Box>
                        <Toolbar>
                            {drawerWidth === 70 ? <img src={logo} width={'30px'} style={{  marginLeft: '-5px', marginRight: '15px' }} /> : <img src={logo} width={'40px'} style={{ marginLeft: '-5px', marginRight: '40px' }} />}
                            <IconButton sx={{ ml: '-10px' }} onClick={() => setDrawerWidth(drawerWidth === 70 ? 200 : 70)}>
                                <FaBars style={{ height: '20px' }} />
                            </IconButton>
                            <Typography sx={{ fontWeight: 'bold', color: 'black', ml: '20px', textTransform: 'capitalize', xfontSize: '20px', mt: '5px' }}>
                                {screen}
                            </Typography>
                        </Toolbar>
                    </Box>
                    <Box style={{
                        marginRight: '10px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        {/* <IconButton onClick={userProfile} sx={{ mr: 2 }}><FaCog /></IconButton> */}
                        <IconButton onClick={handleClick} sx={{ mr: 3 }}>
                            <Avatar
                                src={userDetail.user_details.profile_pic}
                                sx={{ height: '27px', width: '27px' }}
                            />
                        </IconButton>
                        <Popover
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                        >
                            <List disablePadding>
                                <ListItem disablePadding>
                                    <StyledListItemButton onClick={() => {
                                        localStorage.clear()
                                        navigate('/login')
                                    }}>
                                        <ListItemIcon > <FaSignOutAlt fill='#3e79f7' /></ListItemIcon>
                                        <StyledListItemText primary={'Sign out'} sx={{ ml: '-20px', color: '#3e79f7' }} />
                                    </StyledListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <StyledListItemButton onClick={() => setOrganizationModal(!organizationModal)}>
                                        <ListItemIcon > <FaIndustry fill='#3e79f7' /></ListItemIcon>
                                        <StyledListItemText primary={'Organization'} sx={{ ml: '-20px', color: '#3e79f7' }} />
                                    </StyledListItemButton>
                                </ListItem>
                            </List>
                            {/* <Tooltip title='logout' sx={{ ml: '15px' }}>
                                <IconButton
                                    >
                                </IconButton>
                            </Tooltip> */}
                        </Popover>
                    </Box>
                </AppBar>

                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' , backgroundColor: '#031C30',},
                        display: 'flex',
                        height: '100%',
                        
                        
                    }}
                >
                    <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
                        <List sx={{ pt: '65px' }}>
                            {navList.map((text, index) => (
                                <ListItem key={text} disablePadding  >
                                    <StyledListItemButton
                                        sx={{ pt: '10px', pb: '10px' , display: 'flex', alignItems: 'center' }}
                                        onClick={() => {
                                            if (text === "deals") {
                                                navigate(`/app/deals`);
                                            } else {
                                                navigate(`/app/${text}`);
                                            }
                                            setScreen(text);
                                        }}
                                        selected={screen === text}
                                    >
                                        <ListItemIcon sx={{ ml: '1px', color: 'white',  display: 'flex', alignItems: 'center'}}>
                                            {navIcons(text, screen)}
                                        </ListItemIcon>
                                        {drawerWidth !== 70 && (
                                                <StyledListItemText primary={text} sx={{ ml: -2, textTransform: 'capitalize', color: 'white' }} />
                                            )}
                                    </StyledListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Box sx={{  display: 'flex', flexDirection: 'column', mb: '20px' }}>
                        <List sx={{ pt: '65px' }}>
                            {navListBottom.map((text, index) => (
                                <ListItem key={text} disablePadding  >
                                    <StyledListItemButton
                                        sx={{ pt: '10px', pb: '10px', display: 'flex', alignItems: 'center'  }}
                                        onClick={() => {
                                            if (text === "logout") {
                                                localStorage.clear();
                                                navigate('/login');
                                            } else {
                                                navigate(`/app/${text}`);
                                            }
                                            setScreen(text);
                                        }}
                                        selected={screen === text}
                                    >
                                        <ListItemIcon sx={{ ml: '-5px', color: 'white', minWidth: '40px', justifyContent: 'center' , display: 'flex', alignItems: 'center'}}>
                                            {navIconsBottom(text, screen)}
                                        </ListItemIcon>
                                        {drawerWidth !== 70 && (
                                            <StyledListItemText primary={text} sx={{ ml: '15px', textTransform: 'capitalize', color: 'white' }} />
                                        )}
                                    </StyledListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    

                </Drawer>
                {/* <MyContext.Provider value={context}> */}

                    {/* <Box sx={{ width: drawerWidth === 60 ? '1380px' : '1240px', ml: drawerWidth === 60 ? '60px' : '200px', overflowX: 'hidden' }}> */}
                    <Box sx={{ width: 'auto', ml: drawerWidth === 70 ? '70px' : '200px', overflowX: 'hidden' }}>
                        <Routes>
                            <Route path='/app/contacts' element={<Contacts />} />
                            <Route path='/app/contacts/add-contacts' element={<AddContacts />} />
                            <Route path='/app/contacts/contact-details' element={<ContactDetails />} />
                            <Route path='/app/contacts/edit-contact' element={<EditContact />} />
                            <Route path='/app/accounts' element={<Accounts />} />
                            <Route path='/app/accounts/add-account' element={<AddAccount />} />
                            <Route path='/app/accounts/account-details' element={<AccountDetails />} />
                            <Route path='/app/accounts/edit-account' element={<EditAccount />} />
                            <Route path='/app/users' element={<Users />} />
                            <Route path='/app/users/add-users' element={<AddUsers />} />
                            <Route path='/app/users/edit-user' element={<EditUser />} />
                            <Route path='/app/users/user-details' element={<UserDetails />} />
                            <Route path='/app/deals' element={<Deals />} />
                            <Route path='/app/deals/card-view' element={<DealsCardView />} />
                            <Route path='/app/deals/deal-details' element={<DealDetails />} />
                            <Route path='/app/cases' element={<Cases />} />
                            <Route path='/app/cases/add-case' element={<AddCase />} />
                            <Route path='/app/cases/edit-case' element={<EditCase />} />
                            <Route path='/app/cases/case-details' element={<CaseDetails />} />
                        </Routes>
                    </Box>
                {/* </MyContext.Provider> */}
                <OrganizationModal
                    open={organizationModal}
                    handleClose={organizationModalClose}
                />
            </Box >
        </>

    )
}

