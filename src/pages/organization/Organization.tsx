import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa6';
import './styles.css';
import { fetchData } from '../../components/FetchData';
import { OrgUrl } from '../../services/ApiUrls';

export default function Organization() {
  const navigate = useNavigate();

  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgErrors, setOrgErrors] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('Token')) {
      navigate('/login');
    }
  }, [navigate]);

  const addOrganization = () => {
    fetchData(`${OrgUrl}/`, 'POST', JSON.stringify({ name: orgName }), {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
    })
      .then((res) => {
        if (res?.error) {
          setOrgErrors(res?.errors?.name[0]);
        } else if (res.status === 201) {
          setOrgErrors('');
          localStorage.setItem('org', res.org.id);
          navigate('/', { replace: true });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <Stack className="organization-page-container">
      <Container className="organization-page-main">
        <Typography className="organization-page-title">
          Add Organization
        </Typography>
        <Typography className="organization-page-sub-title">
          Enter the name of your organization to continue.
        </Typography>
        <Box className="organization-page-add-form">
          <TextField
            className="organization-page-org-name-input"
            label="organisations Name"
            name="org"
            value={orgName || ''}
            onChange={(e) => setOrgName(e.target.value)}
            size="small"
            helperText={orgErrors || ''}
            error={!!orgErrors}
          />
          <Button
            className="organization-page-add-form-btn"
            onClick={() => addOrganization()}
            variant="contained"
          >
            <FaPlus size={'28px'} />
          </Button>
        </Box>
      </Container>
    </Stack>
  );
}
