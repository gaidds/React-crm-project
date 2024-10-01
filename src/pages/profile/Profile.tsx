import { FC } from 'react';
import './styles.css';
import { UserDataProps } from './types';
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { Typography } from '@mui/material';

const ProfilePage: FC<UserDataProps> = ({ userData }) => {
  console.log(userData)
  return (
    <div className="profile-page-container">
      <div className="profile-page-header">
        <p>Edit</p>
      </div>
      <div className="profile-page-body">
        <div className="profile-page-left-section"></div>
        <div className="profile-page-right-section"> 
          <Typography className='profile-page-user-role' variant="h4" gutterBottom>
            {userData.role}
          </Typography>

          <div className='profil-page-user-details-container'> <MdEmail className='profile-page-user-details-icon' /><Typography variant="h6">{userData.user_details.email}</Typography></div>
          <div className='profil-page-user-details-container'><FaPhone className='profile-page-user-details-icon' /><Typography variant="h6">{userData.phone}</Typography></div>
          <div className='profil-page-user-details-container'><IoLocationSharp className='profile-page-user-details-icon' /><Typography variant="h6">{`${userData.address.street}, ${userData.address.postcode}, ${userData.address.city}, ${userData.address.state}, ${userData.address.country}`}</Typography></div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
