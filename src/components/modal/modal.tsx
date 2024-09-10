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

const buttonStyle = {
  backgroundColor: '#65558F',
  color: 'white',
  borderRadius: '30px', 
  padding: '10px 20px', 
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

type ModalProps = {
  mode: 'add' | 'edit';
  page: 'Users' | 'Contacts' | 'Accounts' | 'Deals';
  id?: string;
  data: any;
  icon?: boolean;
};

export default function DynamicModal({ mode, page, id, data, icon }: ModalProps) {
  const [formData, setFormData] = React.useState<any>({});
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>
  ) => {
    const { name, value } = event.target;
    if ('value' in event.target) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    const baseUrl = {
      'Deals': DealUrl,
      'Contacts': ContactUrl,
      'Accounts': AccountsUrl,
      'Users': UsersUrl
    }[page];

    const url = mode === 'add'
      ? `${baseUrl}/`
      : `${baseUrl}/${id}/`;
    
    const method = mode === 'add' ? 'POST' : 'PUT';
    const headers = Header;

    fetchData(url, method, JSON.stringify(formData), headers)
      .then(data => {
        console.log('Success:', data);
        handleClose();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const renderForm = () => {
    switch (page) {
      case 'Users':
        return <UsersForm mode={mode} handleInputChange={handleInputChange} formData={formData} data={data}/>;
      case 'Contacts':
        return <ContactsForm mode={mode} handleInputChange={handleInputChange} formData={formData} data={data}/>;
      case 'Accounts':
        return <AccountsForm mode={mode} handleInputChange={handleInputChange} formData={formData} data={data}/>;
      case 'Deals':
        return <DealsForm mode={mode} handleInputChange={handleInputChange} formData={formData} data={data}/>;
      default:
        return null;
    }
  };

  return (
    <>
     {icon && mode === 'edit' ? (
        <FaEdit style={{ cursor: 'pointer', marginRight: '10px' }} onClick={handleOpen} />
      ) : (
        <Button onClick={handleOpen} sx={buttonStyle}>
          {mode === 'add' ? 'Add' : 'Edit'}
        </Button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
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
