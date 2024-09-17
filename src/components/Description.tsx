import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

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
            minRows={4}
            value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)}
            variant="outlined"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', mt: 1 }}>
            <Button variant="contained" color="primary" onClick={handleSaveClick}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancelClick}>
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {description}
          </Typography>
          <Button variant="contained" onClick={handleEditClick}>
            Edit
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DescriptionEditor;