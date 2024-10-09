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

export default function Organization() {
  const navigate = useNavigate();

  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgErrors, setOrgErrors] = useState<any>(null);

  useEffect(() => {
    if (!localStorage.getItem('Token')) {
      navigate('/login');
    }
  }, []);

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
            helperText={orgErrors?.org?.[0] ? orgErrors?.org[0] : ''}
            error={!!orgErrors?.org?.[0]}
          />
          <Button
            className="organization-page-add-form-btn"
            onClick={() => console.log(orgName)}
            variant="contained"
          >
            <FaPlus size={'28px'} />
          </Button>
        </Box>
      </Container>
    </Stack>
  );
}
