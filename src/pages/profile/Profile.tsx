import { FC, useEffect, useState } from 'react';
import './styles.css';
import { UserDataProps } from './types';
import { fetchData, Header } from '../../components/FetchData';
import { UsersUrl, UserUrl } from '../../services/ApiUrls';
import { useMyContext } from '../../context/Context';
import DynamicModal from '../../components/modal/modal';

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
    (async () => await getUsers())();
  }, [userData]);
  useEffect(() => {
    (async () => await getUser())();
  }, [data]);

  console.log('--------------------------', user);

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
        <div className="profile-page-left-section"></div>
        <div className="profile-page-right-section"></div>
      </div>
    </div>
  );
};

export default ProfilePage;
