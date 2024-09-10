import React from 'react';
import { Box, Typography, Avatar, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  photo: string;
}

interface DealsCardProps {
  name: string;
  country: string;
  assignedUsers: User[];
  probability: number;
}

// Styled progress bar with color change based on probability
const StyledLinearProgress = styled(LinearProgress)<{ value: number }>(({ value, theme }) => ({
  height: 14,
  borderRadius: 5,
  backgroundColor: "#CCCCCC",
  '& .MuiLinearProgress-bar': {
    backgroundColor: value >= 75 ? '#075F18' : value >= 50 ? '#94C31C' : value >= 25 ? '#EBDA25' : value >= 10 ? '#FF8C00' : '#CA1D1F',
  },
}));

const DealsCard: React.FC<DealsCardProps> = ({ name, country, assignedUsers, probability }) => {
  const navigate = useNavigate();

  // Number of users to display
  const displayedUsers = assignedUsers.slice(0, 3);
  const moreCount = assignedUsers.length - displayedUsers.length;

  const handleCardClick = () => {
    navigate('/deals-details'); // Change this path to match your routing configuration
  };
  
  return (
    <Box
      sx={{
        border: '2px solid #ccc',
        borderRadius: 4,
        p: 2,
        width: 180, 
        height: 200, 
        m: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Distribute space between elements
        backgroundColor: '#FEF7FF',
        cursor: 'pointer', // Indicate that the card is clickable
      }}
      onClick={handleCardClick}
    >
      <Box mb={2}>
        <Typography variant="h6" noWrap>{name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {country}
        </Typography>
      </Box>

      <Box><Typography variant="h6">Assigned to</Typography></Box>
      <Box display="flex" mb={2} flexWrap="wrap">
      {displayedUsers.map((user, index) => (
          <Avatar
            key={index}
            alt={user.name}
            src={user.photo}
            sx={{ width: 40, height: 40, mr: 1 }}
          />
        ))}
        {moreCount > 0 && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            +{moreCount}
          </Typography>
        )}
      </Box>

      <Box>
        <StyledLinearProgress variant="determinate" value={probability} />
        <Typography variant="body2"  sx={{ mt: 1, textAlign: 'right' }}>
          {probability}%
        </Typography>
      </Box>
    </Box>
  );
};

export default DealsCard;
