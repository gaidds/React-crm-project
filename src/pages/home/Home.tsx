import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Container } from '@mui/material';
import Sidebar from '../../components/Sidebar';
import Organization from '../organization/Organization';
import { fetchData } from '../../components/FetchData';
import { OrgUrl } from '../../services/ApiUrls';

export const Home = (props: any) => {
  const navigate = useNavigate();

  const [org, setOrg] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const getOrganization = () => {
    fetchData(`${OrgUrl}/`, 'GET', null as any, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
    })
      .then((res: any) => {
        if (res?.profile_org_list[0]) {
          window.localStorage.setItem(
            'org',
            res?.profile_org_list[0].org['id']
          );
          setOrg(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    if (!localStorage.getItem('Token')) {
      navigate('/login');
    }
    getOrganization();
  }, [navigate]);

  if (!loading) {
    return <Box>{org ? <Sidebar open={true} /> : <Organization />}</Box>;
  } else {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }
};
