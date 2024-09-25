import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import UsersForm from '../forms/UsersForm';
import DealsForm from '../forms/DealsForm';
import AccountsForm from '../forms/AccountsForm';
import ContactsForm from '../forms/ContactsForm';
import { fetchData, Header } from '../FetchData';
import { DealUrl, UserUrl, UsersUrl, AccountsUrl, ContactUrl } from '../../services/ApiUrls';
import { SelectChangeEvent } from '@mui/material';
import { FaEdit } from 'react-icons/fa';
import { DealFormData, ContactFormData, AccountFormData, UserFormData , ModalProps, Deals, convertCountryNameToCode, FormErrors} from './types';
import { useState, useEffect } from 'react';
import { User } from '../forms/types';


const buttonStyle = {
  backgroundColor: '#65558F',
  color: 'white',
  borderRadius: '30px',
  padding: '10px 20px',
  width: '100px', // Fixed width
  height: '36px', // Fixed height
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '#89829e',
  },
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #0000000e',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
};


export default function DynamicModal({ mode, page, id, data, icon, text, onSaveSuccess }: ModalProps) {
  const [dealFormData, setDealFormData] = useState<DealFormData>({
    name: '',
    account: '',
    assigned_to: [],
    contacts: [],
    website: '',
    stage: 'ASSIGNED LEAD',
    deal_source: 'NONE',
    industry: 'ADVERTISING',
    currency: 'USD',
    country: 'US',
    value: 0,
    probability: 0,
    close_date: '',
    description: '',
    tags: [],
  });
  const [userFormData, setUserFormData] = useState<UserFormData>({ name: '' });
  const [contactFormData, setConactFormData] = useState<ContactFormData>({ name: '' });
  const [accountFormData, setAccountFormData] = useState<AccountFormData>({
      name: '',
      phone: '',
      email: '', // Default value from your structure
      billing_address_line: '',
      billing_street: '',
      billing_city: '',
      billing_state: '',
      billing_postcode: '',
      billing_country: 'GB', // Default value from your structure
      contact_name: '',
      teams: [],
      assigned_to: [],
      tags: [],
      account_attachment: [],
      website: '',
      status: 'open', // Default value from your structure
      deal: ''
   });
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState(false);

  const handleOpen = () => {
    if (mode === 'edit') {
      const deals: Deals = data.deals;
      const myDeal: DealFormData | undefined = data.deals.find((deal: any) => deal.id === id);
      if (myDeal) {
        console.log('Pre-populating form with data:', myDeal);
        const filteredDeal: DealFormData = {
          name: myDeal.name,
          account: myDeal.account,
          assigned_to: myDeal.assigned_to.map(user => user.id),
          contacts: myDeal.contacts.map(contact => contact.id),
          website: myDeal.website,
          stage: myDeal.stage,
          deal_source: myDeal.deal_source,
          industry: myDeal.industry,
          currency: myDeal.currency,
          country: convertCountryNameToCode(myDeal.country),
          value: myDeal.value,
          probability: myDeal.probability,
          close_date: myDeal.close_date,
          description: myDeal.description,
          tags: myDeal.tags
        };
        
        setDealFormData(filteredDeal);
      } else {
        console.error('Deal not found!');
      }
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (mode === 'edit' && data) {
      switch (page) {
        case 'Deals':
          setDealFormData((prevState) => ({
            ...prevState,
            ...data,
          }));
          break;
        case 'Contacts':
          setConactFormData((prevState) => ({
            ...prevState,
            ...data,
          }));
          break;
        case 'Accounts':
          setAccountFormData((prevState) => ({
            ...prevState,
            ...data,
          }));
          break;
        case 'Users':
          setUserFormData((prevState) => ({
            ...prevState,
            ...data,
          }));
          break;
        default:
          console.error('Invalid page type');
      }
    }
  }, [mode, data, page]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>
  ) => {
    const { name, value } = event.target;

    switch (page) {
      case 'Deals':
        setDealFormData((prevState) => ({
          ...prevState,
          [name]: name === 'contacts' ? [value] : value,
        }));
        break;
      case 'Contacts':
        setConactFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        break;
      case 'Accounts':
        setAccountFormData((prevState) => ({
          ...prevState,
          [name]: name === 'contacts' ? [value] : value,
        }));
        break;
      case 'Users':
        setUserFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        break;
      default:
        console.error('Invalid page type');
    }
  };

  // const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const handleAutocompleteChange = (
    event: React.ChangeEvent<{}>,
    newValue: User[]
  ) => {
    const selectedUserIds = newValue.map(user => user.id);
    // setSelectedUserIds(selectedIds); // Extract the selected user IDs
  
    switch (page) {
      case 'Deals':
        setDealFormData((prevState) => ({
          ...prevState,
          assigned_to: selectedUserIds,
        }));
        break;
      case 'Contacts':
        setConactFormData((prevState) => ({
          ...prevState,
          assigned_to: selectedUserIds,
        }));
        break;
      case 'Accounts':
        setAccountFormData((prevState) => ({
          ...prevState,
          assigned_to: selectedUserIds,
        }));
        break;
      case 'Users':
        setUserFormData((prevState) => ({
          ...prevState,
          assigned_to: selectedUserIds,
        }));
        break;
      default:
        console.error('Invalid page type');
    }
  };

  const handleSave = async () => {
    setErrors({});

    console.log('Save button clicked');
    // Define base URLs for different pages
    const baseUrl = {
      Deals: DealUrl,
      Contacts: ContactUrl,
      Accounts: AccountsUrl,
      Users: UsersUrl,
    }[page];
  
    // Define the URL and HTTP method based on mode (add or edit)
    const url = mode === 'add' ? `${baseUrl}/` : `${baseUrl}/${id}/`;
    const method = mode === 'add' ? 'POST' : 'PUT';
    const headers = Header;
  
    // Define the form data based on the current page
    let formData;
    switch (page) {
      case 'Deals':
        formData = dealFormData;
        break;
      case 'Contacts':
        formData = contactFormData;
        break;
      case 'Accounts':
        formData = accountFormData;
        break;
      case 'Users':
        formData = userFormData;
        break;
      default:
        console.error('Invalid page type');
        return;
    }
  
    try {
      const data = await fetchData(url, method, JSON.stringify(formData), headers);
  
      // Handle errors returned from the backend
      if (data.error) {
        setError(true);
        console.error('Error:', data.error);
        setErrors(data.errors);
        return;
      }
  
      if (typeof onSaveSuccess === 'function') {
        await onSaveSuccess();
      }
      handleClose();

    } catch (error) {
      console.error("Error during save:", error);
      setError(true);
    }
  };
  
  

  const renderForm = () => {
    switch (page) {
      case 'Users':
        return <UsersForm mode={mode} handleInputChange={handleInputChange} formData={userFormData} data={data} />;
      case 'Contacts':
        return <ContactsForm mode={mode} handleInputChange={handleInputChange} formData={contactFormData} data={data} />;
      case 'Accounts':
        return <AccountsForm mode={mode} handleInputChange={handleInputChange} handleAutocompleteChange={handleAutocompleteChange} formData={accountFormData} data={data} errors={errors} />;
      case 'Deals':
        return <DealsForm mode={mode} handleInputChange={handleInputChange} handleAutocompleteChange={handleAutocompleteChange} formData={dealFormData} data={data} errors={errors}/>;
      default:
        return null;
    }
  };

  return (
    <>
      {text ? (
        <span style={{ cursor: 'pointer' }} onClick={handleOpen}>
          Edit
        </span>
      ) : icon && mode === 'edit' ? (
        <FaEdit style={{fill: '#1A3353', cursor: 'pointer', marginRight: '10px' }} onClick={handleOpen} />
      ) : (
        <Button onClick={handleOpen} sx={buttonStyle}>
          {mode === 'add' ? 'Add' : 'Edit'}
        </Button>
      )}

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            {mode === 'add' ? `Add to ${page}` : `Edit ${page}`}
          </Typography>
          <Box id="modal-description" sx={{ mt: 2 }}>
            {renderForm()}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="contained" sx={buttonStyle} onClick={handleSave}>
              {mode === 'add' ? 'Save' : 'Update'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
