import { useState } from 'react';
import { Grid, TextField, Button, Typography, Alert } from '@mui/material';
import { fetchData } from '../../components/FetchData';
import { AuthUrl } from '../../services/ApiUrls';
import './styles.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{
    type: null | 'error' | 'success';
    text: null | string;
  }>({
    type: null,
    text: null,
  });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    const data = { email };
    const head = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    fetchData(`${AuthUrl}/forgot-password/`, 'POST', JSON.stringify(data), head)
      .then((res: any) => {
        setMessage({
          type: 'success',
          text: 'A password reset link has been sent to your email.',
        });
      })
      .catch((error: any) => {
        console.error('Error:', error);
        setMessage({
          type: 'error',
          text: 'There was an error sending the email.',
        });
      });
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
          Enter the email address associated with your account and we’ll send
          you a link to reset your password.
        </Typography>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={handleEmailChange}
          sx={{ mt: 4 }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2, textTransform: 'capitalize' }}
        >
          Send Reset Link
        </Button>
        {message.type && (
          <div className="forget-password-msg-container">
            <Alert
              className="forget-password-msg-"
              severity={message.type === 'error' ? 'error' : 'success'}
            >
              {message.text}
            </Alert>
          </div>
        )}
      </Grid>
    </Grid>
  );
}
