import { useState } from 'react';
import { Grid, TextField, Button, Typography } from '@mui/material';
import { fetchData } from '../../components/FetchData';
import { AuthUrl } from '../../services/ApiUrls';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleSubmit = () => {
        const data = { email };
        const head = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        fetchData(`${AuthUrl}/forgot-password`, 'POST', JSON.stringify(data), head)
    .then((res: any) => {
        setMessage('A password reset link has been sent to your email.');
    })
    .catch((error: any) => {
        console.error('Error:', error);
        setMessage('There was an error sending the email.');
    });

    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <Grid item xs={12} sm={6} md={4}>
                <Typography variant="h5" gutterBottom>Forgot Your Password?</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                    Enter your email address below, and we'll send you a link to reset your password.
                </Typography>
                <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={handleEmailChange}
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Send Reset Link
                </Button>
                {message && (
                    <Typography variant="body2" color="textSecondary" paragraph style={{ marginTop: '10px' }}>
                        {message}
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
}