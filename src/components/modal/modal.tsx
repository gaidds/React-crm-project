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
import { DealUrl, UsersUrl, AccountsUrl, ContactUrl } from '../../services/ApiUrls';
import { SelectChangeEvent } from '@mui/material';
import { FaEdit } from 'react-icons/fa';
import { DealFormData, ContactFormData, AccountFormData, UserFormData , ModalProps, Deals, convertCountryNameToCode, FormErrors, Profile} from './types';
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

  const [userFormData, setUserFormData] = useState<UserFormData>({ 
      first_name: '',
      last_name: '',
      email: '',
      profile_pic: null,
      role: 'USER',
      address_line: '',
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: 'US',
      has_marketing_access: false,
      has_sales_access: false,
      phone: '',
  });

  const [contactFormData, setConactFormData] = useState<ContactFormData>({ name: '' });
  const [accountFormData, setAccountFormData] = useState<AccountFormData>({ name: '' });
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState(false);
  const [userErrors, setUserErrors] = useState<FormErrors>({});

  const handleOpen = () => {
    if (mode === 'edit') {
      if ( page === 'Deals'){
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
       };
       if( page === 'Users'){
          const myUser: Profile | undefined = data.active_users.active_users.find((user: any) => user.user_details.id === id);
          if (myUser) {
            console.log('Pre-populating form with data:', myUser);
            const filteredUser: UserFormData = {
                first_name: myUser.user_details.first_name,
                last_name: myUser.user_details.last_name,
                email: myUser.user_details.email,
                profile_pic: myUser.user_details.profile_pic,
                role: myUser.role,
                address_line: myUser.address.address_line,
                street: myUser.address.street,
                city: myUser.address.city,
                state: myUser.address.state,
                postcode: myUser.address.postcode,
                country: convertCountryNameToCode(myUser.address.country),
                has_marketing_access: myUser.has_marketing_access,
                has_sales_access: myUser.has_sales_access,
                phone: myUser.phone,
            };
            setUserFormData(filteredUser);
          } else {
            console.error('User not found!');
          }
       };
    };
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
          [name]: value,
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

  const handleAutocompleteChange = (
    event: React.ChangeEvent<{}>,
    newValue: User[]
  ) => {
    const selectedUserIds = newValue.map(user => user.id);
  
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
        if (page === "Users") {
          setErrors(data?.errors?.profile_errors);
          setUserErrors(data?.errors?.user_errors);
      } else {
          setErrors(data?.errors);
      }
        console.log(errors)
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
        return <UsersForm mode={mode} handleInputChange={handleInputChange} formData={userFormData} data={data} errors={errors} userErrors={userErrors} />;
      case 'Contacts':
        return <ContactsForm mode={mode} handleInputChange={handleInputChange} formData={contactFormData} data={data} />;
      case 'Accounts':
        return <AccountsForm mode={mode} handleInputChange={handleInputChange} formData={accountFormData} data={data} />;
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
