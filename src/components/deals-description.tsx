import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const DescriptionComponent = () => {
  return (
    <Box
      sx={{
        width: 300,
        padding: 3,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {/* Description text */}
      <Typography
        variant="body2"
        sx={{
          color: '#333', // Darker color
          fontWeight: 'bold', // Bolder text
          marginBottom: 1,
        }}
      >
        Description
      </Typography>

      {/* Text content */}
      <Typography variant="body2" sx={{ color: '#666', marginBottom: 2 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      </Typography>

      {/* Edit button */}
      <Box sx={{ marginBottom: 2 }}>
        <Button variant="text" color="primary">
          Edit
        </Button>
      </Box>
    </Box>
  );
};

export default DescriptionComponent;