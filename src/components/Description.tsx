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

const DescriptionEditor: React.FC<DescriptionEditorProps> = ({ initialDescription, onSave }) => {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%' }}>
      {isEditing ? (
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)}
            variant="outlined"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', mt: 1 }}>
            <Button variant="outlined" color="secondary" onClick={handleSaveClick} style={{ borderRadius: '30px' }}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleCancelClick} style={{ borderRadius: '30px' }}>
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              width: '100%', // Ensures the width of the description matches the container
              wordBreak: 'break-word', // Ensures long text wraps properly
            }}
          >
            {description}
          </Typography>
          <Button variant="outlined" onClick={handleEditClick} style={{ borderRadius: '30px' }}>
            Edit
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DescriptionEditor;
