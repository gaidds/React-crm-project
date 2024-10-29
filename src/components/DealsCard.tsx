import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  LinearProgress,
  AvatarGroup,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  photo: string;
}

interface DealsCardProps {
  id: string;
  name: string;
  country: string;
  assignedUsers: User[];
  probability: number;
  stage?: string;
}

// Styled progress bar with color change based on probability
const StyledLinearProgress = styled(LinearProgress)<{ value: number }>(
  ({ value, theme }) => ({
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CCCCCC',
    '& .MuiLinearProgress-bar': {
      backgroundColor:
        value >= 75
          ? '#075F18'
          : value >= 60
          ? '#94C31C'
          : value >= 40
          ? '#EBDA25'
          : value >= 20
          ? '#FF8C00'
          : '#CA1D1F',
    },
  })
);

const DealsCard: React.FC<DealsCardProps> = ({
  id,
  name,
  country,
  assignedUsers,
  probability,
  stage,
}) => {
  const navigate = useNavigate();
  const anchorEl = useState<null | HTMLElement>(null)[0];

  const handleCardClick = (id: string) => {
    if (!anchorEl) {
      // Only navigate if the menu is not open
      navigate(`/app/deals/${id}`); // Ensure this path matches your routing configuration
    }
  };

  return (
    <Box
      sx={{
        border: '2px solid #ccc',
        borderRadius: 4,
        p: 2,
        width: 120,
        height: 190,
        m: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#FEF7FF',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': { backgroundColor: '#E8E2EA' },
      }}
      onClick={() => handleCardClick(id)}
    >
      <Box mb={2}>
        <Typography variant="h6" noWrap>
          {name}
        </Typography>
        <Typography variant="body2" noWrap color="textSecondary">
          {country}
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6">Assigned to</Typography>
      </Box>
      <Box
        display="flex"
        flexWrap="wrap"
        sx={{ height: 45, overflow: 'hidden' }}
      >
        <AvatarGroup
          max={3}
          spacing="small"
          sx={{ '& .MuiAvatar-root': { width: 33, height: 33 } }}
        >
          {assignedUsers.length > 0 ? (
            assignedUsers.map((user, index) => (
              <Avatar
                key={index}
                alt={user.name}
                src={user.photo}
                sx={{ width: 33, height: 33 }}
              />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              No users assigned
            </Typography>
          )}
        </AvatarGroup>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <StyledLinearProgress
            variant="determinate"
            value={probability}
            sx={{ flexGrow: 1 }}
          />
          <Typography
            variant="body2"
            sx={{
              ml: -1,
              minWidth: '40px',
              textAlign: 'right',
              lineHeight: '14px',
            }}
          >
            {probability}%
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          height: 16,
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1,
          py: 0.5,
          borderRadius: 3,
          backgroundColor: stage === 'CLOSED WON' ? '#D4EDDA' : '#F8D7DA',
          color: stage === 'CLOSED WON' ? '#155724' : '#721C24',
          visibility:
            stage === 'CLOSED WON' || stage === 'CLOSED LOST'
              ? 'visible'
              : 'hidden',
        }}
      >
        {stage === 'CLOSED WON' || stage === 'CLOSED LOST' ? (
          <Typography variant="body2">
            {stage === 'CLOSED WON' ? 'WON' : 'LOST'}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
};

export default DealsCard;
