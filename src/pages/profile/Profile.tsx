import { FC, useEffect, useState } from 'react';
import './styles.css';
import { fetchData, Header } from '../../components/FetchData';
import { UsersUrl, UserUrl } from '../../services/ApiUrls';
import DynamicModal from '../../components/modal/modal';
import { Chip, Avatar, Typography } from '@mui/material';
import { MdEmail } from 'react-icons/md';
import { FaPhone } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { useMyContext } from '../../context/Context';

const ProfilePage: FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<any[]>([]);
  const { userData: currentUserData, setUserData: setCurrentUserData } =
    useMyContext();
  const [userData, setUserData] = useState<any>();

  const isProfileOwner = () => {
    return currentUserData.id === id;
  };

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
      await fetchData(`${UserUrl}/${id}`, 'GET', null as any, Header).then(
        (res) => {
          if (!res.error) {
            if (isProfileOwner()) {
              setCurrentUserData(res.data.profile_obj || []);
            }
            setUserData(res.data.profile_obj || []);
          }
        }
      );
    } catch (error) {}
  };
  useEffect(() => {
    if (isProfileOwner()) {
      setUserData(currentUserData);
    } else {
      (async () => await getUser())();
    }
  }, []);

  useEffect(() => {
    (async () => await getUsers())();
    (async () => await getUser())();
  }, [id]);

  return (
    <div className="profile-page-container">
      {(isProfileOwner() || currentUserData.role === 'ADMIN') && (
        <div className="profile-page-header">
          <DynamicModal
            page="Users"
            mode="edit"
            id={id}
            data={data}
            onSaveSuccess={async () => {
              await getUsers();
              await getUser();
            }}
          />
        </div>
      )}

      <div className="profile-page-body">
        <div className="profile-page-left-section">
          <Chip
            className={`profile-user-status ${
              !userData?.is_active && 'profile-user-status-inactive'
            }`}
            label={userData?.is_active ? 'ACTIVE' : 'INACTIVE'}
            variant="outlined"
          />
          <Avatar
            className="porfile-page-user-img"
            alt={userData?.user_details.first_name || undefined}
            src={userData?.user_details.profile_pic}
          />
          <div className="profile-page-user-name-container">
            <span>{userData?.user_details.first_name || 'Welcome!'}</span>
            <span>{userData?.user_details.last_name}</span>
          </div>
        </div>
        <div className="profile-page-right-section">
          <Typography
            className="profile-page-user-role"
            variant="h3"
            gutterBottom
          >
            {userData?.role}
          </Typography>

          <div className="profil-page-user-details-container">
            {' '}
            <MdEmail className="profile-page-user-details-icon" />
            <Typography variant="h6">{userData?.user_details.email}</Typography>
          </div>
          <div className="profil-page-user-details-container">
            <FaPhone className="profile-page-user-details-icon" />
            <Typography variant="h6">{userData?.phone}</Typography>
          </div>
          <div className="profil-page-user-details-container">
            <IoLocationSharp className="profile-page-user-details-icon" />
            <div>
              <Typography variant="h6">
                {`${userData?.address.street}, ${userData?.address.postcode},`}
              </Typography>
              <Typography variant="h6">
                {`${userData?.address.city}, ${userData?.address.state},`}
              </Typography>
              <Typography variant="h6">{userData?.address.country}</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
