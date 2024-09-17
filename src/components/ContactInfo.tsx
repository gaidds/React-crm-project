import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import Image from './Image/Image';

interface ContactDetailsProps {
  profilePic: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ profilePic, fullName, email, phone, address }) => {
  return (
    <Box sx={{ flex: 1, marginRight: '20px', backgroundColor: '#E5E5E5', borderRadius: '30px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontSize: '24px', fontWeight: 400, lineHeight: '16.8px', textAlign: 'left', marginBottom: '10px', padding: '20px' }}>
          Contact Details
        </Typography>
        <Avatar
          src={profilePic}
          alt={email}
          sx={{ width: 120, height: 120, marginBottom: '20px', border: '2px solid white' }}
        />
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a3353f0' }}>
          {fullName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {email}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '10px' }}>
          Marketing Advisor
        </Typography>
        {/* Phone Icon and Number */}
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
          <FaPhone style={{ marginRight: '8px', color: '#1a3353f0', fontSize: '14px' }} />
          <Typography variant="body1">
            {phone}
          </Typography>
        </Box>
        {/* Location Icon and Address */}
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
          <FaMapMarkerAlt style={{ marginRight: '8px', color: '#1a3353f0', fontSize: '14px' }} />
          <Typography variant="body2" color="textSecondary">
            {address}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactDetails;
