import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import Image from './Image/Image';

interface ContactDetailsProps {
  src: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ src, fullName, email, phone, address, department }) => {
  return (
    <Box sx={{ flex: 1, marginRight: '20px', backgroundColor: '#E5E5E5', borderRadius: '30px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',  height:'100%', maxWidth:'400px'}}>
      <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}} paddingTop={3}>
        <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontSize: '24px', fontWeight: 400, lineHeight: '16.8px', textAlign: 'left', marginBottom: '10px', padding: '20px' }}>
          Contact Details
        </Typography>
        <Box sx={{ width: 130, height: 130, marginBottom: '20px'}}>
          <Image
          src={src}
          alt={email}
          />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a3353f0' }}>
          {fullName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {email}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '10px' }}>
          {department}
        </Typography>
        {/* Phone Icon and Number */}
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '10px',
            }}
          >
            <FaPhone style={{ marginRight: '8px', color: '#1a3353f0', fontSize: '14px' }} />
            <Typography variant="body1">
              {phone ? `${phone.slice(0, 3)} ${phone.slice(3)}` : ''}
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
