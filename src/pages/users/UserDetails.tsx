import React, { useEffect, useState } from 'react';
import { Card, Avatar, Box } from '@mui/material';
import { CustomAppBar } from '../../components/CustomAppBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { AntSwitch } from '../../styles/CssStyled';
import { UserUrl } from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';
import { useMyContext } from '../../context/Context';

type response = {
  user_details: {
    email: string;
    id: string;
    is_active: boolean;
    profile_pic: string;
  };
  role: string;
  address: {
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  is_organization_admin: boolean;
  has_marketing_access: boolean;
  has_sales_access: boolean;
  phone: string;
  alternate_phone: string;
  date_of_joining: string;
  is_active: boolean;
};

export const formatDate = (dateString: any) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const roleDisplayMap: { [key: string]: string } = {
  ADMIN: 'ADMIN',
  'SALES MANAGER': 'SALES MANAGER',
  'SALES REP': 'SALES REPRESENTATIVE',
  USER: 'USER',
};

export default function UserDetails() {
  const { userRole, setUserRole, userId } = useMyContext();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [userDetails, setUserDetails] = useState<response | null>(null);

  useEffect(() => {
    getUserDetail(state.userId);
  }, [state.userId]);

  const getUserDetail = (id: any) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };
    fetchData(`${UserUrl}/${id}/`, 'GET', null as any, Header).then((res) => {
      console.log(res, 'res');
      if (!res.error) {
        setUserDetails(res?.data?.profile_obj);
      }
    });
  };

  const backbtnHandle = () => {
    navigate('/app/users');
  };

  const editHandle = () => {
    navigate('/app/users/edit-user', {
      state: {
        value: {
          email: userDetails?.user_details?.email,
          role: userDetails?.role,
          phone: userDetails?.phone,
          alternate_phone: userDetails?.alternate_phone,
          address_line: userDetails?.address?.address_line,
          street: userDetails?.address?.street,
          city: userDetails?.address?.city,
          state: userDetails?.address?.state,
          pincode: userDetails?.address?.postcode,
          country: userDetails?.address?.country,
          profile_pic: userDetails?.user_details?.profile_pic,
          has_sales_access: userDetails?.has_sales_access,
          has_marketing_access: userDetails?.has_marketing_access,
          is_organization_admin: userDetails?.is_organization_admin,
        },
        id: state?.userId,
      },
    });
  };

  const module = 'Users';
  const crntPage = 'User Detail';
  const backBtn = 'Back To Users';
  const isAdmin = userRole === 'ADMIN';
  const isMyself = userId === userDetails?.user_details.id;
  const showEditButton = isAdmin || isMyself;

  return (
    <Box sx={{ mt: '60px' }}>
      <div>
        <CustomAppBar
          backbtnHandle={backbtnHandle}
          module={module}
          backBtn={backBtn}
          crntPage={crntPage}
          editHandle={showEditButton ? editHandle : null}
        />
        <Box
          sx={{
            mt: '120px',
            p: '20px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Card sx={{ borderRadius: '16px' }}>
              <div
                style={{
                  padding: '20px',
                  borderBottom: '1px solid lightgray',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '18px',
                    color: '#1a3353f0',
                  }}
                >
                  User Information
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Email Name</div>
                  <div className="title3">
                    {userDetails?.user_details?.email || '---'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Is Active</div>
                  <div className="title3">
                    <AntSwitch checked={userDetails?.user_details?.is_active} />
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Profile pic</div>
                  <div className="title3">
                    <Avatar alt={'sdf'}>
                      {userDetails?.user_details?.profile_pic}
                    </Avatar>
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  marginTop: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Role</div>
                  <div
                    style={{
                      fontSize: '16px',
                      color: '#1E90FF',
                      marginTop: '5%',
                    }}
                  >
                    {userDetails?.role
                      ? roleDisplayMap[userDetails.role]
                      : '---'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Mobile Number</div>
                  <div className="title3">{userDetails?.phone || '---'}</div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Marketing Access</div>
                  <div className="title3">
                    <AntSwitch checked={userDetails?.has_marketing_access} />
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  marginTop: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <div style={{ width: '34%' }}>
                  <div className="title2">Sales Access</div>
                  <div className="title3">
                    <AntSwitch checked={userDetails?.has_sales_access} />
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Date of joining</div>
                  <div className="title3">
                    {userDetails?.date_of_joining || '---'}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '15px' }}>
                <div
                  style={{
                    padding: '20px',
                    borderBottom: '1px solid lightgray',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '18px',
                      color: '#1a3353f0',
                    }}
                  >
                    Address
                  </div>
                </div>
                <div
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ width: '32%' }}>
                    <div className="title2">Address Lane</div>
                    <div className="title3">
                      {userDetails?.address?.address_line || '---'}
                    </div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">Street</div>
                    <div className="title3">
                      {userDetails?.address?.street || '---'}
                    </div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">City</div>
                    <div className="title3">
                      {userDetails?.address?.city || '---'}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: '20px',
                    marginTop: '15px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ width: '32%' }}>
                    <div className="title2">Pincode</div>
                    <div className="title3">
                      {userDetails?.address?.postcode || '---'}
                    </div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">State</div>
                    <div className="title3">
                      {userDetails?.address?.state || '---'}
                    </div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">Country</div>
                    <div className="title3">
                      {userDetails?.address?.country || '---'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Box>
        </Box>
      </div>
    </Box>
  );
}
