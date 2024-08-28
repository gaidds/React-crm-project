import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ResetForgotPasswordUrl } from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';

interface FormErrors {
  password?: string[];
}

const PasswordResetForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const { uidb64, token } = useParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const headers = {
      'Content-Type': 'application/json',
    };

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetchData(
        `${ResetForgotPasswordUrl}/${uidb64}/${token}/`,
        'POST',
        JSON.stringify({ password }),
        headers
      );

      if (response && response.error === false) {
        setSuccessMessage(
          'Password reset successfully. You can now log in with your new password.'
        );
        setOpenModal(true);
      } else {
        setError(response.errors || 'An error occurred. Please try again.');
        setFormErrors(response.errors || {});
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    navigate('/login');
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: '100vh' }}
    >
      <Grid item xs={12} sm={6} md={4}>
        <Typography
          variant="h2"
          gutterBottom
          color="primary"
          sx={{ fontWeight: 500, mb: 6, textAlign: 'center' }}
        >
          BottleCRM
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Please enter a new password for your account. Make sure your password
          is strong and secure by using a combination of letters, numbers, and
          special characters.
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel htmlFor="password">New Password</InputLabel>
            <OutlinedInput
              required
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              label="New Password"
              error={!!formErrors.password}
            />
            {formErrors.password && (
              <FormHelperText error>
                {formErrors.password.join(', ')}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <OutlinedInput
              required
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleChange}
              label="Confirm Password"
              error={!!error}
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ width: '100%', mt: 2, textTransform: 'capitalize' }}
          >
            Reset Password
          </Button>
        </form>
        {error && (
          <div className="reset-forgot-password-error-msg-container">
            <Alert className="reset-forgot-password-error-msg" severity="error">
              {error}
            </Alert>
          </div>
        )}
        <Dialog open={openModal} onClose={handleModalClose}>
          <DialogContent>
            <Typography>{successMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default PasswordResetForm;
