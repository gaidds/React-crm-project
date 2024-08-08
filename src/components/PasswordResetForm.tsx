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
    DialogContent
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
    email?: string[];
    phone?: string[];
    alternate_phone?: string[];
    address_line?: string[];
    street?: string[];
    city?: string[];
    state?: string[];
    pincode?: string[];
    country?: string[];
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ uidb64, token }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [alternatePhone, setAlternatePhone] = useState('');
    const [addressLine, setAddressLine] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown; }>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'password':
                setPassword(value as string);
                break;
            case 'confirmPassword':
                setConfirmPassword(value as string);
                break;
            case 'email':
                setEmail(value as string);
                break;
            case 'phone':
                setPhone(value as string);
                break;
            case 'alternate_phone':
                setAlternatePhone(value as string);
                break;
            case 'address_line':
                setAddressLine(value as string);
                break;
            case 'street':
                setStreet(value as string);
                break;
            case 'city':
                setCity(value as string);
                break;
            case 'state':
                setState(value as string);
                break;
            case 'pincode':
                setPincode(value as string);
                break;
            case 'country':
                setCountry(value as string);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Step 1: Reset Password
        try {
            const passwordResetResponse = await fetchData(
                `auth/reset-password/${uidb64}/${token}/`,
                'POST',
                JSON.stringify({ password }),
                Header
            );

            if (passwordResetResponse.message) {
                // Step 2: Update User Details
                try {
                    const userDetailsUpdateResponse = await fetchData(
                        `user/${uidb64}/`, // Ensure this endpoint is correct for updating user details
                        'PUT',
                        JSON.stringify({
                            email,
                            phone,
                            alternate_phone: alternatePhone,
                            address_line: addressLine,
                            street,
                            city,
                            state,
                            pincode,
                            country
                        }),
                        Header
                    );

                    if (userDetailsUpdateResponse.message) {
                        setSuccessMessage('Password and user details have been updated successfully.');
                        setError(null);
                        setFormErrors({});
                        setOpenModal(true);
                    } else if (userDetailsUpdateResponse.errors) {
                        setFormErrors(userDetailsUpdateResponse.errors);
                        setError(null);
                    } else if (userDetailsUpdateResponse.error) {
                        setError(userDetailsUpdateResponse.error);
                        setFormErrors({});
                    }
                } catch (err) {
                    setError('An error occurred while updating user details.');
                    setFormErrors({});
                    console.error('Error:', err);
                }
            } else if (passwordResetResponse.errors) {
                setFormErrors(passwordResetResponse.errors);
                setError(null);
            } else if (passwordResetResponse.error) {
                setError(passwordResetResponse.error);
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
                Set a New Password and Personal Information
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
                        </Box>
                    </AccordionDetails>
                </Accordion>
                
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                        <Typography>Personal Information</Typography>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails>
                        <Box component='div' sx={{ width: '100%' }}>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <OutlinedInput
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={handleChange}
                                    label="Email"
                                    error={!!formErrors.email}
                                />
                                {formErrors.email && (
                                    <FormHelperText error>
                                        {formErrors.email.join(', ')}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel htmlFor="phone">Phone</InputLabel>
                                <OutlinedInput
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    value={phone}
                                    onChange={handleChange}
                                    label="Phone"
                                    error={!!formErrors.phone}
                                />
                                {formErrors.phone && (
                                    <FormHelperText error>
                                        {formErrors.phone.join(', ')}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel htmlFor="alternate_phone">Alternate Phone</InputLabel>
                                <OutlinedInput
                                    id="alternate_phone"
                                    name="alternate_phone"
                                    type="text"
                                    value={alternatePhone}
                                    onChange={handleChange}
                                    label="Alternate Phone"
                                    error={!!formErrors.alternate_phone}
                                />
                                {formErrors.alternate_phone && (
                                    <FormHelperText error>
                                        {formErrors.alternate_phone.join(', ')}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel htmlFor="address_line">Address Line</InputLabel>
                                <OutlinedInput
                                    id="address_line"
                                    name="address_line"
                                    type="text"
                                    value={addressLine}
                                    onChange={handleChange}
                                    label="Address Line"
                                    error={!!formErrors.address_line}
                                />
                                {formErrors.address_line && (
                                    <FormHelperText error>
                                        {formErrors.address_line.join(', ')}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel htmlFor="street">Street</InputLabel>
                                <OutlinedInput
                                    id="street"
                                    name="street"
                                    type="text"
                                    value={street}
                                    onChange={handleChange}
                                    label="Street"
                                    error={!!formErrors.street}
                                />
                                {formErrors.street && (
                                    <FormHelperText error>
                                        {formErrors.street.join(', ')}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel htmlFor="city">City</InputLabel>
                                <OutlinedInput
                                    id="city"
                                    name="city"
                                    type="text"
                                    value={city}
                                    onChange={handleChange}
                                    label="City"
                                    error={!!formErrors.city}
                                />
                                {formErrors.city && (
                                    <FormHelperText error>
                                        {formErrors.city.join(', ')}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel htmlFor="state">State</InputLabel>
                                <OutlinedInput
                                    id="state"
                                    name="state"
                                    type="text"
                                    value={state}
                                    onChange={handleChange}
                                    label="State"
                                    error={!!formErrors.state}
                                />
                                {formErrors.state && (
                                    <FormHelperText error>
                                        {formErrors.state.join(', ')}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel htmlFor="pincode">Pincode</InputLabel>
                                <OutlinedInput
                                    id="pincode"
                                    name="pincode"
                                    type="text"
                                    value={pincode}
                                    onChange={handleChange}
                                    label="Pincode"
                                    error={!!formErrors.pincode}
                                />
                                {formErrors.pincode && (
                                    <FormHelperText error>
                                        {formErrors.pincode.join(', ')}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel htmlFor="country">Country</InputLabel>
                                <OutlinedInput
                                    id="country"
                                    name="country"
                                    type="text"
                                    value={country}
                                    onChange={handleChange}
                                    label="Country"
                                    error={!!formErrors.country}
                                />
                                {formErrors.country && (
                                    <FormHelperText error>
                                        {formErrors.country.join(', ')}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained" color="primary">
                        Reset Password and Update Info
                    </Button>
                </Box>
            </form>

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
        </Box>
    );
};

export default PasswordResetForm;
