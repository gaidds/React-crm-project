import { FC } from 'react';
import './styles.css';
import { UserDataProps } from './types';

const ProfilePage: FC<UserDataProps> = ({ userData }) => {
  return (
    <div className="profile-page-container">
      <div className="profile-page-header">
        <p>Edit</p>
      </div>
      <div className="profile-page-body">
        <div className="profile-page-left-section"></div>
        <div className="profile-page-right-section"></div>
      </div>
    </div>
  );
};

export default ProfilePage;
