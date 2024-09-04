import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  Grid,
  CircularProgress,
} from '@mui/material';
import { fetchData } from '../../components/FetchData';
import { AuthConfigUrl, AuthUrl, RegisterUrl } from '../../services/ApiUrls';
import { AuthBackground, GoogleButton } from '../../styles/CssStyled';
import imgGoogle from '../../assets/images/auth/google.svg';
import { registerErrorsType, RegisterResponseType } from './types';
import './styles.css';

const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<registerErrorsType>({});
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const cleanErrors = () => {
    setConfirmPasswordError('');
    setFormErrors({});
    setError(null);
  };

  useEffect(() => {
    const head = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    fetchData(AuthConfigUrl, 'GET', null as any, head)
      .then((res) => {
        if (res.data && typeof res.data.is_google_login === 'boolean') {
          if (!res.data.is_first_user) {
            navigate('/login');
          }
        } else {
          console.error('Invalid response format from auth-config');
        }
      })
      .catch((error) => {
        console.error('Error fetching auth-config:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSuccessLogein = (res: RegisterResponseType) => {
    setSuccess(res.message || '');
    localStorage.setItem('Token', `Bearer ${res.access_token}`);
    navigate('/app');
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
        handleSuccessLogein(res);
      }
    });
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const apiToken = { token: tokenResponse.access_token };
      const head = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      fetchData(`${AuthUrl}/`, 'POST', JSON.stringify(apiToken), head)
        .then((res) => {
          if (res.access_token) {
            handleSuccessLogein(res);
          } else {
            setError(res.message);
          }
        })
        .catch((error) => {
          setError('Error logging in with Google.');
          console.error('Error:', error);
        });
    },
  });

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <AuthBackground>
      <Container maxWidth="sm" sx={{ height: '100%', position: 'relative' }}>
        <Typography
          variant="h2"
          gutterBottom
          color="primary"
          sx={{ fontWeight: 500, mt: 4, textAlign: 'center' }}
        >
          BottleCRM
        </Typography>
        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            bottom: 0,
          }}
        >
          <form onSubmit={handleSubmit} className="registration-form">
            <Typography variant="body1" mb={2}>
              Register Here
            </Typography>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="dense"
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
              margin="dense"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={!!formErrors.password}
              helperText={formErrors.password?.join(' ')}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="dense"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
            />
            <Button
              type="submit"
              sx={{ mt: 2 }}
              variant="contained"
              color="primary"
              fullWidth
            >
              Register
            </Button>
            <Grid item sx={{ textAlign: 'center', mt: 1 }}>
              <div className="login-option-container">
                <div className="login-option-line"></div>
                <p className="login-option-text">OR</p>
                <div className="login-option-line"></div>
              </div>
              <GoogleButton
                variant="outlined"
                onClick={() => loginWithGoogle()}
                sx={{
                  fontSize: '12px',
                  fontWeight: 500,
                  mt: 2,
                }}
              >
                Register with Google
                <img
                  src={imgGoogle}
                  alt="google"
                  style={{ width: '17px', marginLeft: '5px' }}
                />
              </GoogleButton>
            </Grid>
          </form>
          {(success || error) && (
            <div className="registration-msg-container">
              <Alert
                className="registration-msg"
                severity={error ? 'error' : 'success'}
              >
                {success ? success : error}
              </Alert>
            </div>
          )}
        </Box>
      </Container>
    </AuthBackground>
  );
};

export default RegistrationPage;
