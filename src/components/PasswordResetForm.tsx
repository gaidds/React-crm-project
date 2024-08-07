import React, { useState } from 'react';
import { fetchData, Header } from './FetchData';

interface PasswordResetFormProps {
    uidb64: string;
    token: string;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ uidb64, token }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const requestBody = JSON.stringify({
            password
        });

        try {
            // `uidb64` and `token` are in the URL, `password` in the request body
            const response = await fetchData(`auth/reset-password/${uidb64}/${token}/`, 'POST', requestBody, Header);

            if (!response.ok) {
                setError('An error occurred while resetting the password.');
                return;
            }

            const data = await response.json();

            if (data.message) {
                setSuccessMessage(data.message);
                setError('');
            } else if (data.error) {
                setError(data.error);
            }
        } catch (err) {
            setError('An error occurred while resetting the password.');
            console.error('Error details:', err);
        }
    };

    return (
        <div>
            <h2>Set a New Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Set New Password</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            </form>
        </div>
    );
};

export default PasswordResetForm;
