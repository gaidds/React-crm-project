import { FC, useState } from 'react';
import './styles.css';
import { UserDataProps } from './types';
import ImgUploader from '../../components/img-uploader/ImgUploader';
import { Chip, Button, Avatar } from '@mui/material';

const ProfilePage: FC<UserDataProps> = ({ userData }) => {
  const [profilePic, setProfilePic] = useState<string | undefined>(
    userData.user_details.profile_pic
  );
  userData.is_active = false;
  return (
    <div className="profile-page-container">
      <div className="profile-page-header">
        <p>Edit</p>
      </div>
      <div className="profile-page-body">
        <div className="profile-page-left-section">
          <Chip
            className={`profile-user-status ${
              !userData.is_active && 'profile-user-status-inactive'
            }`}
            label={userData.is_active ? 'ACTIVE' : 'INACTIVE'}
            variant="outlined"
          />
          <Avatar
            className="porfile-page-user-img"
            alt={userData.user_details.first_name || undefined}
            src={profilePic}
          />

          <ImgUploader
            name="profile_pic"
            onChange={(e) => setProfilePic(e.target.value)}
            customWidget={
              <Button variant="text" className="edit-profile-pic-btn">
                Edit
              </Button>
            }
          />
          <div className="profile-page-user-name-container">
            <span>{userData.user_details.first_name || 'Welcome!'}</span>
            <span>{userData.user_details.last_name}</span>
          </div>
        </div>
        <div className="profile-page-right-section"></div>
      </div>
    </div>
  );
};

export default ProfilePage;
