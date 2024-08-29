import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
} from '@mui/material';
import { fetchData } from '../../components/FetchData';
import { RegisterUrl } from '../../services/ApiUrls';

const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{
    email?: string[];
    password?: string[];
  }>({});
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  const cleanErrors = () => {
    setConfirmPasswordError('');
    setFormErrors({});
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    cleanErrors();
    if (password !== confirmPassword) {
      setConfirmPasswordError('Confirm password does not match');
      setError('Invalid input. Please check your email and password.');
      return;
    }

    const data = JSON.stringify({ email, password });
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    fetchData(RegisterUrl, 'POST', data, headers).then((res: any) => {
      if (res.error === true) {
        if (typeof res.errors !== 'string') {
          setFormErrors(res.errors || {});
          setError('Invalid input. Please check your email and password.');
          console.log(res.errors);
        } else {
          setError(res.errors);
        }
        setSuccess('');
      } else {
        setSuccess(res.message);
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography
          variant="h2"
          gutterBottom
          color="primary"
          sx={{ fontWeight: 500, mb: 6, textAlign: 'center' }}
        >
          BottleCRM
        </Typography>
        <Typography variant="h4" color="textSecondary" paragraph>
          Register Here
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!formErrors.email}
            helperText={formErrors.email?.join(' ')}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={!!formErrors.password}
            helperText={formErrors.password?.join(' ')}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
        {(success || error) && (
          <Alert severity={error ? 'error' : 'success'}>
            {success ? success : error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default RegistrationPage;
