import { FC, useEffect, useState } from 'react';
import './styles.css';
import { UserDataProps } from './types';
import { fetchData, Header } from '../../components/FetchData';
import { UsersUrl, UserUrl } from '../../services/ApiUrls';
import DynamicModal from '../../components/modal/modal';
import { Chip, Button, Avatar, Typography } from '@mui/material';
import { MdEmail } from 'react-icons/md';
import { FaPhone } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';

const ProfilePage: FC<UserDataProps> = ({ userData }) => {
  const [data, setData] = useState<any[]>([]);
  const [user, setUser] = useState<any>();

  const getUsers = async () => {
    try {
      await fetchData(`${UsersUrl}`, 'GET', null as any, Header).then((res) => {
        if (!res.error) {
          setData(res || []);
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getUser = async () => {
    try {
      await fetchData(
        `${UserUrl}/${userData.id}`,
        'GET',
        null as any,
        Header
      ).then((res) => {
        if (!res.error) {
          setUser(res.data.profile_obj || []);
        }
      });
    } catch (error) {}
  };
  useEffect(() => {
    (async () => await getUser())();
  }, []);

  useEffect(() => {
    (async () => await getUsers())();
  }, [userData]);

  return (
    <div className="profile-page-container">
      <div className="profile-page-header">
        <DynamicModal
          page="Users"
          mode="edit"
          id={userData.id}
          data={data}
          onSaveSuccess={async () => {
            await getUsers();
            await getUser();
          }}
        />
      </div>
      <div className="profile-page-body">
        <div className="profile-page-left-section">
          <Chip
            className={`profile-user-status ${
              !user?.is_active && 'profile-user-status-inactive'
            }`}
            label={user?.is_active ? 'ACTIVE' : 'INACTIVE'}
            variant="outlined"
          />
          <Avatar
            className="porfile-page-user-img"
            alt={user?.user_details.first_name || undefined}
            src={user?.user_details.profile_pic}
          />
          <div className="profile-page-user-name-container">
            <span>{user?.user_details.first_name || 'Welcome!'}</span>
            <span>{user?.user_details.last_name}</span>
          </div>
        </div>
        <div className="profile-page-right-section">
          <Typography
            className="profile-page-user-role"
            variant="h3"
            gutterBottom
          >
            {user?.role}
          </Typography>

          <div className="profil-page-user-details-container">
            {' '}
            <MdEmail className="profile-page-user-details-icon" />
            <Typography variant="h6">{user?.user_details.email}</Typography>
          </div>
          <div className="profil-page-user-details-container">
            <FaPhone className="profile-page-user-details-icon" />
            <Typography variant="h6">{user?.phone}</Typography>
          </div>
          <div className="profil-page-user-details-container">
            <IoLocationSharp className="profile-page-user-details-icon" />
            <div>
              <Typography variant="h6">
                {`${user?.address.street}, ${user?.address.postcode},`}
              </Typography>
              <Typography variant="h6">
                {`${user?.address.city}, ${user?.address.state},`}
              </Typography>
              <Typography variant="h6">{user?.address.country}</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
