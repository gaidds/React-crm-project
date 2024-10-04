import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Modal,
  Typography,
  FormControl,
} from '@mui/material';
import { fetchData, Header } from '../FetchData';

const buttonStyle = {
  backgroundColor: '#65558F',
  color: 'white',
  borderRadius: '30px',
  padding: '10px 20px',
  width: '100%', // Fixed width
  height: '36px', // Fixed height
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '#89829e',
  },
  margin:'20px 10px',
};

const cancelButtonStyle = {
  borderColor: '#65558F',
  color: '#65558F',
  borderRadius: '30px',
  padding: '10px 20px',
  width: '100%',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: 'grey',
  },
  margin:'20px 10px',
};

// MessageModal Component to show success message
const MessageModal: React.FC<{ message: string; open: boolean; onClose: () => void }> = ({
  message,
  open,
  onClose,
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose(); 
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: 300,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6">{message}</Typography>
      </Box>
    </Modal>
  );
};

interface ChangePasswordModalProps {
  open: boolean;
  handleClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ open, handleClose }) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State for errors
  const [errors, setErrors] = useState<{ [key: string]: string[] | null }>({});

  // State for success message modal
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: ["Passwords do not match"] });
      return;
    }

    fetchData(
      'auth/change-password/',
      'PUT',
      JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
      Header,
    ).then((res: any) => {
      if (typeof res !== 'string') {
        setErrors(res || {});
      }

      if (res.error === false) {

        setSuccessMessage(res.message);
        setMessageModalOpen(true); 
        handleClose();
      }
    });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Change Password
          </Typography>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Old Password"
              name="oldPassword"
              type="password"
              size="small"
              value={passwordData.oldPassword}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.old_password?.[0]}
              helperText={errors.old_password?.[0] || ''}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              size="small"
              value={passwordData.newPassword}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.new_password}
              helperText={errors.new_password?.[0] || ''}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              size="small"
              value={passwordData.confirmPassword}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.[0] || ''}
            />
          </FormControl>
          {errors.general && (
            <Typography color="error" variant="body2">
              {errors.general[0]}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant='outlined' sx={cancelButtonStyle} onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" sx={buttonStyle} onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      <MessageModal
        message={successMessage || ''}
        open={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
      />
    </>
  );
};

export default ChangePasswordModal;
