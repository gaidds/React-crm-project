import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const buttonStyle = {
  borderColor: '#65558F',
  color: '#65558F',
  borderRadius: '30px',
  padding: '10px 20px',
  width: '100px', // Fixed width
  height: '36px', // Fixed height
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '#89829e',
  },
};

interface DescriptionEditorProps {
  initialDescription: string;
  onSave: (updatedDescription: string) => void;
}

const DescriptionComponent: React.FC<DescriptionEditorProps> = ({ initialDescription, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const [tempDescription, setTempDescription] = useState(initialDescription);

  const handleEditClick = () => {
    setIsEditing(true);
    setTempDescription(description); // Store current description in temp state
  };

  const handleSaveClick = () => {
    setDescription(tempDescription); // Update the description with the edited value
    setIsEditing(false); // Exit edit mode
    onSave(tempDescription); // Call the save callback to perform any further actions (e.g., API update)
  };

  const handleCancelClick = () => {
    setIsEditing(false); // Exit edit mode without saving
    setTempDescription(description); // Reset temp description
  };

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
      {isEditing ? (
        <Box sx={{ width: '100%' }}>
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
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)}
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="text" color="primary" onClick={handleSaveClick}>
              Save
            </Button>
            <Button variant="text" onClick={handleCancelClick}>
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
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
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              marginBottom: 2,
              width: '100%', // Ensures the width of the description matches the container
              wordBreak: 'break-word', // Ensures long text wraps properly
            }}
          >
            {description}
          </Typography>
          <Button variant="text" color="primary" onClick={handleEditClick}>
            Edit
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DescriptionComponent;
