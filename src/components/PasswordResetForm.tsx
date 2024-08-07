import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import { fetchData, Header } from './FetchData';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';

interface PasswordResetFormProps {
    uidb64: string;
    token: string;
}

interface FormErrors {
    password?: string[];
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ uidb64, token }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

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

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const requestBody = JSON.stringify({ password });

        try {
            const response = await fetchData(
                `auth/reset-password/${uidb64}/${token}/`,
                'POST',
                requestBody,
                Header
            );

            if (response.message) {
                setSuccessMessage(response.message);
                setError(null);
                setFormErrors({});
                setOpenModal(true);
            } else if (response.errors) {
                // Handle form validation errors
                setFormErrors(response.errors);
                setError(null);
            } else if (response.error) {
                setError(response.error);
                setFormErrors({});
            }
        } catch (err) {
            setError('An error occurred while resetting the password.');
            setFormErrors({});
            console.error('Error:', err);
        }
    };

    const handleModalClose = () => {
        setOpenModal(false);
        navigate('/login');
    };

    return (
        <Box sx={{ mt: '60px' }}>
            <Typography variant="h4" gutterBottom>
                Set a New Password
            </Typography>
            <form onSubmit={handleSubmit}>
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                        <Typography>Password Reset</Typography>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails>
                        <Box component='div' sx={{ width: '100%' }}>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel htmlFor="password">New Password</InputLabel>
                                <OutlinedInput
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
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleChange}
                                    label="Confirm Password"
                                    error={!!error}
                                />
                                {error && (
                                    <FormHelperText error>
                                        {error}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Button type="submit" variant="contained" color="primary">
                                Set New Password
                            </Button>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </form>

            {/* Success Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogContent>
                    <Typography sx={{ color: 'green' }}>{successMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PasswordResetForm;
