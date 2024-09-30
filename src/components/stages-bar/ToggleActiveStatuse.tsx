import React, { useEffect, useState } from 'react';
import { FormControlLabel, Switch, CircularProgress } from '@mui/material';
import { Header,fetchData } from '../FetchData';
import { UsersUrl, UserUrl } from '../../services/ApiUrls';


const ToggleActiveStatus = ({ userId , is_active }) => {

    const isActive = is_active;

    const toggleActiveStatus = async () => {
        const newStatus = isActive ? "Inactive" : "Active";
        try {
            const response = await fetchData(
                `${UserUrl}/${userId}/status/`,
                'POST',
                JSON.stringify({ status: newStatus }),
                Header
            );
            if (response.ok) {
                // setIsActive(prev => !prev);
                console.error("Failed to update status:", response.statusText);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    // if (loading) {
    //     return <CircularProgress />;
    // }

    return (
        <FormControlLabel
            control={
                <Switch
                    checked={isActive}
                    onChange={toggleActiveStatus}
                    color="primary"
                />
            }
            label={isActive ? "User is Active" : "User is Inactive"}
        />
    );
};

export default ToggleActiveStatus;
