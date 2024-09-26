import { FC } from 'react';
import './styles.css';
import { UserDataProps } from './types';

const ProfilePage: FC<UserDataProps> = ({ userData }) => {
  return <div className="profile-page-container">Profile Page</div>;
};

export default ProfilePage;
