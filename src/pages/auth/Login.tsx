import { useEffect, useState } from 'react';
import { Grid, Stack, Typography, TextField, Button } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import imgGoogle from '../../assets/images/auth/google.svg';
import imgLogo from '../../assets/images/auth/img_logo.png';
import imgLogin from '../../assets/images/auth/img_login.png';
import { GoogleButton } from '../../styles/CssStyled';
import { fetchData } from '../../components/FetchData';
import { AuthUrl, LoginUrl } from '../../services/ApiUrls';
import '../../styles/style.css';

export default function Login() {
    const navigate = useNavigate();
    const [token, setToken] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (localStorage.getItem('Token')) {
            navigate('/app');
        }
    }, [token]);

    const loginWithGoogle = useGoogleLogin({
        onSuccess: tokenResponse => {
            const apiToken = { token: tokenResponse.access_token };
            const head = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            fetchData(`${AuthUrl}/`, 'POST', JSON.stringify(apiToken), head)
                .then((res) => {
                    localStorage.setItem('Token', `Bearer ${res.access_token}`);
                    setToken(true);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        },
    });

    const handleLogin = (e) => {
        e.preventDefault();
    
        const payload = { email, password }; // Ensure you have these defined in your component
        const head = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    
        fetchData("auth/login/", 'POST', JSON.stringify(payload), head)
            .then((res) => {
                if (res && res.access) { // Check if the access token is present
                    localStorage.setItem('Token', `Bearer ${res.access}`); 
                    setToken(true);  // Set token state to true (you might want to handle redirect here)
                    navigate('/app'); // Redirect to your app after successful login
                } else {
                    setError('Invalid response format');
                }
            })
            .catch((error) => {
                setError('Invalid username or password'); // Set error state for UI feedback
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent='center'
                alignItems='center'
                sx={{ height: '100%', width: '100%', position: 'fixed' }}
            >
                <Grid
                    container
                    item
                    xs={8}
                    direction='column'
                    justifyContent='space-evenly'
                    alignItems='center'
                    sx={{ height: '100%', overflow: 'hidden' }}
                >
                    <Grid item>
                        <Grid sx={{ mt: 2 }}>
                            <img src={imgLogo} alt='register_logo' className='register-logo' />
                        </Grid>
                        <Typography variant='h5' style={{ fontWeight: 'bolder' }}>Sign In</Typography>
                        <Grid item sx={{ mt: 4 }}>
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
                                <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>Login</Button>
                                {error && <Typography color="error">{error}</Typography>}
                            </form>

                            <GoogleButton variant='outlined' onClick={() => loginWithGoogle()} sx={{ fontSize: '12px', fontWeight: 500 }}>
                                Sign in with Google
                                <img src={imgGoogle} alt='google' style={{ width: '17px', marginLeft: '5px' }} />
                            </GoogleButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    xs={8}
                    direction='column'
                    justifyContent='center'
                    alignItems='center'
                    className='rightBg'
                    sx={{ height: '100%', overflow: 'hidden', justifyItems: 'center' }}
                >
                    <Grid item >
                        <Stack sx={{ alignItems: 'center' }}>
                            <h3>Welcome to BottleCRM</h3>
                            <p> Free and OpenSource CRM from small medium business.</p>
                            <img
                                src={imgLogin}
                                alt='register_ad_image'
                                className='register-ad-image'
                            />
                            <footer className='register-footer'>
                                bottlecrm.com
                            </footer>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </div>
    );
}