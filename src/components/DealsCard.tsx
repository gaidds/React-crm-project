import React, { useState , MouseEvent} from 'react';
import { Box, Typography, Avatar, LinearProgress, IconButton, Menu, MenuItem, AvatarGroup } from '@mui/material';
import { styled } from '@mui/system';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
  stage?: string; 
}

// Styled progress bar with color change based on probability
const StyledLinearProgress = styled(LinearProgress)<{ value: number }>(({ value, theme }) => ({
  height: 14,
  borderRadius: 5,
  backgroundColor: "#CCCCCC",
  '& .MuiLinearProgress-bar': {
    backgroundColor: value >= 75 ? '#075F18' : value >= 60 ? '#94C31C' : value >= 40 ? '#EBDA25' : value >= 20 ? '#FF8C00' : '#CA1D1F',
  },
}));

const DealsCard: React.FC<DealsCardProps> = ({ name, country, assignedUsers, probability, stage}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Number of users to display
  const displayedUsers = assignedUsers.slice(0, 3);
  const moreCount = assignedUsers.length - displayedUsers.length;

  const handleCardClick = () => {
    if (!anchorEl) { // Only navigate if the menu is not open
      navigate('/deals-details'); // Ensure this path matches your routing configuration
    }
  };

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    // Handle edit action here
    console.log('Edit clicked');
  };

  const handleDelete = () => {
    handleMenuClose();
    // Handle delete action here
    console.log('Delete clicked');
  };
  
  return (
    <Box
      sx={{
        border: '2px solid #ccc',
        borderRadius: 4,
        p: 2,
        width: 180, 
        height: 250, 
        m: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', 
        backgroundColor: '#FEF7FF',
        cursor: 'pointer', 
        position: 'relative',
      }}
      onClick={handleCardClick}
    >
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'text.secondary',
        }}
        onClick={handleMenuClick}
      >
        <MoreVertIcon />
      </IconButton>
      
      <Box mb={2}>
        <Typography variant="h6" noWrap>{name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {country}
        </Typography>
      </Box>

      <Box><Typography variant="h6">Assigned to</Typography></Box>
      <Box display="flex" mb={2} flexWrap="wrap">
      <AvatarGroup max={4}>
          {assignedUsers.map((user, index) => (
            <Avatar
              key={index}
              alt={user.name}
              src={user.photo}
            />
          ))}
        </AvatarGroup>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between" mb={5}>
        <StyledLinearProgress variant="determinate" value={probability} sx={{ flexGrow: 1 }} />
        <Typography variant="body2"  sx={{ ml: 0, minWidth: '40px', textAlign: 'right' }}>
          {probability}%
        </Typography>
      </Box>
      {(stage === 'CLOSED WON' || stage === 'CLOSED LOST') && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            backgroundColor: stage === 'CLOSED WON' ? '#D4EDDA' : '#F8D7DA',
            color: stage === 'CLOSED WON' ? '#155724' : '#721C24',
          }}
        >
          <Typography variant="body2">
            {stage === 'CLOSED WON' ? 'WON' : 'LOST'}
          </Typography>
        </Box>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default DealsCard;
