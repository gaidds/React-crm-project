import React, { useEffect, useState } from 'react';
import {
  Card,
  Link,
  Button,
  Avatar,
  Divider,
  TextField,
  Box,
  IconButton,
  Typography,
  AvatarGroup,
} from '@mui/material';
import {
  Fa500Px,
  FaAccusoft,
  FaAd,
  FaAddressCard,
  FaEnvelope,
  FaRegAddressCard,
  FaStar,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaEllipsisH,
} from 'react-icons/fa';
import { CustomAppBar } from '../../components/CustomAppBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { AntSwitch } from '../../styles/CssStyled';
import { ContactUrl } from '../../services/ApiUrls';
import { fetchData, Header } from '../../components/FetchData';
import MyContext, { useMyContext } from '../../context/Context';

type response = {
  created_by: string;
  created_on: string;
  created_on_arrow: string;
  date_of_birth: string;
  department: string;
  description: string;
  do_not_call: boolean;
  facebook_url: string;
  first_name: string;
  lastname: string;
  id: string;
  is_active: boolean;
  language: string;
  last_name: string;
  linked_in_url: string;
  mobile_number: string;
  organization: string;
  primary_email: string;
  salutation: string;
  secondary_email: string;
  secondary_number: string;
  title: string;
  twitter_username: string;
  address_line: string;
  city: string;
  country: string;
  postcode: string;
  state: string;
  street: string;
  name: string;
  website: string;
  profile_pic: string;
};

export const formatDate = (dateString: any) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function ContactDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [contactDetails, setContactDetails] = useState<response | null>(null);
  const [addressDetails, setAddressDetails] = useState<response | null>(null);
  const [org, setOrg] = useState<response | null>(null);
  const { userRole, userId } = useMyContext();

  useEffect(() => {
    getContactDetail(state.contactId.id);
  }, [state.contactId.id]);

  const getContactDetail = (id: any) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };
    fetchData(`${ContactUrl}/${id}/`, 'GET', null as any, Header).then(
      (res) => {
        // console.log(res, 'res');
        if (!res.error) {
          setContactDetails(res?.contact_obj);
          setAddressDetails(res?.address_obj);
          setOrg(res?.org);
        }
      }
    );
  };

  //   useEffect(() => {
  // navigate(-1)
  //     fetchData(`${ContactUrl}/${state.contactId}/`, 'GET', null as any, Header)
  //       .then((data) => {
  //         if (!data.error) {
  // setData(Object.assign({}, data, { cases: data.cases }));

  //           setContactDetails(data.contact_obj)
  //           setNewaddress(...contactDetails, {
  //             addreslane: data.contact_obj.address.address_line,
  //             city: data.contact_obj.address.city,
  //             state: data.contact_obj.address.state,
  //             postcode: data.contact_obj.address.postcode,
  //             country: data.contact_obj.address.country,
  //             street: data.contact_obj.address.street
  //           })
  //         }
  //       })
  //   }, [])

  const backbtnHandle = () => {
    navigate('/app/contacts');
  };

  const editHandle = () => {
    // navigate('/contacts/edit-contacts', { state: { value: contactDetails, address: newAddress } })
    navigate('/app/contacts/edit-contact', {
      state: {
        value: {
          salutation: contactDetails?.salutation,
          first_name: contactDetails?.first_name,
          last_name: contactDetails?.last_name,
          primary_email: contactDetails?.primary_email,
          secondary_email: contactDetails?.secondary_email,
          mobile_number: contactDetails?.mobile_number,
          secondary_number: contactDetails?.secondary_number,
          date_of_birth: contactDetails?.date_of_birth,
          organization: contactDetails?.organization,
          title: contactDetails?.title,
          language: contactDetails?.language,
          do_not_call: contactDetails?.do_not_call,
          department: contactDetails?.department,
          address: addressDetails?.address_line,
          street: addressDetails?.street,
          city: addressDetails?.city,
          state: addressDetails?.state,
          country: addressDetails?.country,
          postcode: addressDetails?.postcode,
          description: contactDetails?.description,
          linked_in_url: contactDetails?.linked_in_url,
          facebook_url: contactDetails?.facebook_url,
          twitter_username: contactDetails?.twitter_username,
          profile_pic: contactDetails?.profile_pic,
        },
        id: state?.contactId?.id,
        countries: state?.countries,
      },
    });
  };

  const module = 'Contacts';
  const crntPage = 'Contact Detail';
  const backBtn = 'Back To Contacts';
  console.log(addressDetails, 'address');
  // console.log(state, 'contact');
  interface AssignedToItem {
    id: string;
  }

  const showEditButton =
    userRole === 'ADMIN' ||
    (userRole === 'SALES MANAGER' && contactDetails?.created_by === userId);
  return (
    <Box sx={{ height: '100%', border: '1px solid blue', p: '16px' }}>
      <Box sx={{ height: '36px' }}>Header</Box>

      <Box
        sx={{
          borderRadius: '16px',
          boxSizing: 'border-box', // Fixed the property name (use camelCase)
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          position: 'absolute', // Use absolute positioning
          p: '60px',
          width: 'calc(100% - 260px)',
          height: '80%',
          overflow: 'hidden',
          border: '1px solid red',
          ml: '16px',
          mt: '96px',
        }}
      >
        {/* Left section - Profile picture and name */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

            width: '50%',
          }}
        >
          <Avatar
            style={{
              width: '250px', // Size of the avatar
              height: '250px',
              marginBottom: '32px', // Space between avatar and name
            }}
            alt={contactDetails?.first_name || 'User Avatar'}
            src={contactDetails?.profile_pic}
          />
          <div
            style={{
              textAlign: 'center',
              marginBottom: '84px',
            }}
          >
            <span style={{ fontSize: '32px' }}>
              {contactDetails?.first_name} {contactDetails?.last_name}
            </span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '24px' }}>
              {contactDetails?.description}
            </span>
          </div>
        </Box>

        {/* Right section - Contact information */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '50%',
          }}
        >
          <Typography variant="h4" sx={{ mb: '16px', mt: '1px' }}>
            Contact Info
          </Typography>

          <Divider
            sx={{
              mb: '32px', // Margin bottom
              width: '100%', // Full width
              backgroundColor: 'black', // Set the color of the line to black
              height: '1px', // Optional: Adjust the thickness of the line
            }}
          />

          {/* Phone */}
          <Box sx={{ display: 'flex', mb: '32px' }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: '120px' }}>
              Phone
            </Typography>
            <Typography>
              {contactDetails?.mobile_number || '+91 23XXXXXXXX'}
            </Typography>
          </Box>

          {/* Work email */}
          <Box sx={{ display: 'flex', mb: '32px' }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: '120px' }}>
              Work email
            </Typography>
            <Typography>
              {contactDetails?.primary_email || 'bessie.warren@mail.com'}
            </Typography>
          </Box>

          {/* Website */}
          <Box sx={{ display: 'flex', mb: '32px' }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: '120px' }}>
              Website
            </Typography>
            <Typography>
              {contactDetails?.website || 'www.bessie.com'}
            </Typography>
          </Box>

          {/* Language */}
          <Box sx={{ display: 'flex', mb: '32px' }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: '120px' }}>
              Language
            </Typography>
            <Typography>{contactDetails?.language || 'English'}</Typography>
          </Box>

          {/* Account */}
          <Box sx={{ display: 'flex', mb: '32px' }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: '120px' }}>
              Account
            </Typography>
            <Typography>{contactDetails?.street}</Typography>
          </Box>

          {/* Address */}
          <Box sx={{ display: 'flex', mb: '100px' }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: '120px' }}>
              Address
            </Typography>
            <Typography>{contactDetails?.street}</Typography>
          </Box>

          {/* Social Media Links */}
          <Box sx={{ display: 'flex', gap: '60px', mt: '32px' }}>
            <a
              href={contactDetails?.linked_in_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton aria-label="LinkedIn" sx={{ color: '#0077b5' }}>
                <FaLinkedin size={48} />
              </IconButton>
            </a>
            <a
              href={contactDetails?.twitter_username}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton aria-label="Twitter" sx={{ color: '#1da1f2' }}>
                <FaTwitter size={48} />
              </IconButton>
            </a>
            <a
              href={contactDetails?.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton aria-label="Facebook" sx={{ color: '#3b5998' }}>
                <FaFacebook size={48} />
              </IconButton>
            </a>
            {/* <IconButton aria-label="More options" sx={{ color: '#000000' }}>
              <FaEllipsisH size={24} />
            </IconButton> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
