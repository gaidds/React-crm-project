import { useEffect, useState } from 'react';
import {
  Grid,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  Box,
} from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import imgGoogle from '../../assets/images/auth/google.svg';
import imgLogo from '../../assets/images/auth/app_logo.png';
import imgLogin from '../../assets/images/auth/img_login.png';
import { GoogleButton } from '../../styles/CssStyled';
import { fetchData } from '../../components/FetchData';
import { AuthUrl, LoginUrl, AuthConfigUrl } from '../../services/ApiUrls';
import '../../styles/style.css';
import './styles.css';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isGoogleLoginEnabled, setIsGoogleLoginEnabled] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('Token')) {
      navigate('/app');
    }
  }, [token]);

  useEffect(() => {
    const head = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    fetchData(AuthConfigUrl, 'GET', null as any, head)
      .then((res) => {
        if (res.data && typeof res.data.is_google_login === 'boolean') {
          if (res.data.is_first_user) {
            navigate('/auth/register');
          }
          setIsGoogleLoginEnabled(res.data.is_google_login);
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
            const decodedToken: any = jwtDecode(res.access_token);
            const expirationTime = decodedToken.exp * 1000;
            localStorage.setItem('TokenExpiration', expirationTime.toString());
            localStorage.setItem('Token', `Bearer ${res.access_token}`);
            setToken(true);
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

  const handleLogin = (e: any) => {
    e.preventDefault();
    const payload = { email, password };
    const head = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    fetchData('auth/login/', 'POST', JSON.stringify(payload), head)
      .then((res) => {
        if (res && res.access) {
          console.log()
          const decodedToken: any = jwtDecode(res.access);
          const expirationTime = decodedToken.exp * 1000;
          localStorage.setItem('TokenExpiration', expirationTime.toString());
          localStorage.setItem('Token', `Bearer ${res.access}`);
          setToken(true);
          navigate('/app');
        } else {
          setError('Invalid response format');
        }
      })
      .catch((error) => {
        setError('Invalid username or password');
        console.error('Error:', error);
      });
  };

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
    <div>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        alignItems="center"
        sx={{ height: '100%', width: '100%', position: 'fixed' }}
      >
        <Grid
          container
          item
          xs={8}
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
          sx={{ height: '100%', overflow: 'hidden' }}
        >
          <Grid item sx={{ padding: '32px' }}>
            <Grid sx={{ textAlign: 'center' }}>
              <img
                src={imgLogo}
                alt="register_logo"
                className="login-app-logo"
              />
            </Grid>
            <Grid item sx={{ mt: 4, maxWidth: '400px' }}>
              <form onSubmit={handleLogin}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Typography sx={{ textAlign: 'end', mb: 2 }}>
                  <Link
                    className="forgot-password-link"
                    to={'/forgot-password'}
                  >
                    Forgot password?
                  </Link>
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mb: 2, width: '100%' }}
                >
                  Login
                </Button>
              </form>

              {isGoogleLoginEnabled && (
                <Grid item sx={{ textAlign: 'center', mt: 2 }}>
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
                      mt: 3,
                    }}
                  >
                    Login with Google
                    <img
                      src={imgGoogle}
                      alt="google"
                      style={{ width: '17px', marginLeft: '5px' }}
                    />
                  </GoogleButton>
                </Grid>
              )}
              {error && (
                <div className="login-error-msg-container">
                  <Alert
                    sx={{
                      mt: 2,
                      position: 'absolute',
                      justifyItems: 'center',
                    }}
                    severity="error"
                  >
                    {error}
                  </Alert>
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={8}
          direction="column"
          justifyContent="center"
          alignItems="center"
          className="rightBg"
          sx={{
            height: '100%',
            overflow: 'hidden',
            justifyItems: 'center',
            padding: '32px',
          }}
        >
          <Grid item>
            <Stack sx={{ alignItems: 'center' }}>
              <h3>Welcome to BottleCRM</h3>
              <p> Free and OpenSource CRM for small medium business.</p>
              <img
                src={imgLogin}
                alt="register_ad_image"
                className="register-ad-image"
              />
              <footer className="register-footer">bottlecrm.com</footer>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </div>
  );
}


