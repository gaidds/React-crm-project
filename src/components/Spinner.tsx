import React from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';

export function Spinner() {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
      }}
    >
      <CircularProgress />
      <Typography sx={{ fontWeight: '19px', ml: 1, mt: 2 }}>
        Loading....
      </Typography>
    </Box>
  );
}
