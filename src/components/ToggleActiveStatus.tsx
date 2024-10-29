import React, { useEffect, useState } from 'react';
import { FormControlLabel, Switch, CircularProgress } from '@mui/material';
import { Header, fetchData } from './FetchData';
import { UserUrl } from '../services/ApiUrls';

interface ToggleProps {
  userId: string | undefined;
  is_active: boolean | undefined;
}

const ToggleActiveStatus = ({ userId, is_active }: ToggleProps) => {
  const [isActive, setIsActive] = useState(is_active ?? true);
  const [loading, setLoading] = useState(false);

  const fetchUserStatus = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await fetchData(
        `${UserUrl}/${userId}`,
        'GET',
        null as any,
        Header
      );
      if (response.ok) {
        const data = await response.json();
        setIsActive(data.profile_obj.is_active);
      } else {
        console.error('Failed to fetch user status:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch user status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStatus();
  }, [userId]);

  const toggleActiveStatus = async () => {
    if (!userId) return;
    const newStatus = isActive ? 'Inactive' : 'Active';
    setIsActive(!isActive);

    try {
      const response = await fetchData(
        `${UserUrl}/${userId}/status/`,
        'POST',
        JSON.stringify({ status: newStatus }),
        Header
      );

      if (response.ok) {
        await fetchUserStatus();
      } else {
        console.error('Failed to update status:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <FormControlLabel
      control={
        <Switch
          checked={isActive}
          onChange={toggleActiveStatus}
          color="primary"
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#65558F',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#65558F',
            },
          }}
        />
      }
      label={isActive ? 'User is Active' : 'User is Inactive'}
    />
  );
};

export default ToggleActiveStatus;
