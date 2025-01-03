import React, { useEffect, useState } from 'react';
import { Avatar, Divider, Box, IconButton, Typography } from '@mui/material';
import { FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { AccountsUrl, ContactUrl } from '../../services/ApiUrls';
import { fetchData, Header } from '../../components/FetchData';
import { useMyContext } from '../../context/Context';
import DynamicModal from '../../components/modal/modal';
import '../users/styles.css';
import DescriptionComponent from '../../components/ContactsDescription';
import './styles.css';

interface Contact {
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
  address: {
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  name: string;
  website: string;
  profile_pic: string;
  accounts: any;
}

export const formatDate = (dateString: any) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function ContactDetails() {
  const { contactId } = useParams<{ contactId: string }>();
  const [contactDetails, setContactDetails] = useState<Contact | null>(null);
  const setAddressDetails = useState<Contact | null>(null)[1];
  const [accounts, setAccounts] = useState<string[]>([]);
  const { userRole, userId } = useMyContext();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (contactId) {
      fetchContact();
      getContacts();
      getAccounts();
    }
  }, [contactId]);

  const getContacts = async () => {
    try {
      await fetchData(`${ContactUrl}`, 'GET', null as any, Header).then(
        (res) => {
          if (!res.error) {
            setData(res || []);
          }
        }
      );
    } catch (erro) {
      console.error('Error fetching data', erro);
    }
  };

  const fetchContact = async () => {
    try {
      const response = await fetchData(
        `${ContactUrl}/${contactId}`,
        'GET',
        null as any,
        Header
      );

      if (response) {
        setContactDetails(response.contact_obj);
        setAddressDetails(response.address_obj);
        setAccounts(response.account_obj);
      } else {
        console.error('No contact data found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAccounts = async () => {
    try {
      await fetchData(`${AccountsUrl}`, 'GET', null as any, Header).then(
        (res) => {
          if (!res.error) {
            setAccounts(
              res?.active_accounts?.open_accounts
                .filter((account: any) =>
                  account?.contacts?.find(
                    (contact: any) => contact?.id === contactId
                  )
                )
                .map((a: any) => a.name) || []
            );
          }
        }
      );
    } catch (erro) {
      console.error('Error fetching data', erro);
    }
  };

  const handleSaveDescription = (updatedDescription: string) => {
    const submitForm = async () => {
      const data = { description: updatedDescription };
      try {
        const res = await fetchData(
          `${ContactUrl}/${contactId}/`,
          'PATCH',
          JSON.stringify(data),
          Header
        );
        if (!res.error) {
          await fetchContact(); // Re-fetch contact data after updating
        } else {
          console.error('Error updating description:', res.error);
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    };

    submitForm();
  };

  const showEditButton =
    userRole === 'ADMIN' ||
    (userRole === 'SALES MANAGER' && contactDetails?.created_by === userId);

  return (
    <div className="contact-page-container">
      <div className="contact-page-header">
        {showEditButton && (
          <DynamicModal
            page="Contacts"
            id={contactDetails?.id}
            mode="edit"
            data={data}
            onSaveSuccess={async () => {
              await fetchContact();
            }}
          />
        )}
      </div>
      <div className="contact-page-body">
        <div className="contact-page-left-section">
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
                width: '250px',
                height: '250px',
                marginBottom: '32px',
              }}
              alt={contactDetails?.first_name || 'User Avatar'}
              src={contactDetails?.profile_pic}
            />
            <div style={{ textAlign: 'center', marginBottom: '84px' }}>
              <span style={{ fontSize: '32px' }}>
                {contactDetails?.first_name} {contactDetails?.last_name}
              </span>
            </div>
            <div style={{ textAlign: 'center' }}>
              {contactDetails && (
                <DescriptionComponent
                  initialDescription={contactDetails.description}
                  onSave={handleSaveDescription}
                />
              )}
            </div>
          </Box>
        </div>

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
              margin: '0 1024px 32px 0',
              width: 'calc(100% - 80px)',
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
              Department
            </Typography>
            <Typography>
              {contactDetails?.department || 'www.bessie.com'}
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
            <Typography>
              {accounts?.length > 0
                ? accounts.map((account, index) => (
                    <React.Fragment key={index}>
                      {account}
                      <br />
                    </React.Fragment>
                  ))
                : 'No accounts available'}
            </Typography>
          </Box>

          {/* Address */}
          <Box sx={{ display: 'flex', mb: '32px' }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: '120px' }}>
              Address
            </Typography>
            <Typography>
              {contactDetails?.address?.street},<br />
              {contactDetails?.address?.postcode},{' '}
              {contactDetails?.address?.city},<br />
              {contactDetails?.address?.state},<br />
              {contactDetails?.address?.country}
            </Typography>
          </Box>

          {/* Social Media Links */}
          <Box sx={{ display: 'flex', gap: '32px' }}>
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
          </Box>
        </Box>
      </div>
    </div>
  );
}
